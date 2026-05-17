import { LanguageCode, PhasePack } from '@/types/content';

import enP1 from './en/phase1.json';
import taP1 from './ta/phase1.json';
import hiP1 from './hi/phase1.json';
import jaP1 from './ja/phase1.json';
import deP1 from './de/phase1.json';
import zhP1 from './zh/phase1.json';
import koP1 from './ko/phase1.json';

type ContentMap = {
  [lang in LanguageCode]?: {
    [phase: number]: PhasePack;
  };
};

const CONTENT: ContentMap = {
  en: { 1: enP1 as PhasePack },
  ta: { 1: taP1 as PhasePack },
  hi: { 1: hiP1 as PhasePack },
  ja: { 1: jaP1 as PhasePack },
  de: { 1: deP1 as PhasePack },
  zh: { 1: zhP1 as PhasePack },
  ko: { 1: koP1 as PhasePack },
};

export function getPhasePack(lang: LanguageCode, phase: number): PhasePack | null {
  return CONTENT[lang]?.[phase] ?? null;
}

export function hasPhase(lang: LanguageCode, phase: number): boolean {
  return Boolean(CONTENT[lang]?.[phase]);
}
