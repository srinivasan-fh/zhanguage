import { LanguageMeta } from '@/types/content';

export const LANGUAGES: LanguageMeta[] = [
  // Primary
  { code: 'ta', name: 'Tamil',     nativeName: 'தமிழ்',     flag: '🇮🇳', tier: 'primary' },
  { code: 'en', name: 'English',   nativeName: 'English',   flag: '🇬🇧', tier: 'primary' },
  { code: 'hi', name: 'Hindi',     nativeName: 'हिन्दी',    flag: '🇮🇳', tier: 'primary' },
  { code: 'zh', name: 'Mandarin',  nativeName: '中文',      flag: '🇨🇳', tier: 'primary' },
  { code: 'ja', name: 'Japanese',  nativeName: '日本語',     flag: '🇯🇵', tier: 'primary' },
  { code: 'de', name: 'German',    nativeName: 'Deutsch',   flag: '🇩🇪', tier: 'primary' },
  // Secondary
  { code: 'es', name: 'Spanish',    nativeName: 'Español',   flag: '🇪🇸', tier: 'secondary' },
  { code: 'fr', name: 'French',     nativeName: 'Français',  flag: '🇫🇷', tier: 'secondary' },
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية',   flag: '🇸🇦', tier: 'secondary' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', tier: 'secondary' },
  { code: 'ru', name: 'Russian',    nativeName: 'Русский',   flag: '🇷🇺', tier: 'secondary' },
  { code: 'ko', name: 'Korean',     nativeName: '한국어',     flag: '🇰🇷', tier: 'secondary' },
  // Tertiary — divine / sacred connection
  { code: 'sa',  name: 'Sanskrit',         nativeName: 'संस्कृतम्',    flag: '🕉️',  tier: 'tertiary' },
  { code: 'he',  name: 'Hebrew',           nativeName: 'עברית',        flag: '✡️',  tier: 'tertiary' },
  { code: 'arc', name: 'Aramaic',          nativeName: 'ܐܪܡܝܐ',        flag: '📜',  tier: 'tertiary' },
  { code: 'pi',  name: 'Pali',             nativeName: 'पालि',         flag: '☸️',  tier: 'tertiary' },
  { code: 'la',  name: 'Latin',            nativeName: 'Latina',       flag: '🏛️',  tier: 'tertiary' },
  { code: 'grc', name: 'Ancient Greek',    nativeName: 'Ἑλληνικά',     flag: '🏺',  tier: 'tertiary' },
  { code: 'egy', name: 'Ancient Egyptian', nativeName: '𓂀',           flag: '𓋹',   tier: 'tertiary' },
  { code: 'sux', name: 'Sumerian',         nativeName: '𒅴𒂠',          flag: '𒀭',   tier: 'tertiary' },
  { code: 'akk', name: 'Akkadian',         nativeName: '𒀝𒅗𒁺𒌑',       flag: '𒂗',   tier: 'tertiary' },
];

export const PRIMARY_LANGUAGES   = LANGUAGES.filter((l) => l.tier === undefined || l.tier === 'primary');
export const SECONDARY_LANGUAGES = LANGUAGES.filter((l) => l.tier === 'secondary');
export const TERTIARY_LANGUAGES  = LANGUAGES.filter((l) => l.tier === 'tertiary');

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
