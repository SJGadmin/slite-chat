// app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // Ensure Node runtime on Vercel
export const dynamic = "force-dynamic";   // Avoid caching issues

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const user = String(message ?? "").trim();

    if (!user) {
      return NextResponse.json({ answer: "Ask me any SOP question to start. 😊" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { answer: "Missing OPENAI_API_KEY. Add it in Vercel → Settings → Environment Variables." },
        { status: 500 }
      );
    }

    // System rules: no hallucinations, ask for clarification, tone/personable
    const system =
      [
        "You are the SJG SOP assistant. Follow these rules strictly:",
        "- Answer ONLY with procedures that are in SJG SOPs.",
        "- If the request is vague or not covered, ASK a short clarifying question (e.g., which lead source).",
        "- Do NOT invent steps. If unknown, say you don't have that SOP and ask for specifics.",
        "- Keep responses concise, step-by-step, and formatted cleanly. Use numbered or bulleted lists when helpful.",
        "- Tone: polished modern, friendly, light humor/puns are okay in moderation.",
      ].join(" ");

    // Call OpenAI (non-streaming for simplicity)
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 800,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { answer: `OpenAI error (${resp.status}): ${text}` },
        { status: 500 }
      );
    }

    const data = await resp.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      "I couldn’t find that directly in our SOPs. Can you specify the exact topic or lead source?";

    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json(
      { answer: `Server error: ${err?.message ?? "unknown error"}` },
      { status: 500 }
    );
  }
}
