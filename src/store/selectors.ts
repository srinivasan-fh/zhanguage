import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

const profilesSlice = (s: RootState) => s.profiles;
const pointsSlice   = (s: RootState) => s.points;
const walletSlice   = (s: RootState) => s.wallet;

export const selectProfiles = createSelector(
  [profilesSlice],
  (p) => p.ids.map((id) => p.byId[id]),
);

export const selectActiveProfileId = (s: RootState) => s.profiles.activeId;

export const selectActiveProfile = (s: RootState) =>
  s.profiles.activeId ? s.profiles.byId[s.profiles.activeId] : null;

export const selectCanAddProfile = (s: RootState) => s.profiles.ids.length < 3;

export const selectTotalPointsFor = (studentId: string | null) => (s: RootState) =>
  studentId ? s.points.byStudent[studentId]?.total ?? 0 : 0;

export const selectLessonResult =
  (studentId: string | null, lessonId: string) =>
  (s: RootState) =>
    studentId ? s.points.byStudent[studentId]?.lessonResults[lessonId] : undefined;

export const makeSelectStudentLessonResults = (studentId: string | null) =>
  createSelector(
    [pointsSlice],
    (p) => (studentId ? Object.values(p.byStudent[studentId]?.lessonResults ?? {}) : []),
  );

export const selectStudentLessonResults = (studentId: string | null) => (s: RootState) =>
  studentId ? Object.values(s.points.byStudent[studentId]?.lessonResults ?? {}) : [];

export const selectWallet = (studentId: string | null) => (s: RootState) =>
  studentId ? s.wallet.byStudent[studentId] : undefined;

export const selectStreak = (studentId: string | null) => (s: RootState) =>
  studentId ? s.points.byStudent[studentId]?.streak : undefined;

export const selectLettersSeenCount =
  (studentId: string | null, language: string, lessonId: string) =>
  (s: RootState) => {
    if (!studentId) return 0;
    const m = s.points.byStudent[studentId]?.lettersSeen?.[`${language}:${lessonId}`];
    return m ? Object.keys(m).length : 0;
  };
