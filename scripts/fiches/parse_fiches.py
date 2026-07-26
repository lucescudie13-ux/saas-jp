import sys, re, json, io
import fitz

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

JP = "぀-ヿ㐀-鿿　-〿＀-￯"
def is_kana_only(s):
    s = s.strip().replace("・", "").replace("〜", "").replace("～", "")
    return bool(s) and bool(re.fullmatch("[぀-ヿ]+", s))
def latin_ratio(s):
    letters = re.findall(r"[A-Za-zÀ-ÿ]", s); jp = re.findall("[" + JP + "]", s)
    t = len(letters) + len(jp)
    return (len(letters) / t) if t else 0

def strip_bad(s):
    return "".join(c for c in s if not (0xD800 <= ord(c) <= 0xDFFF) and not (0xE000 <= ord(c) <= 0xF8FF))

def clean(text):
    text = strip_bad(text).replace("\n", " ")
    text = re.sub(r"[ \t]+", " ", text).strip()
    text = re.sub(r"\s*\d+\s*·\s*$", "", text).strip()
    text = re.sub(r"\s+([、。）」』】〕])", r"\1", text)
    text = re.sub(r"([（「『【〔])\s+", r"\1", text)
    text = re.sub("(?<=[" + JP + "]) (?=[" + JP + "])", "", text)
    text = re.sub(r"([A-Za-zÀ-ÿ]) -([A-Za-zÀ-ÿ])", r"\1-\2", text)
    return text.strip()

SECTIONS = ["Lectures et traductions", "Contexte et usage", "Exemples par lecture",
            "À ne pas confondre", "Bloc spécifique"]

def extract_fiches(pdf_path):
    d = fitz.open(pdf_path)
    full = "\n".join(d[p].get_text("text") for p in range(d.page_count))
    d.close()
    full = strip_bad(full.replace("\r", ""))
    blocks = re.split(r"(?=FICHE\s+\d+\s*·)", full)
    fiches = []
    for b in blocks:
        m = re.match(r"FICHE\s+(\d+)\s*·\s*(V-\s*N\s*\d+\s*-\s*\d+)", b)
        if not m: continue
        fiches.append((int(m.group(1)), re.sub(r"\s+", "", m.group(2)), b))
    return fiches

def split_sections(lines):
    idx = []
    for i, ln in enumerate(lines):
        t = re.sub(r"^\s*\d+\s*·\s*", "", ln.strip())   # handle "N · Title" on one line
        for s in SECTIONS:
            if t == s or t.startswith(s):
                idx.append((i, t)); break
    out = {"_header": lines[: idx[0][0]] if idx else lines}
    for k, (i, title) in enumerate(idx):
        end = idx[k + 1][0] if k + 1 < len(idx) else len(lines)
        out.setdefault(title, []).extend(lines[i + 1: end])
    return out

CAT_MAP = [("VERBE","verbe"),("ADJECTIF","adjectif"),("NOM","nom"),("EXPRESSION","expression"),
    ("ADVERBE","adverbe"),("PRONOM","pronom"),("DÉMONSTRATIF","demonstratif"),
    ("INTERROGATIF","interrogatif"),("CONNECTEUR","connecteur"),("NOMBRE","nombre"),
    ("COMPTEUR","compteur"),("ONOMATOPÉE","onomatopee")]

def parse_header(hlines):
    hs = [x.strip() for x in hlines if x.strip()]
    if not hs: return {}
    parts = hs[0].split()
    graphie = parts[0]
    reading = parts[1] if len(parts) > 1 else (parts[0] if is_kana_only(parts[0]) else None)
    tags = hs[1:6]
    gt = "kana" if any(t == "KANA" for t in tags) else ("kanji" if any(t == "KANJI" for t in tags) else None)
    cat = verbgroup = freq = None
    for t in tags:
        tu = t.upper()
        for key, val in CAT_MAP:
            if tu.startswith(key): cat = val; break
        if "GROUPE" in tu:
            gm = re.search(r"GROUPE\s*(\d)", tu); verbgroup = gm.group(1) if gm else ("irr" if "IRR" in tu else None)
        if "IRR" in tu: verbgroup = "irr"
        if any(f in tu for f in ["FRÉQUENT","COURANT","RARE","SOUTENU","SPÉCIAL","TRÈS"]):
            freq = t.capitalize()
    return {"graphie": graphie, "reading": reading, "graphieType": gt,
            "category": cat, "verbGroup": verbgroup, "frequency": freq}

