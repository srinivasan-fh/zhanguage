import type { RootState } from './index';
import type { LanguageCode } from '@/types/content';

export const selectProfiles = (s: RootState) =>
  s.profiles.ids.map((id) => s.profiles.byId[id]);

export const selectActiveProfileId = (s: RootState) => s.profiles.activeId;

export const selectActiveProfile = (s: RootState) =>
  s.profiles.activeId ? s.profiles.byId[s.profiles.activeId] : null;

export const selectCanAddProfile = (s: RootState) => s.profiles.ids.length < 3;

export const selectTotalPointsFor = (studentId: string | null) => (s: RootState) =>
  studentId ? s.points.byStudent[studentId]?.total ?? 0 : 0;

export const selectLessonResult =
  (studentId: string | null, _lang: LanguageCode, lessonId: string) =>
  (s: RootState) =>
    studentId
      ? s.points.byStudent[studentId]?.lessonResults[lessonId]
      : undefined;

export const selectStudentLessonResults = (studentId: string | null) => (s: RootState) =>
  studentId ? Object.values(s.points.byStudent[studentId]?.lessonResults ?? {}) : [];

export const selectWallet = (studentId: string | null) => (s: RootState) =>
  studentId ? s.wallet.byStudent[studentId] : undefined;
