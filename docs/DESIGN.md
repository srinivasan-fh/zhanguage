# Zhanguage — Multilingual Learning App for Kids

A fully offline React Native app that teaches Tamil, English, Hindi, Japanese,
German, Mandarin, and Korean to children through a 10-phase curriculum, with
a points → pocket-money reward loop driven by parents.

---

## 1. Product Goals

- **Audience:** Children (roughly 4–12), with parents as secondary users.
- **Offline-first:** All lessons, audio, and progress live on-device.
- **Frictionless onboarding:** No sign-in. Pick a profile, pick a language, learn.
- **Multi-profile:** 2–3 kids share one device, each with their own progress.
- **Motivation loop:** Earn medals (bronze → silver → gold → diamond → emerald)
  per lesson, daily streak bonus, parent converts medals → pocket money.

## 2. Supported Languages

| Code | Language | Script        | Notes                                     |
| ---- | -------- | ------------- | ----------------------------------------- |
| `en` | English  | Latin         | Default UI language                       |
| `ta` | Tamil    | Tamil         | Vowels (உயிர்) + consonants (மெய்)        |
| `hi` | Hindi    | Devanagari    | Swar + vyanjan                            |
| `ja` | Japanese | Hiragana/Kana | Phase 1 = hiragana; kanji deferred        |
| `de` | German   | Latin + ÄÖÜß  | Reuses Latin letter assets                |
| `zh` | Mandarin | Hanzi+Pinyin  | Phase 1 = pinyin tones; characters later  |
| `ko` | Korean   | Hangul        | Phase 1 = jamo                            |

## 3. Curriculum — 10 Phases

Each phase contains 1..N lessons. Lessons are short (3–6 minutes) so kids
can finish one in a single sitting.

| # | Phase                     | Lesson examples                                            |
|---|---------------------------|------------------------------------------------------------|
| 1 | Letters & Sounds          | Vowels, consonants, individual sound playback              |
| 2 | Pronouns & Relationships  | I, you, mother, father, brother, sister, grandparents      |
| 3 | 2/3-Letter Words          | Common short words with pictures                           |
| 4 | 4/5-Letter Words          | Larger everyday words                                      |
| 5 | Grammar Essentials        | Sentence order, tense markers, plurals                     |
| 6 | Writing                   | Trace-the-letter, fill-the-blank                           |
| 7 | Reading                   | Read aloud + comprehension Q                               |
| 8 | Speaking                  | Mic prompt → record → playback (no STT in MVP)             |
| 9 | Listening                 | Hear → tap correct option                                  |
|10 | Certification Test        | Mixed-format quiz; printable certificate                   |

## 4. Reward Economy

### 4.1 Medal tiers (per lesson)

| Tier      | Score band | Points |
|-----------|------------|--------|
| Bronze    | 50–69%     | 10     |
| Silver    | 70–84%     | 20     |
| Gold      | 85–94%     | 35     |
| Diamond   | 95–99%     | 60     |
| Emerald   | 100%       | 100    |

### 4.2 Daily practice bonus

- 1st practice of the day: +5 bonus points
- 3 practices/day for 7 days straight: +50 streak bonus

### 4.3 Pocket money

- Parent opens Parent Dashboard (PIN-protected).
- Parent sets a *conversion rate* (e.g. 100 pts = ₹10).
- Parent deposits a *packet* (e.g. ₹200) into the child's wallet.
- App shows kid: "You have ₹200 — spend it by earning points."
- When kid earns N points, wallet **balance reduces by N × rate**, displayed as
  a celebratory animation: "You earned ₹15 of your pocket money!"
- When wallet hits 0, parent gets a "Top up?" prompt next time they open the
  dashboard.

Implementation note: a single ledger table records every credit/debit so
parents can audit.

## 5. App Surfaces (Screens)

```
ProfileSelect           ← cold start lands here
   └─ CreateProfile     (avatar, name, age)
   └─ Home              (language picker grid)
        └─ PhaseList    (10 large cards)
              └─ LessonList
                    └─ Lesson (player)
                          └─ LessonComplete (medal + points)
        └─ Rewards      (medals, wallet, streak)
        └─ ParentDashboard (PIN-gated)
              ├─ Set conversion rate
              ├─ Add packet money
              ├─ View progress per child
              └─ Reset / lock profile
```

