import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "日々 Hibi — Apprends le japonais, chaque jour",
  description:
    "Apprends le japonais jour après jour : parcours structuré par niveau JLPT (vocabulaire, grammaire, dialogues, compréhension) et révision intelligente.",
  // Favicon : app/icon.png (le logo dragon) est détecté automatiquement par Next.
  manifest: "/manifest.webmanifest",
  applicationName: "Hibi",
  appleWebApp: { capable: true, title: "Hibi", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#C2402F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/*
          Capture de `beforeinstallprompt` AU PLUS TÔT. Chrome/Edge déclenchent
          cet événement dès le chargement de la page, souvent avant que React
          n'ait monté ses composants : un listener posé dans un useEffect arrive
          trop tard et l'invite d'installation est perdue pour de bon (elle ne
          se redéclenche pas). On l'attrape donc ici, on la met de côté sur
          window, et <InstallApp/> la récupère quand il est prêt.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){window.__hibiInstallPrompt=null;" +
              "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();" +
              "window.__hibiInstallPrompt=e;window.dispatchEvent(new Event('hibi-install-ready'));});" +
              "window.addEventListener('appinstalled',function(){window.__hibiInstallPrompt=null;" +
              "window.dispatchEvent(new Event('hibi-installed'));});})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
