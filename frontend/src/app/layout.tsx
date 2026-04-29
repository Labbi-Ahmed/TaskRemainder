import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Content Reminder - Save Now, Act Later",
  description: "The intelligent system to help you revisit saved YouTube videos, articles, and documents at the right time.",
  keywords: ["productivity", "reminder", "save later", "task management", "content organization"],
  openGraph: {
    title: "Smart Content Reminder",
    description: "Never forget your saved content again.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
