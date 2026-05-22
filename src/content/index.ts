import { LanguageCode, PhasePack } from '@/types/content';

import enP1 from './en/phase1.json';
import taP1 from './ta/phase1.json';
import hiP1 from './hi/phase1.json';
import jaP1 from './ja/phase1.json';
import deP1 from './de/phase1.json';
import zhP1 from './zh/phase1.json';
import koP1 from './ko/phase1.json';
import esP1 from './es/phase1.json';
import frP1 from './fr/phase1.json';
import arP1 from './ar/phase1.json';
import ptP1 from './pt/phase1.json';
import ruP1 from './ru/phase1.json';
import saP1 from './sa/phase1.json';
import heP1 from './he/phase1.json';
import arcP1 from './arc/phase1.json';
import piP1 from './pi/phase1.json';
import laP1 from './la/phase1.json';
import grcP1 from './grc/phase1.json';
import egyP1 from './egy/phase1.json';
import suxP1 from './sux/phase1.json';
import akkP1 from './akk/phase1.json';

import enP2 from './en/phase2.json';
import taP2 from './ta/phase2.json';
import hiP2 from './hi/phase2.json';
import jaP2 from './ja/phase2.json';
import deP2 from './de/phase2.json';
import zhP2 from './zh/phase2.json';
import koP2 from './ko/phase2.json';

import enP3 from './en/phase3.json';
import taP3 from './ta/phase3.json';
import hiP3 from './hi/phase3.json';
import jaP3 from './ja/phase3.json';
import deP3 from './de/phase3.json';
import zhP3 from './zh/phase3.json';
import koP3 from './ko/phase3.json';

import enP4 from './en/phase4.json';
import taP4 from './ta/phase4.json';
import hiP4 from './hi/phase4.json';
import jaP4 from './ja/phase4.json';
import deP4 from './de/phase4.json';
import zhP4 from './zh/phase4.json';
import koP4 from './ko/phase4.json';

import enP5 from './en/phase5.json';
import taP5 from './ta/phase5.json';
import hiP5 from './hi/phase5.json';
import jaP5 from './ja/phase5.json';
import deP5 from './de/phase5.json';
import zhP5 from './zh/phase5.json';
import koP5 from './ko/phase5.json';

import enP6 from './en/phase6.json';
import taP6 from './ta/phase6.json';
import hiP6 from './hi/phase6.json';
import jaP6 from './ja/phase6.json';
import deP6 from './de/phase6.json';
import zhP6 from './zh/phase6.json';
import koP6 from './ko/phase6.json';

import enP7 from './en/phase7.json';
import taP7 from './ta/phase7.json';
import hiP7 from './hi/phase7.json';
import jaP7 from './ja/phase7.json';
import deP7 from './de/phase7.json';
import zhP7 from './zh/phase7.json';
import koP7 from './ko/phase7.json';

import enP8 from './en/phase8.json';
import taP8 from './ta/phase8.json';
import hiP8 from './hi/phase8.json';
import jaP8 from './ja/phase8.json';
import deP8 from './de/phase8.json';
import zhP8 from './zh/phase8.json';
import koP8 from './ko/phase8.json';

import enP9 from './en/phase9.json';
import taP9 from './ta/phase9.json';
import hiP9 from './hi/phase9.json';
import jaP9 from './ja/phase9.json';
import deP9 from './de/phase9.json';
import zhP9 from './zh/phase9.json';
import koP9 from './ko/phase9.json';

import enP10 from './en/phase10.json';
import taP10 from './ta/phase10.json';
import hiP10 from './hi/phase10.json';
import jaP10 from './ja/phase10.json';
import deP10 from './de/phase10.json';
import zhP10 from './zh/phase10.json';
import koP10 from './ko/phase10.json';

type ContentMap = {
  [lang in LanguageCode]?: {
    [phase: number]: PhasePack;
  };
};

const CONTENT: ContentMap = {
  en:  { 1: enP1 as PhasePack, 2: enP2 as PhasePack, 3: enP3 as PhasePack, 4: enP4 as PhasePack, 5: enP5 as PhasePack, 6: enP6 as PhasePack, 7: enP7 as PhasePack, 8: enP8 as PhasePack, 9: enP9 as PhasePack, 10: enP10 as PhasePack },
  ta:  { 1: taP1 as PhasePack, 2: taP2 as PhasePack, 3: taP3 as PhasePack, 4: taP4 as PhasePack, 5: taP5 as PhasePack, 6: taP6 as PhasePack, 7: taP7 as PhasePack, 8: taP8 as PhasePack, 9: taP9 as PhasePack, 10: taP10 as PhasePack },
  hi:  { 1: hiP1 as PhasePack, 2: hiP2 as PhasePack, 3: hiP3 as PhasePack, 4: hiP4 as PhasePack, 5: hiP5 as PhasePack, 6: hiP6 as PhasePack, 7: hiP7 as PhasePack, 8: hiP8 as PhasePack, 9: hiP9 as PhasePack, 10: hiP10 as PhasePack },
  ja:  { 1: jaP1 as PhasePack, 2: jaP2 as PhasePack, 3: jaP3 as PhasePack, 4: jaP4 as PhasePack, 5: jaP5 as PhasePack, 6: jaP6 as PhasePack, 7: jaP7 as PhasePack, 8: jaP8 as PhasePack, 9: jaP9 as PhasePack, 10: jaP10 as PhasePack },
  de:  { 1: deP1 as PhasePack, 2: deP2 as PhasePack, 3: deP3 as PhasePack, 4: deP4 as PhasePack, 5: deP5 as PhasePack, 6: deP6 as PhasePack, 7: deP7 as PhasePack, 8: deP8 as PhasePack, 9: deP9 as PhasePack, 10: deP10 as PhasePack },
  zh:  { 1: zhP1 as PhasePack, 2: zhP2 as PhasePack, 3: zhP3 as PhasePack, 4: zhP4 as PhasePack, 5: zhP5 as PhasePack, 6: zhP6 as PhasePack, 7: zhP7 as PhasePack, 8: zhP8 as PhasePack, 9: zhP9 as PhasePack, 10: zhP10 as PhasePack },
  ko:  { 1: koP1 as PhasePack, 2: koP2 as PhasePack, 3: koP3 as PhasePack, 4: koP4 as PhasePack, 5: koP5 as PhasePack, 6: koP6 as PhasePack, 7: koP7 as PhasePack, 8: koP8 as PhasePack, 9: koP9 as PhasePack, 10: koP10 as PhasePack },
  es:  { 1: esP1  as PhasePack },
  fr:  { 1: frP1  as PhasePack },
  ar:  { 1: arP1  as PhasePack },
  pt:  { 1: ptP1  as PhasePack },
  ru:  { 1: ruP1  as PhasePack },
  sa:  { 1: saP1  as PhasePack },
  he:  { 1: heP1  as PhasePack },
  arc: { 1: arcP1 as PhasePack },
  pi:  { 1: piP1  as PhasePack },
  la:  { 1: laP1  as PhasePack },
  grc: { 1: grcP1 as PhasePack },
  egy: { 1: egyP1 as PhasePack },
  sux: { 1: suxP1 as PhasePack },
  akk: { 1: akkP1 as PhasePack },
};

export function getPhasePack(lang: LanguageCode, phase: number): PhasePack | null {
  return CONTENT[lang]?.[phase] ?? null;
}

export function hasPhase(lang: LanguageCode, phase: number): boolean {
  return Boolean(CONTENT[lang]?.[phase]);
}

