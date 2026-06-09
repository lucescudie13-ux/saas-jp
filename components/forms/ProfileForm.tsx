"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JLPT_LEVELS, LEVEL_LABELS } from "@/lib/constants";
import type { ProfileRow } from "@/types/database.types";

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [form, setForm] = useState({
    display_name: profile.display_name ?? "",
    current_level: profile.current_level,
    target_level: (profile.target_level ?? "N4") as import("@/lib/constants").JlptLevel,
    target_deadline: profile.target_deadline ?? "",
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true); setNote(null);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        display_name: form.display_name,
        current_level: form.current_level,
        target_level: form.target_level,
        target_deadline: form.target_deadline || null,
      }),
    });
    setSaving(false);
    if (res.ok) { setNote("Profil mis à jour ✓"); router.refresh(); }
    else setNote("Une erreur est survenue.");
  }

  return (
    <div className="pcard">
      <h3>Mon profil</h3>
      <div className="pfield">
        <label htmlFor="dn">Nom affiché</label>
        <input id="dn" value={form.display_name} onChange={(e) => set("display_name", e.target.value)} />
      </div>
      <div className="pfield">
        <label htmlFor="cl">Niveau actuel</label>
        <select id="cl" value={form.current_level} onChange={(e) => set("current_level", e.target.value as import("@/lib/constants").JlptLevel)}>
          {JLPT_LEVELS.map((lv) => <option key={lv} value={lv}>{lv} — {LEVEL_LABELS[lv]}</option>)}
        </select>
      </div>
      <div className="pfield">
        <label htmlFor="tl">Niveau visé</label>
        <select id="tl" value={form.target_level ?? "N4"} onChange={(e) => set("target_level", e.target.value as import("@/lib/constants").JlptLevel)}>
          {JLPT_LEVELS.map((lv) => <option key={lv} value={lv}>{lv} — {LEVEL_LABELS[lv]}</option>)}
        </select>
      </div>
      <div className="pfield">
        <label htmlFor="dl">Échéance</label>
        <input id="dl" type="date" value={form.target_deadline ?? ""} onChange={(e) => set("target_deadline", e.target.value)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn primary" onClick={save} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
        {note && <span className="verify-note">{note}</span>}
      </div>
    </div>
  );
}
