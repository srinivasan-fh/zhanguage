import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LessonResult, MedalTier } from '@/types/profile';
import { LanguageCode } from '@/types/content';

export interface StudentPoints {
  total: number;
  lessonResults: Record<string, LessonResult & { language: LanguageCode; phase: number }>;
  // Per-lesson set of visited glyphs (stored as plain object — Redux state must
  // stay serialisable; we use string keys with `true` markers).
  lettersSeen: Record<string, Record<string, true>>;
  streak: { count: number; lastDayISO: string | null };
}

interface PointsState {
  byStudent: Record<string, StudentPoints>;
}

const initialState: PointsState = { byStudent: {} };

export function medalFor(scorePct: number): { tier: MedalTier; points: number } {
  if (scorePct >= 100) return { tier: 'emerald', points: 100 };
  if (scorePct >= 95) return { tier: 'diamond', points: 60 };
  if (scorePct >= 85) return { tier: 'gold',    points: 35 };
  if (scorePct >= 70) return { tier: 'silver',  points: 20 };
  return { tier: 'bronze', points: 10 };
}

function bucket(state: PointsState, studentId: string): StudentPoints {
  let b = state.byStudent[studentId];
  if (!b) {
    b = { total: 0, lessonResults: {}, lettersSeen: {}, streak: { count: 0, lastDayISO: null } };
    state.byStudent[studentId] = b;
  } else {
    // Backfill fields added in a later version so persisted state stays compatible.
    if (!b.lettersSeen) b.lettersSeen = {};
    if (!b.streak) b.streak = { count: 0, lastDayISO: null };
  }
  return b;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function tickStreak(b: StudentPoints): boolean {
  const today = todayISO();
  if (b.streak.lastDayISO === today) return false; // already counted today
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yestISO = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
  b.streak.count = b.streak.lastDayISO === yestISO ? b.streak.count + 1 : 1;
  b.streak.lastDayISO = today;
  return true; // first activity today
}

interface MarkLetterSeenPayload {
  studentId: string;
  language: LanguageCode;
  phase: number;
  lessonId: string;
  glyph: string;
  lessonSize: number; // total letters in this lesson, to detect completion
}

interface RecordPayload {
  studentId: string;
  language: LanguageCode;
  phase: number;
  lessonId: string;
  scorePct: number;
}

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    hydrate(_state, action: PayloadAction<PointsState>) {
      return action.payload;
    },

    markLetterSeen(state, action: PayloadAction<MarkLetterSeenPayload>) {
      const { studentId, language, phase, lessonId, glyph, lessonSize } = action.payload;
      const b = bucket(state, studentId);
      const key = `${language}:${lessonId}`;
      const set = b.lettersSeen[key] ?? {};
      const isNew = !set[glyph];
      if (isNew) {
        set[glyph] = true;
        b.lettersSeen[key] = set;
        b.total += 2; // +2 pts per new letter explored
      }
      const newDay = tickStreak(b);
      if (newDay) b.total += 5; // daily practice bonus
      if (isNew && Object.keys(set).length >= lessonSize && !b.lessonResults[lessonId]) {
        // First time finishing the set without a quiz — bronze placeholder.
        const { tier, points } = medalFor(50);
        b.lessonResults[lessonId] = {
          lessonId,
          scorePct: 50,
          medal: tier,
          points,
          attempts: 1,
          lastAt: Date.now(),
          language,
          phase,
        };
        b.total += points;
      }
    },

    recordLessonResult: {
      reducer(
        state,
        action: PayloadAction<{
          studentId: string;
          language: LanguageCode;
          phase: number;
          result: LessonResult;
        }>,
      ) {
        const { studentId, language, phase, result } = action.payload;
        const b = bucket(state, studentId);
        const prev = b.lessonResults[result.lessonId];
        if (prev && prev.points >= result.points) {
          // Existing result is better; only bump attempts + lastAt.
          b.lessonResults[result.lessonId] = {
            ...prev,
            attempts: prev.attempts + 1,
            lastAt: Date.now(),
          };
          return;
        }
        b.lessonResults[result.lessonId] = { ...result, language, phase };
        const prevPoints = prev?.points ?? 0;
        b.total = b.total - prevPoints + result.points;
        tickStreak(b);
      },
      prepare(input: RecordPayload) {
        const { tier, points } = medalFor(input.scorePct);
        const result: LessonResult = {
          lessonId: input.lessonId,
          scorePct: input.scorePct,
          medal: tier,
          points,
          attempts: 1,
          lastAt: Date.now(),
        };
        return {
          payload: {
            studentId: input.studentId,
            language: input.language,
            phase: input.phase,
            result,
          },
        };
      },
    },

    clearStudentPoints(state, action: PayloadAction<string>) {
      delete state.byStudent[action.payload];
    },
  },
});

export const {
  hydrate: hydratePoints,
  markLetterSeen,
  recordLessonResult,
  clearStudentPoints,
} = pointsSlice.actions;
export default pointsSlice.reducer;
