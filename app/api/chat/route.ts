export const dynamic = "force-dynamic"; // ensure serverless on Vercel

type SliteHit = any;

const SLITE_BASE = "https://api.slite.com";

async function fetchWithTimeout(url: string, options: RequestInit = {}, ms = 4000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    // @ts-ignore
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

// --- Slite search (modern first, fallback to legacy) ---
async function sliteSearch(query: string, hits = 4) {
  // Modern
  try {
    const url = new URL(`${SLITE_BASE}/v1/search-notes`);
    url.searchParams.set("query", query);
    url.searchParams.set("hitsPerPage", String(hits));
    const r = await fetchWithTimeout(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.SLITE_API_KEY!}`,
        "Content-Type": "application/json"
      }
    }, 4000);
    if (r.ok) {
      const j = await r.json();
      return Array.isArray(j?.hits) ? j.hits : [];
    }
  } catch {}
  // Legacy
  try {
    const r = await fetchWithTimeout(`${SLITE_BASE}/v1/notes.search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SLITE_API_KEY!}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, hitsPerPage: hits })
    }, 4000);
    if (r.ok) {
      const j = await r.json();
      return Array.isArray(j?.hits) ? j.hits : [];
    }
  } catch {}
  return [];
}

async function sliteGet(noteId: string) {
  // Modern
  try {
    const r = await fetchWithTimeout(`${SLITE_BASE}/v1/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${process.env.SLITE_API_KEY!}`,
        "Content-Type": "application/json"
      }
    }, 4000);
    if (r.ok) return await r.json();
  } catch {}
  // Legacy
  try {
    const r = await fetchWithTimeout(`${SLITE_BASE}/v1/notes.get`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SLITE_API_KEY!}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ noteId })
    }, 4000);
    if (r.ok) return await r.json();
  } catch {}
  return null;
}

function toText(x: any): string {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (Array.isArray(x)) return x.map(toText).join(" ");
  if (typeof x === "object") {
    for (const k of ["markdown", "contentMarkdown", "plaintext", "plainText", "text", "content", "body", "value"]) {
      if (k in x && x[k]) return toText(x[k]);
    }
    return Object.values(x).map(toText).join(" ");
  }
  return "";
}

function extractFromNote(noteObj: any) {
  const note = noteObj?.note || noteObj || {};
  const title = note?.title || note?.name || "Untitled";
  const content =
    note?.content?.markdown ??
    note?.contentMarkdown ??
    note?.content?.text ??
    note?.content ??
    note?.body ??
    note?.text ??
    "";
  const text = toText(content);
  return { title, text };
}

function clean(s: string, n = 1800) {
  return (s || "").replace(/\s+/g, " ").trim().slice(0, n);
}

// --- OpenAI helpers ---
async function openaiChat(messages: any[], temperature = 0.2, max_tokens = 600) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature,
      max_tokens,
      messages
    })
  });
  const j = await r.json();
  return j?.choices?.[0]?.message?.content?.trim() || "";
}

async function clarifier(userQuery: string) {
  const system = `
You are a chat assistant whose ONLY job is to ask for clarification when the knowledge base doesn't clearly match.
Do NOT provide answers or facts. Do NOT use outside knowledge.
Write one brief line + 4–7 bullet options (Slack/Markdown-friendly).
Keep under 80 words total. Tone: friendly, direct.
If the user query already implies a category (e.g., "Google LSA"), ask for the next disambiguator (buyer vs seller, first-contact vs follow-up, etc).
`;
  const user = `User query: "${userQuery}"\nGenerate clarifying options helpful for routing SOP lookups.`;
  return await openaiChat([{ role: "system", content: system }, { role: "user", content: user }], 0.2, 180);
}

function buildSystemPrompt() {
  return `
You are an internal assistant for a company. Answer ONLY using the provided Slite excerpts.
If the answer is not supported by the excerpts, respond exactly:
"I don’t have a document that covers that. Can you be more specific?"
Cite sources as [1], [2] based on the excerpt list. Be concise and actionable. Temperature=0 behavior.
`.trim();
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const q: string = (message || "").trim();

    if (!q) {
      return new Response(JSON.stringify({ answer: "Please enter a question." }), { status: 200 });
    }

    // Step 1: Slite search
    const hits: SliteHit[] = await sliteSearch(q, 4);

    // If no hits → ask for clarification (LLM writes only the clarifier)
    if (!hits.length) {
      const c = await clarifier(q);
      return new Response(JSON.stringify({ answer: c || "I don’t have a document that covers that. Can you be more specific?" }), { status: 200 });
    }

    // Step 2: fetch top 1–3 notes and build excerpts list
    const picks = hits.slice(0, 3);
    const notes = [];
    for (const h of picks) {
      const id = h?.noteId || h?.id || h?.objectID || h?.note?.id;
      if (!id) continue;
      const noteObj = await sliteGet(String(id));
      if (!noteObj) continue;
      const { title, text } = extractFromNote(noteObj);
      if (!text) continue;
      notes.push({ title: title || "Untitled", text: clean(text) });
    }

    // If we still have nothing meaningful, ask for clarifier
    if (!notes.length) {
      const c = await clarifier(q);
      return new Response(JSON.stringify({ answer: c || "I don’t have a document that covers that. Can you be more specific?" }), { status: 200 });
    }

    // Step 3: Build excerpts block + ask OpenAI with strict system instructions
    const excerpts = notes
      .map((n, i) => `[[${i + 1}]] ${n.title}\n${n.text}`)
      .join("\n\n---\n\n");

    const system = buildSystemPrompt();
    const user = `Question: ${q}\n\nExcerpts:\n${excerpts}`;
    const answer = await openaiChat(
      [{ role: "system", content: system }, { role: "user", content: user }],
      0.1,
      700
    );

    const final = answer || "I don’t have a document that covers that. Can you be more specific?";
    return new Response(JSON.stringify({ answer: final }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ answer: `⚠️ Error: ${e?.message || String(e)}` }), { status: 200 });
  }
}
