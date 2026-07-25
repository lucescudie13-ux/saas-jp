"use client";

import { useEffect, useState } from "react";
import { getDragonName, setDragonName, DEFAULT_DRAGON_NAME, DRAGON_NAME_MAX } from "@/lib/dragon-name";

/**
 * Champ « nom du dragon » du profil. Le nom est stocké localement (comme la
 * progression) et affiché dans la barre latérale et la page « Mon dragon ».
 */
export function DragonNameField() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(getDragonName());
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const applied = setDragonName(name);
    setName(applied);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="pcard">
      <h3>Ton dragon 🐉</h3>
      <p style={{ color: "var(--ink-soft)" }}>
        Donne un nom à ton compagnon. Il s&apos;affiche dans la barre latérale et sur sa page.
      </p>
      <form onSubmit={save} className="dragon-name-form">
        <input
          className="dragon-name-input"
          value={name}
          maxLength={DRAGON_NAME_MAX}
          onChange={(e) => setName(e.target.value)}
          placeholder={DEFAULT_DRAGON_NAME}
          aria-label="Nom du dragon"
        />
        <button className="btn primary" type="submit">Enregistrer</button>
      </form>
      {saved && <span className="dragon-name-ok" role="status">✓ Nom enregistré</span>}
    </div>
  );
}
