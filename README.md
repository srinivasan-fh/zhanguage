# Zhanguage

An offline **pure React Native** app (no Expo) that teaches **Tamil, English,
Hindi, Japanese, German, Mandarin, and Korean** to kids through a 10-phase
curriculum, with a points → pocket-money reward loop driven by parents.

- App name: **Zhanguage**
- Package / Bundle ID: `com.zhanguage.app`
- React Native: 0.75.4

See [`docs/DESIGN.md`](./docs/DESIGN.md) for the full product + technical design.

## Setup

Prereqs: Node 18+, JDK 17, Android Studio (with SDK 34), and Xcode 15+ for iOS.

```bash
npm install

# iOS — install pods (Mac only)
cd ios && pod install && cd ..

# Run
npm run android
npm run ios
npm start                # Metro bundler only
```

## What's in this scaffold

- **Profile-first onboarding** — no sign-in, up to 3 kids per device.
- **Language picker** — 7 languages in a kid-friendly grid.
- **10-phase curriculum** — letters, pronouns, words, grammar, writing, reading,
  speaking, listening, and a final certification test.
- **Reward economy** — bronze / silver / gold / diamond / emerald medals that
  convert to real pocket money inside a parent-funded wallet.
- **Parent gate** — math-question gate (PIN-equivalent for MVP).
- **Offline content** — every lesson lives in `src/content/<lang>/phase<N>.json`.
- **Native projects committed** — `android/` and `ios/` folders included.

## Project layout

```
App.tsx                    Entry, hydration, NavigationContainer
index.js                   AppRegistry.registerComponent
android/                   Native Android project (Gradle, Kotlin)
ios/                       Native iOS project (Xcode, Swift)
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

## Native libs in use

- `@react-navigation/native` + `@react-navigation/native-stack`
- `@react-native-async-storage/async-storage` — offline persistence
- `react-native-haptic-feedback` — tap feedback on correct/incorrect
- `react-native-sound` — audio playback for letter/word lessons
- `react-native-svg` — for trace lessons (Phase 6)
- `react-native-screens`, `react-native-gesture-handler`, `react-native-safe-area-context`
- `zustand` — state management

> Each native lib above requires `pod install` (iOS) after `npm install`.
> Android autolinks automatically.

## Status

Scaffold + Phase 1 content stub for all 7 languages. Next milestones in the
design doc's roadmap section.
