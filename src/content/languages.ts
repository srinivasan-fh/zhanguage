import { LanguageMeta } from '@/types/content';

export const LANGUAGES: LanguageMeta[] = [
  { code: 'ta', name: 'Tamil',    nativeName: 'தமிழ்',     flag: '🇮🇳' },
  { code: 'en', name: 'English',  nativeName: 'English',  flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi',    nativeName: 'हिन्दी',    flag: '🇮🇳' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文',      flag: '🇨🇳' },
  { code: 'ko', name: 'Korean',   nativeName: '한국어',     flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語',    flag: '🇯🇵' },
  { code: 'de', name: 'German',   nativeName: 'Deutsch',  flag: '🇩🇪' },
];

export const PHASES: { id: number; title: string; emoji: string }[] = [
  { id: 1,  title: 'Letters & Sounds',        emoji: '🔤' },
  { id: 2,  title: 'Pronouns & Family',       emoji: '👨‍👩‍👧' },
  { id: 3,  title: '2 & 3 Letter Words',      emoji: '🐱' },
  { id: 4,  title: '4 & 5 Letter Words',      emoji: '🐘' },
  { id: 5,  title: 'Grammar',                 emoji: '📐' },
  { id: 6,  title: 'Writing',                 emoji: '✏️' },
  { id: 7,  title: 'Reading',                 emoji: '📖' },
  { id: 8,  title: 'Speaking',                emoji: '🎤' },
  { id: 9,  title: 'Listening',               emoji: '👂' },
  { id: 10, title: 'Certification Test',      emoji: '🏆' },
];