## 6. UI / UX Principles (Kid-Friendly)

- **Large touch targets:** minimum 64 dp tap area, primary buttons 96 dp tall.
- **Grid views, not lists,** for top-level navigation (languages, phases).
- **High-contrast palette,** rounded corners (≥ 24 dp), playful but readable.
- **Mascot character** acclaims success ("Great job, Aisha!").
- **No timed pressure** in lessons 1–4; gentle timer appears from phase 5.
- **Audio first:** every letter/word has a tap-to-hear button.
- **Haptic feedback** on correct/incorrect answers.
- **Read-aloud labels** so pre-readers can navigate.

## 7. Architecture

```
React Native (Expo SDK)            ← cross-platform, easy audio + asset bundling
├── React Navigation               ← stack + bottom tabs
├── Zustand                        ← lightweight global state (profile, progress)
├── AsyncStorage                   ← persisted slices
├── expo-av                        ← audio playback
├── expo-haptics                   ← feedback
└── JSON content packs             ← shipped in /assets, lazy-imported per language
```

### 7.1 Data flow

```
JSON content pack ──▶ ContentService ──▶ Lesson screen
                                       ▲
profileStore + progressStore ──────────┘
        │
        └──▶ AsyncStorage (per-profile namespace)
```

### 7.2 Storage namespacing

All persisted keys are prefixed with the active profile id:

```
profile:<id>:progress:<lang>:<phaseId>:<lessonId>  → { score, medal, attempts, lastAt }
profile:<id>:wallet                                → { balanceCents, rateCentsPerPoint }
profile:<id>:ledger                                → Entry[]
profile:<id>:streak                                → { count, lastDayISO }
```

## 8. Content Pack JSON Schema

One JSON file per `(language, phase)`. Bundled in `src/content/<lang>/phase<N>.json`.

```jsonc
{
  "language": "en",
  "phase": 1,
  "title": "Letters & Sounds",
  "lessons": [
    {
      "id": "en-p1-l1",
      "title": "Vowels A–E",
      "type": "letters",
      "items": [
        { "glyph": "A", "name": "A", "audio": "audio/en/a.mp3", "exampleWord": "Apple", "exampleImage": "img/apple.png" },
        { "glyph": "B", "name": "Bee", "audio": "audio/en/b.mp3", "exampleWord": "Ball",  "exampleImage": "img/ball.png" }
      ],
      "quiz": [
        { "kind": "tap-the-sound", "prompt": "Which letter says /a/?", "answer": "A", "options": ["A","B","C","D"] }
      ],
      "maxPoints": 100
    }
  ]
}
```

Lesson `type` enum:

- `letters` — flashcards of glyph + audio
- `vocab` — word + image + audio
- `pronouns` — relationship tree picker
- `grammar` — fill-the-gap
- `trace` — finger-trace SVG
- `read` — sentence with read-aloud
- `speak` — mic record + playback
- `listen` — audio → pick option
- `quiz` — mixed, used by Phase 10

## 9. State Management

Three Zustand stores, each persisted independently:

```ts
profileStore   = { profiles, activeProfileId, createProfile, switchProfile, … }
progressStore  = { byProfile: { [id]: { [lang]: { [lessonId]: LessonResult } } } }
walletStore    = { byProfile: { [id]: { balanceCents, rateCentsPerPoint, ledger } } }
```

## 10. Parent PIN

- 4-digit PIN set the first time Parent Dashboard is opened.
- Stored as SHA-256 in AsyncStorage (kid-proof, not bank-grade).
- Math-gate fallback ("What is 7 × 8?") if PIN forgotten — keeps kids out, lets
  adults in.

## 11. Out of scope (MVP)

- Speech-to-text scoring (Phase 8 records & plays back only).
- Cloud sync, accounts, leaderboards.
- In-app purchases.
- Kanji, full Hanzi character writing.

## 12. Roadmap from this scaffold

1. **Now:** scaffold, navigation, profile select, theme, content schema, English Phase 1 sample.
2. **Next:** wire lesson player + quiz engine + medal calculation.
3. **Then:** parent PIN + wallet + ledger UI.
4. **Then:** author content packs for remaining 6 languages × phases 1–4.
5. **Then:** trace (SVG path), record (expo-av), and certification screen.
