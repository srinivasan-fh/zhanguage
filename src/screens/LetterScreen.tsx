import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { getLetters } from '@/content/letters';
import { getPhasePack } from '@/content';
import { useAppDispatch } from '@/store/hooks';
import { markLetterSeen } from '@/store/slices/pointsSlice';
import { useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
import { speakLetter, stopSpeaking } from '@/utils/tts';
import { colors, radii, spacing, e3 } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Letter'>;

const SWIPE_THRESHOLD = 60;

function tap() {
  ReactNativeHapticFeedback.trigger('impactLight', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
}

export function LetterScreen({ navigation, route }: Props) {
  const { language, phase = 1 } = route.params;
  const letters = useMemo(() => getLetters(language, phase), [language, phase]);
  const pack = useMemo(() => getPhasePack(language, phase), [language, phase]);
  const lessonSizeById = useMemo(() => {
    const m = new Map<string, number>();
    pack?.lessons.forEach((l) => m.set(l.id, l.items?.length ?? 0));
    return m;
  }, [pack]);

  const [index, setIndex] = useState(route.params.index);
  const dispatch = useAppDispatch();
  const activeId = useAppSelector(selectActiveProfileId);

  const letter = letters[index];

  // Mark each letter visited + auto-speak when it changes.
  useEffect(() => {
    if (!letter) return;
    if (activeId) {
      dispatch(
        markLetterSeen({
          studentId: activeId,
          language,
          phase,
          lessonId: letter.lessonId,
          glyph: letter.glyph,
          lessonSize: lessonSizeById.get(letter.lessonId) ?? 0,
        }),
      );
    }
    speakLetter(language, letter);
  }, [letter, activeId, dispatch, language, lessonSizeById]);

  // Stop any in-flight speech when leaving the screen.
  useEffect(() => stopSpeaking, []);

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i >= letters.length - 1) return i;
      tap();
      return i + 1;
    });
  }, [letters.length]);
  const goPrev = useCallback(() => {
    setIndex((i) => {
      if (i <= 0) return i;
      tap();
      return i - 1;
    });
  }, []);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, g) =>
        Math.abs(g.dx) > 12 || Math.abs(g.dy) > 12,
      onPanResponderRelease: (_evt, g) => {
        const absX = Math.abs(g.dx);
        const absY = Math.abs(g.dy);
        if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;
        if (absY > absX) {
          if (g.dy > 0) goNext();
          else goPrev();
        } else if (g.dx < 0) {
          goBack();
        }
      },
    }),
  ).current;

  if (!letter) {
    return (
      <ScreenBg>
        <View style={styles.container}>
          <Text style={styles.example}>No letters available.</Text>
        </View>
      </ScreenBg>
    );
  }

  // Is the current letter the last one of its lesson? If yes, offer the quiz.
  const isLastOfLesson =
    index === letters.length - 1 || letters[index + 1]?.lessonId !== letter.lessonId;
  const hasQuiz =
    (pack?.lessons.find((l) => l.id === letter.lessonId)?.quiz?.length ?? 0) > 0;

  return (
    <ScreenBg>
      <View style={styles.container} {...responder.panHandlers}>
        <Text style={styles.position}>{index + 1} / {letters.length}</Text>

        <Pressable
          onPress={() => speakLetter(language, letter)}
          style={({ pressed }) => [styles.glyphCard, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <Text
            style={styles.glyph}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.3}
            allowFontScaling={false}
          >
            {letter.glyph}
          </Text>
          <Text style={styles.speaker}>🔊 tap to hear</Text>
        </Pressable>

        <Text style={styles.name}>{letter.name}</Text>
        {letter.exampleWord ? (
          <Text style={styles.example}>{letter.exampleWord}</Text>
        ) : null}

        <Text style={styles.sectionLabel}>{letter.lessonTitle}</Text>

        {phase === 8 ? (
          <Text style={styles.sayItPrompt}>🎤  Now you say it out loud!</Text>
        ) : null}

        {isLastOfLesson && hasQuiz ? (
          <Pressable
            style={styles.quizBtn}
            onPress={() =>
              navigation.navigate('Quiz', { language, phase, lessonId: letter.lessonId })
            }
          >
            <Text style={styles.quizBtnLabel}>✨ Try the Quiz</Text>
          </Pressable>
        ) : null}

        <View style={styles.hints}>
          <Hint emoji="⬇️" label="Swipe down · next" />
          <Hint emoji="⬆️" label="Swipe up · previous" />
          <Hint emoji="⬅️" label="Swipe left · back" />
        </View>
      </View>
    </ScreenBg>
  );
}

function Hint({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.hintRow}>
      <Text style={styles.hintEmoji}>{emoji}</Text>
      <Text style={styles.hintLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  position: { fontSize: 14, color: colors.inkMuted, fontWeight: '700', letterSpacing: 2 },
  glyphCard: {
    width: '88%',
    aspectRatio: 1,
    maxWidth: 360,
    borderRadius: radii.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: 2,
    borderColor: colors.glassEdge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    ...e3,
  },
  glyph: {
    fontSize: 200,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  speaker: { position: 'absolute', bottom: 14, fontSize: 14, color: colors.inkMuted, fontWeight: '800', letterSpacing: 0.5 },
  name: { fontSize: 40, fontWeight: '900', color: colors.ink, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
  example: { fontSize: 24, color: colors.inkSoft, fontWeight: '800', textAlign: 'center' },
  sectionLabel: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, textAlign: 'center', fontWeight: '700' },
  sayItPrompt: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    backgroundColor: colors.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 4,
  },
  quizBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    marginTop: spacing.md,
    ...e3,
  },
  quizBtnLabel: { color: '#fff', fontWeight: '900', fontSize: 18 },
  hints: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassEdge,
  },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hintEmoji: { fontSize: 18 },
  hintLabel: { fontSize: 14, color: colors.inkSoft, fontWeight: '700' },
});
