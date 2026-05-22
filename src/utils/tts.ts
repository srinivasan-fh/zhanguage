import Tts, { Voice } from 'react-native-tts';
import type { LanguageCode } from '@/types/content';
import type { Letter } from '@/content/letters';

// Map our language codes to the BCP-47 codes TTS prefers. For ancient or
// liturgical languages we fall back to the closest living relative so the
// reader still produces a natural-sounding voice.
export const TTS_LOCALE: Record<LanguageCode, string> = {
  en: 'en-US', ta: 'ta-IN', hi: 'hi-IN', ja: 'ja-JP', de: 'de-DE',
  zh: 'zh-CN', ko: 'ko-KR', es: 'es-ES', fr: 'fr-FR', ar: 'ar-SA',
  pt: 'pt-PT', ru: 'ru-RU',
  sa: 'hi-IN', he: 'he-IL', arc: 'he-IL', pi: 'hi-IN',
  la: 'it-IT', grc: 'el-GR', egy: 'ar-EG', sux: 'ar-IQ', akk: 'ar-IQ',
};

// Per-language rate. Smaller = slower. Kids learn better with slower speech.
const RATE_DEFAULT = 0.42;
const RATE: Partial<Record<LanguageCode, number>> = {
  ja: 0.38, zh: 0.38, ko: 0.4, ta: 0.4, hi: 0.4, sa: 0.38, pi: 0.38,
  ar: 0.4, he: 0.42, arc: 0.42, grc: 0.4, la: 0.45,
};

// Voice selection: prefer local, highest-quality, non-novelty voices.
let allVoices: Voice[] | null = null;
const chosenVoiceByLang = new Map<LanguageCode, string | null>();

async function loadVoicesOnce() {
  if (allVoices) return;
  try {
    allVoices = await Tts.voices();
  } catch {
    allVoices = [];
  }
}

function score(v: Voice): number {
  let s = 0;
  if (!v.networkConnectionRequired) s += 100;
  if (!v.notInstalled) s += 60;
  // Android exposes quality (300/400/500). Higher is better.
  s += (v.quality ?? 300) / 10;
  // Lower latency = better.
  s -= (v.latency ?? 0) / 10;
  // Avoid clearly novelty voices.
  const n = (v.name ?? '').toLowerCase();
  if (n.includes('novelty') || n.includes('whisper') || n.includes('robot')) s -= 200;
  return s;
}

async function pickVoiceFor(lang: LanguageCode): Promise<string | null> {
  if (chosenVoiceByLang.has(lang)) return chosenVoiceByLang.get(lang)!;
  await loadVoicesOnce();
  const locale = TTS_LOCALE[lang];
  const prefix2 = locale.slice(0, 2).toLowerCase();
  const exact = (allVoices ?? []).filter((v) => (v.language ?? '').toLowerCase() === locale.toLowerCase());
  const partial = (allVoices ?? []).filter((v) => (v.language ?? '').toLowerCase().startsWith(prefix2));
  const candidates = exact.length ? exact : partial;
  const best = candidates.sort((a, b) => score(b) - score(a))[0];
  const chosen = best?.id ?? null;
  chosenVoiceByLang.set(lang, chosen);
  return chosen;
}

// Pick the most natural utterance for a given letter. Many glyphs are not
// pronounceable in isolation (Tamil bare consonants with pulli, isolated
// matras, Hangul jamo, hieroglyphs, cuneiform). For those we prefer the
// example word or the human-readable transliteration name.
const PULLI = '்';        // Tamil virama
const HALANT = '्';       // Devanagari virama
const HEBREW_FINAL = /^[֐-׿]+$/;
const HANGUL_JAMO_RANGE = /[ㄱ-ㆎ]/;
const CUNEIFORM_RANGE = /[\u{12000}-\u{1247F}]/u;
const HIEROGLYPH_RANGE = /[\u{13000}-\u{1342F}]/u;

function utteranceFor(letter: Letter, lang: LanguageCode): string {
  const g = letter.glyph;
  const isBareConsonant =
    (lang === 'ta' && g.includes(PULLI)) ||
    ((lang === 'hi' || lang === 'sa' || lang === 'pi') && g.includes(HALANT));
  const isJamo = lang === 'ko' && HANGUL_JAMO_RANGE.test(g);
  const isCuneiform = (lang === 'sux' || lang === 'akk') && CUNEIFORM_RANGE.test(g);
  const isHieroglyph = lang === 'egy' && HIEROGLYPH_RANGE.test(g);
  const isAytham = lang === 'ta' && g === 'ஃ';

  // Spell-it-out cases: speak the example word if available, otherwise the
  // English-friendly transliteration name (which always exists).
  if (isBareConsonant || isJamo || isCuneiform || isHieroglyph || isAytham) {
    return letter.exampleWord || letter.name;
  }

  // For Hebrew/Arabic letters, the example word is the most natural sound;
  // the bare letter is silent / abbreviated.
  if ((lang === 'he' || lang === 'arc' || lang === 'ar') && letter.exampleWord) {
    return letter.exampleWord;
  }

  // Default: speak the glyph followed by the example word as reinforcement.
  return letter.exampleWord ? `${g}. ${letter.exampleWord}` : g;
}

// Public API. Safe to call repeatedly. Fails silently if TTS is unavailable.
export async function speakLetter(lang: LanguageCode, letter: Letter): Promise<void> {
  try {
    await Tts.stop();
    const voiceId = await pickVoiceFor(lang);
    if (voiceId) {
      await Tts.setDefaultVoice(voiceId);
    } else {
      await Tts.setDefaultLanguage(TTS_LOCALE[lang]);
    }
    await Tts.setDefaultRate(RATE[lang] ?? RATE_DEFAULT, true);
    await Tts.setDefaultPitch(1.05); // touch above neutral, friendlier for kids
    Tts.speak(utteranceFor(letter, lang));
  } catch {
    // Locale missing on device, voice not installed, or engine error.
  }
}

export function stopSpeaking() {
  Tts.stop().catch(() => {});
}
