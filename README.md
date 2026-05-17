# Zhanguage

An offline React Native (Expo) app that teaches **Tamil, English, Hindi, Japanese,
German, Mandarin, and Korean** to kids through a 10-phase curriculum, with a
points → pocket-money reward loop driven by parents.

- App name: **Zhanguage**
- Package: `com.zhanguage.app`

See [`docs/DESIGN.md`](./docs/DESIGN.md) for the full product + technical design.

## Quick start

```bash
npm install
npm run start         # opens Expo dev server
npm run android       # or
npm run ios
```

> Requires Node 18+ and the Expo CLI (`npm i -g expo`).

## What's in this scaffold

- **Profile-first onboarding** — no sign-in, up to 3 kids per device.
- **Language picker** — 7 languages in a kid-friendly grid.
- **10-phase curriculum** — letters, pronouns, words, grammar, writing, reading,
  speaking, listening, and a final certification test.
- **Reward economy** — bronze / silver / gold / diamond / emerald medals that
  convert to real pocket money inside a parent-funded wallet.
- **Parent gate** — math-question gate (PIN-equivalent for MVP).
- **Offline content** — every lesson lives in `src/content/<lang>/phase<N>.json`.

## Project layout

```
App.tsx                    Entry, hydration, NavigationContainer
src/
  navigation/              Stack + param types
  screens/                 Profile, Home, Phase, Lesson, Rewards, Parent
  components/              BigButton, Card, Avatar, Medal
  store/                   Zustand stores (profile / progress / wallet)
  storage/                 AsyncStorage helpers
  content/                 JSON content packs + language registry
  types/                   Shared TS types
  theme/                   Colors, radii, spacing, shadows
docs/DESIGN.md             Product + tech design (read this first)
```

## Status

Scaffold + Phase 1 content stub for all 7 languages. Next milestones in the
design doc's roadmap section.
