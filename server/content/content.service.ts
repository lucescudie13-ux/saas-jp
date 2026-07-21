import type { Database, JlptLevel } from "@/types/database.types";
import { contentRepository } from "./content.repository";
import type { LessonComposition, VocabByLesson } from "./content.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

/**
 * Logique métier du contenu.
 * Compose une leçon avec tous ses éléments rattachés (lesson_items).
 */
export const contentService = {
  listVocab: (db: DB, level?: JlptLevel) => contentRepository.listVocab(db, level),
  getVocab: (db: DB, id: string) => contentRepository.getVocab(db, id),
  listVocabByCode: (db: DB, code: string) => contentRepository.listVocabByCode(db, code),
  getLessonCourse: (db: DB, code: string) => contentRepository.getLessonCourse(db, code),
  getLessonExercises: (db: DB, code: string) => contentRepository.getLessonExercises(db, code),
  getComprehensionByCode: (db: DB, code: string) => contentRepository.getComprehensionByCode(db, code),

  /**
   * Vocabulaire d'un niveau regroupé par leçon (dans l'ordre des leçons),
   * plus les mots non rattachés à une leçon. Sert au tri « par leçon ».
   */
  async listVocabByLesson(db: DB, level?: JlptLevel): Promise<VocabByLesson> {
    const [lessons, allVocab] = await Promise.all([
      contentRepository.listLessons(db, level),
      contentRepository.listVocab(db, level),
    ]);
    const vocabById = new Map(allVocab.map((v) => [v.id, v]));
    const used = new Set<string>();
    const groups: VocabByLesson["groups"] = [];

    const itemsPerLesson = await Promise.all(
      lessons.map((lesson) => contentRepository.getLessonItems(db, lesson.id))
    );
    lessons.forEach((lesson, i) => {
      const items = itemsPerLesson[i] ?? [];
      const vocab = items
        .filter((it) => it.kind === "vocab")
        .map((it) => vocabById.get(it.item_id))
        .filter((v): v is NonNullable<typeof v> => v !== undefined);
      if (vocab.length === 0) return;
      vocab.forEach((v) => used.add(v.id));
      groups.push({ lesson, vocab });
    });

    const ungrouped = allVocab.filter((v) => !used.has(v.id));
    return { groups, ungrouped };
  },
  listPhrases: (db: DB, level?: JlptLevel) => contentRepository.listPhrases(db, level),
  listGrammar: (db: DB, level?: JlptLevel) => contentRepository.listGrammar(db, level),
  getGrammar: (db: DB, id: string) => contentRepository.getGrammarWithQuestions(db, id),
  listDialogues: (db: DB, level?: JlptLevel) => contentRepository.listDialogues(db, level),
  getDialogue: (db: DB, id: string) => contentRepository.getDialogueFull(db, id),
  listReadings: (db: DB, level?: JlptLevel) => contentRepository.listReadings(db, level),
  getReading: (db: DB, id: string) => contentRepository.getReadingFull(db, id),
  listLessons: (db: DB, level?: JlptLevel) => contentRepository.listLessons(db, level),

  async getLessonComposition(
    db: DB,
    level: JlptLevel,
    number: number
  ): Promise<LessonComposition | null> {
    const lesson = await contentRepository.getLesson(db, level, number);
    if (!lesson) return null;

    const items = await contentRepository.getLessonItems(db, lesson.id);
    const idsByKind = {
      vocab: items.filter((i) => i.kind === "vocab").map((i) => i.item_id),
      phrase: items.filter((i) => i.kind === "phrase").map((i) => i.item_id),
      grammar: items.filter((i) => i.kind === "grammar").map((i) => i.item_id),
      dialogue: items.filter((i) => i.kind === "dialogue").map((i) => i.item_id),
      reading: items.filter((i) => i.kind === "reading").map((i) => i.item_id),
    };

    const [allVocab, allPhrases] = await Promise.all([
      contentRepository.listVocab(db),
      contentRepository.listPhrases(db),
    ]);

    const vocab = allVocab.filter((v) => idsByKind.vocab.includes(v.id));
    const phrases = allPhrases.filter((p) => idsByKind.phrase.includes(p.id));
    const grammar = (await Promise.all(idsByKind.grammar.map((id) => contentRepository.getGrammarWithQuestions(db, id))))
      .filter((g): g is NonNullable<typeof g> => g !== null);
    const dialogues = (await Promise.all(idsByKind.dialogue.map((id) => contentRepository.getDialogueFull(db, id))))
      .filter((d): d is NonNullable<typeof d> => d !== null);
    const readings = (await Promise.all(idsByKind.reading.map((id) => contentRepository.getReadingFull(db, id))))
      .filter((r): r is NonNullable<typeof r> => r !== null);

    return { lesson, vocab, phrases, grammar, dialogues, readings };
  },
};
