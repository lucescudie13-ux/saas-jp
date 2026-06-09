export interface WeeklyPoint { day: string; minutes: number; }

export interface DashboardStats {
  wordsLearned: number;
  phrasesLearned: number;
  lessonsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  quizAccuracy: number;      // 0..100
  totalMinutes: number;
  dueToday: number;
  weekly: WeeklyPoint[];
}
