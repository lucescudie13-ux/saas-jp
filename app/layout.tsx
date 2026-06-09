import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "日々 Hibi — Apprends le japonais, chaque jour",
  description:
    "Apprends le japonais jour après jour : parcours structuré par niveau JLPT (vocabulaire, grammaire, dialogues, compréhension) et révision intelligente.",
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23C2402F'/%3E%3Ctext x='50' y='73' font-size='62' text-anchor='middle' fill='white' font-family='serif'%3E日%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: "#C2402F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
