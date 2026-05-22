// Phase-aware letter list builder. For a given (language, phase), flattens the
// content pack into one ordered list and grouped sections. Same helper is used
// across the alphabet overview, single-letter detail, and quiz flows for every
// phase that exists.

import type { LanguageCode, PhasePack } from '@/types/content';
import { getPhasePack } from '@/content';

export interface Letter {
  glyph: string;
  name: string;
  exampleWord?: string;
  lessonId: string;
  lessonTitle: string;
}

export interface LetterSection {
  lessonId: string;
  title: string;
  letters: Letter[];
}

const cache = new Map<string, { all: Letter[]; sections: LetterSection[] }>();

function keyOf(lang: LanguageCode, phase: number) {
  return `${lang}:${phase}`;
}

function build(lang: LanguageCode, phase: number) {
  const pack = getPhasePack(lang, phase) as PhasePack | null;
  if (!pack) return { all: [], sections: [] };
  const sections: LetterSection[] = pack.lessons.map((lesson) => ({
    lessonId: lesson.id,
    title: lesson.title,
    letters: (lesson.items ?? []).map((it) => ({
      glyph: it.glyph,
      name: it.name,
      exampleWord: it.exampleWord,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    })),
  }));
  const all = sections.flatMap((s) => s.letters);
  return { all, sections };
}

export function getLetters(lang: LanguageCode, phase = 1): Letter[] {
  const k = keyOf(lang, phase);
  let entry = cache.get(k);
  if (!entry) {
    entry = build(lang, phase);
    cache.set(k, entry);
  }
  return entry.all;
}

export function getSections(lang: LanguageCode, phase = 1): LetterSection[] {
  const k = keyOf(lang, phase);
  let entry = cache.get(k);
  if (!entry) {
    entry = build(lang, phase);
    cache.set(k, entry);
  }
  return entry.sections;
}
