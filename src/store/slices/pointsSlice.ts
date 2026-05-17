import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LessonResult, MedalTier } from '@/types/profile';
import { LanguageCode } from '@/types/content';

export interface StudentPoints {
  total: number;
  lessonResults: Record<string, LessonResult & { language: LanguageCode; phase: number }>;
}

interface PointsState {
  byStudent: Record<string, StudentPoints>;
}

const initialState: PointsState = {
  byStudent: {},
};

export function medalFor(scorePct: number): { tier: MedalTier; points: number } {
  if (scorePct >= 100) return { tier: 'emerald', points: 100 };
  if (scorePct >= 95)  return { tier: 'diamond', points: 60 };
  if (scorePct >= 85)  return { tier: 'gold',    points: 35 };
  if (scorePct >= 70)  return { tier: 'silver',  points: 20 };
  return { tier: 'bronze', points: 10 };
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
        const bucket = state.byStudent[studentId] ?? { total: 0, lessonResults: {} };
        const prev = bucket.lessonResults[result.lessonId];
        bucket.lessonResults[result.lessonId] = { ...result, language, phase };
        const prevPoints = prev?.points ?? 0;
        bucket.total = bucket.total - prevPoints + result.points;
        state.byStudent[studentId] = bucket;
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

export const { hydrate: hydratePoints, recordLessonResult, clearStudentPoints } =
  pointsSlice.actions;
export default pointsSlice.reducer;
