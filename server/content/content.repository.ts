import type { Database, JlptLevel } from "@/types/database.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

/** Accès Supabase au contenu pédagogique (lecture). */
export const contentRepository = {
  async listVocab(db: DB, level?: JlptLevel) {
    let q = db.from("vocab_items").select("*").order("position");
    if (level) q = q.eq("level", level);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async getVocab(db: DB, id: string) {
    const { data, error } = await db.from("vocab_items").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async listPhrases(db: DB, level?: JlptLevel) {
    let q = db.from("phrases").select("*").order("position");
    if (level) q = q.eq("level", level);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async listGrammar(db: DB, level?: JlptLevel) {
    let q = db.from("grammar_points").select("*").order("position");
    if (level) q = q.eq("level", level);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async getGrammarWithQuestions(db: DB, id: string) {
    const { data: point, error } = await db.from("grammar_points").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!point) return null;
    const { data: questions, error: qErr } = await db
      .from("grammar_questions").select("*").eq("grammar_id", id).order("position");
    if (qErr) throw qErr;
    return { ...point, questions: questions ?? [] };
  },

  async listDialogues(db: DB, level?: JlptLevel) {
    let q = db.from("dialogues").select("*").order("position");
    if (level) q = q.eq("level", level);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async getDialogueFull(db: DB, id: string) {
    const { data: dialogue, error } = await db.from("dialogues").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!dialogue) return null;
    const [{ data: lines }, { data: questions }] = await Promise.all([
      db.from("dialogue_lines").select("*").eq("dialogue_id", id).order("position"),
      db.from("dialogue_questions").select("*").eq("dialogue_id", id).order("position"),
    ]);
    return { ...dialogue, lines: lines ?? [], questions: questions ?? [] };
  },

  async listReadings(db: DB, level?: JlptLevel) {
    let q = db.from("readings").select("*").order("position");
    if (level) q = q.eq("level", level);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async getReadingFull(db: DB, id: string) {
    const { data: reading, error } = await db.from("readings").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!reading) return null;
    const { data: questions } = await db
      .from("reading_questions").select("*").eq("reading_id", id).order("position");
    return { ...reading, questions: questions ?? [] };
  },

  async listLessons(db: DB, level?: JlptLevel) {
    let q = db.from("lessons").select("*").order("position");
    if (level) q = q.eq("level", level);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async getLesson(db: DB, level: JlptLevel, number: number) {
    const { data, error } = await db
      .from("lessons").select("*").eq("level", level).eq("number", number).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getLessonById(db: DB, id: string) {
    const { data, error } = await db.from("lessons").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getLessonItems(db: DB, lessonId: string) {
    const { data, error } = await db
      .from("lesson_items").select("*").eq("lesson_id", lessonId).order("position");
    if (error) throw error;
    return data ?? [];
  },
};
