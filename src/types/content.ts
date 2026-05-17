export type LanguageCode = 'en' | 'ta' | 'hi' | 'ja' | 'de' | 'zh' | 'ko';

export type LessonType =
  | 'letters'
  | 'vocab'
  | 'pronouns'
  | 'grammar'
  | 'trace'
  | 'read'
  | 'speak'
  | 'listen'
  | 'quiz';

export interface LetterItem {
  glyph: string;
  name: string;
  audio?: string;
  exampleWord?: string;
  exampleImage?: string;
}

export interface QuizQuestion {
  kind: 'tap-the-sound' | 'tap-the-image' | 'fill-blank' | 'order-words';
  prompt: string;
  audio?: string;
  options: string[];
  answer: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  items?: LetterItem[];
  quiz?: QuizQuestion[];
  maxPoints: number;
}

export interface PhasePack {
  language: LanguageCode;
  phase: number;
  title: string;
  lessons: Lesson[];
}

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}
