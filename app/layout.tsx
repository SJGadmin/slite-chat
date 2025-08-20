// app/layout.tsx
export const metadata = {
  title: "SJG SOP",
  description: "What ails you child?"
};

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link
          rel="icon"
          href="https://assets.agentfire3.com/uploads/sites/1849/2024/10/favicon.png"
        />
        {/* Optional: social banner for link previews */}
        <meta
          property="og:image"
          content="https://assets.agentfire3.com/uploads/sites/1849/2024/12/Facebook-Social-Banner.png"
        />
        <meta property="og:title" content="SJG SOP" />
        <meta property="og:description" content="What ails you child?" />
      </head>
      <body>{children}</body>
    </html>
  );
}
