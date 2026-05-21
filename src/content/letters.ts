// Generic letter list builder. For a given language code, flattens the phase 1
// content pack into a single ordered list and a grouped-by-lesson sections list,
// so the alphabet overview + single-letter screens can be reused across all
// languages instead of being Tamil-specific.

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

const cache = new Map<LanguageCode, { all: Letter[]; sections: LetterSection[] }>();

function build(lang: LanguageCode): { all: Letter[]; sections: LetterSection[] } {
  const pack = getPhasePack(lang, 1) as PhasePack | null;
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

export function getLetters(lang: LanguageCode): Letter[] {
  let entry = cache.get(lang);
  if (!entry) {
    entry = build(lang);
    cache.set(lang, entry);
  }
  return entry.all;
}

export function getSections(lang: LanguageCode): LetterSection[] {
  let entry = cache.get(lang);
  if (!entry) {
    entry = build(lang);
    cache.set(lang, entry);
  }
  return entry.sections;
}
