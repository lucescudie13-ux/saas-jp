// Importateur de vocabulaire → vocab_items (base Supabase distante).
// Usage : node scripts/apply_vocab.mjs inspect | apply
// Lit les identifiants service-role depuis .env.local (jamais commit).
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const MODE = process.argv[2] || "inspect";
const SEED = process.argv[3]; // chemin du vocab_seed.json

// --- charge .env.local sans dépendance ---
const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Identifiants Supabase manquants dans .env.local"); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const count = async (like) => {
  let q = db.from("vocab_items").select("*", { count: "exact", head: true });
  if (like) q = q.like("slug", like);
  const { count, error } = await q;
  if (error) throw error;
  return count;
};

async function inspect() {
  console.log("Projet:", url.replace(/^https?:\/\//, "").split(".")[0]);
  console.log("vocab_items total :", await count());
  console.log("  slug like 'n5-%' (ancien plat) :", await count("n5-%"));
  console.log("  slug like 'V-%'  (par leçon)    :", await count("V-%"));
  for (const lv of ["N5", "N4", "N3", "N2", "N1"]) console.log(`  ${lv}:`, await count(`V-${lv}-%`));

  if (!SEED) return;
  const seed = JSON.parse(readFileSync(SEED, "utf8"));
  const seedBy = new Map(seed.map((r) => [r.slug, r]));
  console.log(`\nComparaison au fichier (${seed.length} mots) :`);
  // échantillon de slugs à vérifier mot pour mot
  const samples = ["V-N5-01-001", "V-N5-01-003", "V-N5-23-001", "V-N4-01-001", "V-N3-01-001", "V-N1-01-001"];
  const { data } = await db.from("vocab_items").select("slug,level,type,lemma,reading,gloss").in("slug", samples);
  let mismatch = 0;
  for (const s of samples) {
    const remote = (data || []).find((r) => r.slug === s);
    const local = seedBy.get(s);
    const same = remote && local && remote.lemma === local.lemma && (remote.reading || null) === local.reading && remote.gloss === local.gloss;
    if (!same) mismatch++;
    console.log(`  ${s}: ${same ? "OK" : "DIFF"}  remote=${remote ? remote.lemma + "/" + remote.reading : "∅"}  file=${local ? local.lemma + "/" + local.reading : "∅"}`);
  }
  console.log(mismatch ? `\n⚠ ${mismatch} écart(s) — la base ne correspond pas exactement au fichier.` : "\n✓ Échantillon identique au fichier.");
}

async function apply() {
  const rows = JSON.parse(readFileSync(SEED, "utf8"));
  console.log(`Seed chargé : ${rows.length} mots.`);
  console.log("Avant :", { total: await count(), n5plat: await count("n5-%"), parLecon: await count("V-%") });

  // 1) supprime l'ancien N5 plat (migration 005) — remplacement propre.
  const del = await db.from("vocab_items").delete().like("slug", "n5-%");
  if (del.error) throw del.error;
  console.log("Ancien N5 plat supprimé.");

  // 2) upsert par lots (idempotent sur slug).
  const B = 500;
  for (let i = 0; i < rows.length; i += B) {
    const chunk = rows.slice(i, i + B);
    const { error } = await db.from("vocab_items").upsert(chunk, { onConflict: "slug" });
    if (error) { console.error(`Lot ${i}-${i + chunk.length} échec :`, error.message); process.exit(1); }
    process.stdout.write(`\r  upsert ${Math.min(i + B, rows.length)}/${rows.length}`);
  }
  console.log("\nAprès :", { total: await count(), n5plat: await count("n5-%"), parLecon: await count("V-%") });
  for (const lv of ["N5", "N4", "N3", "N2", "N1"]) {
    console.log(`  ${lv}: ${await count(`V-${lv}-%`)}`);
  }
}

async function diff() {
  const seed = JSON.parse(readFileSync(SEED, "utf8"));
  const seedBy = new Map(seed.map((r) => [r.slug, r]));
  const remote = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from("vocab_items")
      .select("slug,level,type,lemma,reading,gloss").order("slug").range(from, from + PAGE - 1);
    if (error) throw error;
    remote.push(...data);
    if (data.length < PAGE) break;
  }
  const remoteBy = new Map(remote.map((r) => [r.slug, r]));
  const onlyFile = [...seedBy.keys()].filter((s) => !remoteBy.has(s));
  const onlyDb = [...remoteBy.keys()].filter((s) => !seedBy.has(s));
  let fieldDiff = 0; const ex = []; const details = [];
  for (const [slug, l] of seedBy) {
    const r = remoteBy.get(slug); if (!r) continue;
    const dl = r.lemma !== l.lemma, dr = (r.reading || null) !== l.reading, dg = r.gloss !== l.gloss, dv = r.level !== l.level;
    if (dl || dr || dg || dv) {
      fieldDiff++; if (ex.length < 6) ex.push(slug);
      details.push(`${slug}  [${[dl && "lemma", dr && "reading", dg && "gloss", dv && "level"].filter(Boolean).join(",")}]\n   FICHIER: lemma=${l.lemma} reading=${l.reading} gloss=${l.gloss}\n   BASE   : lemma=${r.lemma} reading=${r.reading} gloss=${r.gloss}`);
    }
  }
  const { writeFileSync } = await import("node:fs");
  writeFileSync(SEED.replace(/[^/\\]+$/, "mismatches.txt"), details.join("\n"), "utf8");
  console.log(`Fichier : ${seed.length} mots  |  Base distante : ${remote.length} mots`);
  for (const lv of ["N5", "N4", "N3", "N2", "N1"]) console.log(`  ${lv}:`, await count(`V-${lv}-%`));
  console.log("Slugs seulement dans le FICHIER :", onlyFile.length, onlyFile.slice(0, 5));
  console.log("Slugs seulement dans la BASE   :", onlyDb.length, onlyDb.slice(0, 5));
  console.log("Différences de contenu         :", fieldDiff, ex);
  console.log(onlyFile.length === 0 && onlyDb.length === 0 && fieldDiff === 0
    ? "\n✓ IDENTIQUE À 100 % — la base en ligne = ton fichier (les 7847 mots)."
    : "\n⚠ Des écarts existent (voir ci-dessus).");
}

async function dump() {
  // Génère une migration SQL fidèle à l'état RÉEL de la base distante.
  const { writeFileSync } = await import("node:fs");
  const rows = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from("vocab_items")
      .select("slug,level,type,lemma,reading,gloss,position").order("level").order("position").range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  const esc = (s) => s.replace(/'/g, "''");
  const out = [
    "-- 009_vocab_content_v2.sql — Vocabulaire complet N5→N1 (snapshot fidèle de la base distante).",
    "-- Source : Listes_vocabulaire_JLPT_par_lecon_v2.xlsx. Remplace l'ancien N5 plat (005).",
    "-- Idempotent : on conflict (slug) do update.",
    "delete from vocab_items where slug like 'n5-%';",
    "insert into vocab_items (slug, level, type, lemma, reading, gloss, position) values",
    rows.map((e) => `('${e.slug}','${e.level}','${e.type}','${esc(e.lemma)}',${e.reading == null ? "NULL" : `'${esc(e.reading)}'`},'${esc(e.gloss)}',${e.position})`).join(",\n"),
    "on conflict (slug) do update set level=excluded.level, type=excluded.type, lemma=excluded.lemma, reading=excluded.reading, gloss=excluded.gloss, position=excluded.position;",
    "",
  ].join("\n");
  writeFileSync(SEED, out, "utf8"); // ici SEED = chemin de sortie du .sql
  console.log(`Migration écrite depuis la base : ${rows.length} mots → ${SEED}`);
}

const run = MODE === "apply" ? apply : MODE === "diff" ? diff : MODE === "dump" ? dump : inspect;
run().catch((e) => { console.error(e); process.exit(1); });
