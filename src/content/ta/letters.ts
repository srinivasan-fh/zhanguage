// Flatten all Tamil letters from phase1.json into one ordered list,
// grouped by category for the overview grid.
import phase1 from './phase1.json';
import type { PhasePack } from '@/types/content';

export interface TamilLetter {
  glyph: string;
  name: string;
  exampleWord?: string;
  // Lesson id this letter belongs to (for category grouping).
  lessonId: string;
  lessonTitle: string;
}

const pack = phase1 as unknown as PhasePack;

export const TAMIL_LETTERS: TamilLetter[] = pack.lessons.flatMap((lesson) =>
  (lesson.items ?? []).map((it) => ({
    glyph: it.glyph,
    name: it.name,
    exampleWord: it.exampleWord,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
  })),
);

export interface TamilSection {
  lessonId: string;
  title: string;
  letters: TamilLetter[];
}

export const TAMIL_SECTIONS: TamilSection[] = pack.lessons.map((lesson) => ({
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
