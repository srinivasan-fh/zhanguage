import { create } from 'zustand';
import { storage } from '@/storage/asyncStorage';
import { LessonResult, MedalTier } from '@/types/profile';
import { LanguageCode } from '@/types/content';

const KEY = 'progress:v1';

type ProgressMap = {
  [profileId: string]: {
    [lang in LanguageCode]?: {
      [lessonId: string]: LessonResult;
    };
  };
};

interface ProgressState {
  byProfile: ProgressMap;
  hydrate: () => Promise<void>;
  recordResult: (
    profileId: string,
    lang: LanguageCode,
    result: LessonResult,
  ) => Promise<void>;
  getResult: (
    profileId: string,
    lang: LanguageCode,
    lessonId: string,
  ) => LessonResult | undefined;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  byProfile: {},

  hydrate: async () => {
    const data = (await storage.get<ProgressMap>(KEY)) ?? {};
    set({ byProfile: data });
  },

  recordResult: async (profileId, lang, result) => {
    const byProfile = { ...get().byProfile };
    const forProfile = { ...(byProfile[profileId] ?? {}) };
    const forLang = { ...(forProfile[lang] ?? {}) };
    forLang[result.lessonId] = result;
    forProfile[lang] = forLang;
    byProfile[profileId] = forProfile;
    await storage.set(KEY, byProfile);
    set({ byProfile });
  },

  getResult: (profileId, lang, lessonId) =>
    get().byProfile[profileId]?.[lang]?.[lessonId],
}));

export function medalFor(scorePct: number): { tier: MedalTier; points: number } {
  if (scorePct >= 100) return { tier: 'emerald', points: 100 };
  if (scorePct >= 95) return { tier: 'diamond', points: 60 };
  if (scorePct >= 85) return { tier: 'gold', points: 35 };
  if (scorePct >= 70) return { tier: 'silver', points: 20 };
  return { tier: 'bronze', points: 10 };
}
