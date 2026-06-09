import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { QuestionCard } from "@/components/features/QuestionCard";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

export default async function LessonPage({ params }: { params: Promise<{ level: string; number: string }> }) {
  const { level, number } = await params;
  if (!JLPT_LEVELS.includes(level as JlptLevel)) notFound();
  const n = Number(number);
  if (!Number.isInteger(n)) notFound();

  const db = await createClient();
  const c = await contentService.getLessonComposition(db, level as JlptLevel, n);
  if (!c) notFound();

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Leçon {c.lesson.level}-{c.lesson.number}</span>
        <h1>{c.lesson.title}</h1>
        {c.lesson.summary && <p>{c.lesson.summary}</p>}
      </div>

      {c.vocab.length > 0 && (
        <Section title="Vocabulaire">
          <ul className="vlist">
            {c.vocab.map((v) => (
              <li key={v.id} className="vrow" style={{ cursor: "default" }}>
                <span className="vglyph">{v.lemma}</span>
                <span className="vmid">{v.reading && <span className="vreading">{v.reading}</span>}<span className="vgloss">{v.gloss}</span></span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {c.phrases.length > 0 && (
        <Section title="Phrases">
          <ul className="vlist">
            {c.phrases.map((p) => (
              <li key={p.id} className="vrow" style={{ cursor: "default" }}>
                <span className="vglyph" style={{ fontSize: 18, minWidth: 80 }}>{p.lemma}</span>
                <span className="vmid"><span className="vgloss">{p.gloss}</span></span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {c.grammar.map((g) => (
        <Section key={g.id} title={`Grammaire — ${g.lemma}`}>
          <p style={{ fontWeight: 600 }}>{g.gloss}</p>
          {g.detail && <p style={{ color: "var(--ink-soft)", marginBottom: 12 }}>{g.detail}</p>}
          {g.questions.map((q) => <QuestionCard key={q.id} prompt={q.prompt} answer={q.answer} />)}
        </Section>
      ))}

      {c.dialogues.map((d) => (
        <Section key={d.id} title={`Dialogue — ${d.title ?? d.lemma}`}>
          {d.lines.map((l) => (
            <div key={l.id} className="dlg-line">
              <span className="dlg-who">{l.speaker}</span>
              <span><span className="dlg-jp">{l.jp}</span><br /><span className="dlg-fr">{l.fr}</span></span>
            </div>
          ))}
          {d.questions.map((q) => <QuestionCard key={q.id} prompt={q.prompt} answer={q.answer} />)}
        </Section>
      ))}

      {c.readings.map((r) => (
        <Section key={r.id} title={`Lecture — ${r.title}`}>
          <div className="read-body">{r.body}</div>
          {r.translation && <p className="read-trans">{r.translation}</p>}
          {r.questions.map((q) => <QuestionCard key={q.id} prompt={q.prompt} answer={q.answer} />)}
        </Section>
      ))}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: "var(--vermilion-deep)" }}>{title}</h2>
      {children}
    </section>
  );
}
