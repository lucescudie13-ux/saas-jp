import { ConjugationBrowser } from "@/components/features/ConjugationBrowser";

export default function ConjugationPage() {
  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Conjugaison</span>
        <h1>Règles de conjugaison</h1>
      </div>
      <ConjugationBrowser />
    </>
  );
}