def parse_readings(lines):
    body = list(lines)
    while body and body[0].strip() in ("Lecture en kana","Traduction(s)","Précision",""):
        body.pop(0)
    readings = []; cur = None
    for ln in body:
        t = ln.strip()
        if not t: continue
        if is_kana_only(t) and (cur is None or cur.get("tr")):
            cur = {"kana": t, "tr": "", "prec": ""}; readings.append(cur); continue
        if cur is None:
            cur = {"kana": "", "tr": "", "prec": ""}; readings.append(cur)
        if not cur["tr"] and latin_ratio(t) > 0.3: cur["tr"] = t
        else: cur["prec"] = (cur["prec"] + " " + t).strip()
    for r in readings:
        r["tr"] = clean(r["tr"]); r["prec"] = clean(r["prec"])
    return [r for r in readings if r["kana"] or r["tr"] or r["prec"]]

def parse_examples(lines):
    body = list(lines)
    while body and body[0].strip() in ("Lecture ciblée","Exemple japonais","Traduction et repère",""):
        body.pop(0)
    exs = []; cur = None; phase = None
    for ln in body:
        t = ln.strip()
        if not t: continue
        if is_kana_only(t) and (cur is None or cur.get("fr")):
            cur = {"lecture": t, "jp": "", "fr": ""}; exs.append(cur); phase = "jp"; continue
        if cur is None:
            cur = {"lecture": "", "jp": "", "fr": ""}; exs.append(cur); phase = "jp"
        if phase == "jp" and latin_ratio(t) > 0.4 and not is_kana_only(t): phase = "fr"
        if phase == "jp": cur["jp"] += t
        else: cur["fr"] = (cur["fr"] + " " + t).strip()
    for e in exs:
        e["jp"] = clean(e["jp"]); e["fr"] = clean(e["fr"])
    merged = []
    for e in exs:
        if not e["jp"] and merged: merged[-1]["fr"] = (merged[-1]["fr"] + " " + e["fr"]).strip()
        elif e["jp"]: merged.append(e)
    return merged

def parse_kanji(lines):
    text = "\n".join(lines)
    parts = re.split(r"(?=^.{1,2}\s*·\s*\d+\s*traits)", text, flags=re.M)
    blocks = []
    for p in parts:
        hm = re.match(r"(.{1,2})\s*·\s*\d+\s*traits", p)
        if not hm: continue
        char = hm.group(1).strip()
        def grab(label, nexts):
            pat = label + r"(.*?)(?=" + "|".join(nexts + [r"\Z"]) + ")"
            mm = re.search(pat, p, re.S); return clean(mm.group(1)) if mm else ""
        metam = re.match(r".{1,2}\s*·\s*(\d+\s*traits.*?)(?=Ordre de tracé|Origine|\Z)", p, re.S)
        blocks.append({
            "char": char,
            "meta": clean(metam.group(1)) if metam else "",
            "trace": grab("Ordre de tracé", ["Origine","Décomposition et clé","Moyen\\s*mnémotechnique"]),
            "origine": grab("Origine", ["Décomposition et clé","Moyen\\s*mnémotechnique"]),
            "decomp": grab("Décomposition et clé", ["Moyen\\s*mnémotechnique"]),
            "mnemo": grab("Moyen\\s*mnémotechnique", []),
        })
    return blocks

def parse_fiche(num, code, block):
    lines = [l for l in block.split("\n")[1:] if not re.fullmatch(r"\s*\d+\s*·\s*", l)]
    secs = split_sections(lines)
    out = {"num": num, "code": code, **parse_header(secs.get("_header", []))}
    out["readings"] = parse_readings(secs.get("Lectures et traductions", []))
    out["usage"] = clean(" ".join(secs.get("Contexte et usage", [])))
    out["examples"] = parse_examples(secs.get("Exemples par lecture", []))
    out["confuse"] = clean(" ".join(l for l in secs.get("À ne pas confondre", []) if l.strip() != "Mots proches et pièges"))
    cat_block = None; kanji_lines = None
    for key in secs:
        if key.startswith("Bloc spécifique"):
            if "kanji" in key: kanji_lines = secs[key]
            else: cat_block = clean(" ".join(secs[key]))
    out["categoryBlock"] = cat_block
    out["kanji"] = parse_kanji(kanji_lines) if kanji_lines else []
    return out

def parse_pdf(path):
    return [parse_fiche(n, c, b) for n, c, b in extract_fiches(path)]

if __name__ == "__main__":
    parsed = parse_pdf(sys.argv[1])
    print("FICHES:", len(parsed))
    for p in parsed[:3]:
        print("=" * 60); print(json.dumps(p, ensure_ascii=False, indent=1))
