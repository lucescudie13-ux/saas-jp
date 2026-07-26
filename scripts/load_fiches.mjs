// Charge les fiches de vocabulaire détaillées (extraites des PDF) dans la base
// distante, en remplissant les colonnes riches de vocab_items par slug.
// Usage : node scripts/load_fiches.mjs <fiches_LEVEL.json> [apply|dry]
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const FILE = process.argv[2];
const MODE = process.argv[3] || "dry";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const fiches = JSON.parse(readFileSync(FILE, "utf8"));

// Mappe une fiche parsée vers les colonnes riches de vocab_items.
function mapFiche(f) {
  return {
    usage: f.usage || null,
    examples: (f.examples || []).map((e) => ({ jp: e.jp, yomi: e.lecture || "", fr: e.fr })),
    readings: (f.readings || []).map((r) => ({ k: r.kana, v: r.tr, prec: r.prec || "" })),
    confuse: f.confuse ? [{ g: "", n: "", d: f.confuse }] : [],
    keys: f.kanji || [],
    sens: {
      categoryBlock: f.categoryBlock || null,
      frequency: f.frequency || null,
      verbGroup: f.verbGroup || null,
      category: f.category || null,
      graphieType: f.graphieType || null,
    },
  };
}

console.log(`Fichier : ${FILE} · ${fiches.length} fiches · mode ${MODE}`);
if (MODE !== "apply") {
  console.log("Exemple de mapping (1re fiche) :", JSON.stringify(mapFiche(fiches[0]), null, 1).slice(0, 600));
  process.exit(0);
}

let ok = 0, fail = 0;
const B = 25;
for (let i = 0; i < fiches.length; i += B) {
  const chunk = fiches.slice(i, i + B);
  await Promise.all(chunk.map(async (f) => {
    const { error } = await db.from("vocab_items").update(mapFiche(f)).eq("slug", f.slug);
    if (error) { fail++; if (fail <= 5) console.error(f.slug, error.message); } else ok++;
  }));
  process.stdout.write(`\r  ${Math.min(i + B, fiches.length)}/${fiches.length} (ok ${ok}, fail ${fail})`);
}
console.log(`\nTerminé : ${ok} mis à jour, ${fail} échecs.`);
