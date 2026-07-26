import sys, json, re
from collections import Counter
from parse_fiches import parse_pdf   # this module sets stdout to utf-8

path, level, out = sys.argv[1], sys.argv[2], sys.argv[3]
fiches = parse_pdf(path)
recs = []
for f in fiches:
    m = re.search(r"-(\d+)$", f["code"])          # lesson number (ignore N-level in code)
    lesson = int(m.group(1)) if m else 0
    f["slug"] = f"V-{level}-{lesson:02d}-{f['num']:03d}"
    f["level"] = level
    recs.append(f)
json.dump(recs, open(out, "w", encoding="utf-8"), ensure_ascii=False)
print("level", level, "· fiches parsed:", len(recs))
codes = Counter(r["code"] for r in recs)
print("distinct lesson codes:", len(codes))
print("first slugs:", [r["slug"] for r in recs[:3]])
print("last slugs :", [r["slug"] for r in recs[-3:]])
# how many have real content
withex = sum(1 for r in recs if r["examples"])
withusage = sum(1 for r in recs if r["usage"])
withkanji = sum(1 for r in recs if r["kanji"])
print(f"with examples: {withex} · with usage: {withusage} · with kanji block: {withkanji}")
