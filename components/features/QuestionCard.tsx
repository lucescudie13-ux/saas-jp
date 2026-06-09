"use client";

import { useState } from "react";

// Carte question/réponse avec révélation au clic.
export function QuestionCard({ prompt, answer }: { prompt: string; answer: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="qcard">
      <div className="qprompt">{prompt}</div>
      {shown ? (
        <div className="qanswer">{answer}</div>
      ) : (
        <button className="btn ghost sm" onClick={() => setShown(true)}>Voir la réponse</button>
      )}
    </div>
  );
}
