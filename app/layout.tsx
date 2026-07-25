import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "日々 Hibi — Apprends le japonais, chaque jour",
  description:
    "Apprends le japonais jour après jour : parcours structuré par niveau JLPT (vocabulaire, grammaire, dialogues, compréhension) et révision intelligente.",
  // Favicon : app/icon.png (le logo dragon) est détecté automatiquement par Next.
};

export const viewport: Viewport = { themeColor: "#C2402F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
