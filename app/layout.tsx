export const metadata = { title: "SOP Chat", description: "Chat with your Slite SOPs" };

import "./../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
