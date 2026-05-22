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
  };
  Rewards: undefined;
  ParentGate: undefined;
  ParentDashboard: undefined;
  Alphabet: { language: LanguageCode; phase?: number };
  Letter: { language: LanguageCode; phase?: number; index: number };
  Quiz: { language: LanguageCode; phase?: number; lessonId: string };
  Trace: { language: LanguageCode; phase?: number; index: number };
  Certification: { language: LanguageCode };
};
