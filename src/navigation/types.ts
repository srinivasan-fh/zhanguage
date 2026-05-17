import { LanguageCode } from '@/types/content';

export type RootStackParamList = {
  ProfileSelect: undefined;
  CreateProfile: undefined;
  Home: undefined;
  PhaseList: { language: LanguageCode };
  LessonList: { language: LanguageCode; phase: number };
  Lesson: { language: LanguageCode; phase: number; lessonId: string };
  LessonComplete: {
    language: LanguageCode;
    lessonId: string;
    scorePct: number;
    pointsEarned: number;
    moneyEarnedCents: number;
  };
  Rewards: undefined;
  ParentGate: undefined;
  ParentDashboard: undefined;
};
