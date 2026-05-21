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

type ContentMap = {
  [lang in LanguageCode]?: {
    [phase: number]: PhasePack;
  };
};

const CONTENT: ContentMap = {
  en:  { 1: enP1  as PhasePack },
  ta:  { 1: taP1  as PhasePack },
  hi:  { 1: hiP1  as PhasePack },
  ja:  { 1: jaP1  as PhasePack },
  de:  { 1: deP1  as PhasePack },
  zh:  { 1: zhP1  as PhasePack },
  ko:  { 1: koP1  as PhasePack },
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
