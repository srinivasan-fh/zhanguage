import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '@/navigation/types';
import { getPhasePack } from '@/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
import { medalFor, recordLessonResult } from '@/store/slices/pointsSlice';
import { earnFromPoints } from '@/store/slices/walletSlice';
import { BigButton } from '@/components/BigButton';
import { ScreenBg } from '@/components/ScreenBg';
import { colors, fontSizes, radii, elevation, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

// Pick a glyph fontSize from the codepoint count so 1-char letters stay big
// and 2/3-char composites still fit inside a 2x2 card.
// Some 1-codepoint glyphs render visually wider than their siblings (ஔ, ㅘ
// etc.) and need the same downsize as 2-codepoint composites.
const WIDE_SINGLE_GLYPHS = new Set(['ஔ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅢ']);

function fontSizeFor(glyph: string): number {
  const cps = [...glyph]; // codepoints, not UTF-16 code units
  const n = cps.length;
  if (n <= 1) return WIDE_SINGLE_GLYPHS.has(glyph) ? 58 : 96;
  if (n === 2) return 58;
  if (n === 3) return 48;
  return 40;
}

export function LessonScreen({ navigation, route }: Props) {
  const { language, phase, lessonId } = route.params;
  const pack = getPhasePack(language, phase);
  const lesson = pack?.lessons.find((l) => l.id === lessonId);

  const [stage, setStage] = useState<'study' | 'quiz' | 'done'>('study');
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const activeProfileId = useAppSelector(selectActiveProfileId);

  const quiz = lesson?.quiz ?? [];
  const items = useMemo(() => lesson?.items ?? [], [lesson]);

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text>Lesson not found.</Text>
      </View>
    );
  }

  const finalize = (right: number) => {
    if (!activeProfileId) return;
    const pct = quiz.length === 0 ? 100 : Math.round((right / quiz.length) * 100);
    const { points } = medalFor(pct);
    dispatch(
      recordLessonResult({
        studentId: activeProfileId,
        language,
        phase,
        lessonId: lesson.id,
        scorePct: pct,
      }),
    );
    dispatch(earnFromPoints({ studentId: activeProfileId, points }));
    navigation.replace('LessonComplete', {
      language,
      lessonId: lesson.id,
      scorePct: pct,
      pointsEarned: points,
    });
  };

  if (stage === 'study') {
    return (
      <ScreenBg>
      <ScrollView contentContainerStyle={styles.studyContent}>
        <Text style={styles.title}>{lesson.title}</Text>
        <View style={styles.cardsGrid}>
          {items.map((item) => (
            <View key={item.glyph} style={styles.flashcard}>
              <View style={styles.glyphBox}>
                <Text
                  style={[styles.glyph, { fontSize: fontSizeFor(item.glyph) }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  allowFontScaling={false}
                >
                  {item.glyph}
                </Text>
              </View>
              <Text style={styles.glyphName} numberOfLines={1} adjustsFontSizeToFit>
                {item.name}
              </Text>
              {item.exampleWord ? (
                <Text style={styles.example} numberOfLines={1} adjustsFontSizeToFit>
                  {item.exampleWord}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
        <BigButton
          label={quiz.length > 0 ? 'Try the Quiz' : 'Finish Lesson'}
          emoji="✨"
          onPress={() => {
            if (quiz.length === 0) finalize(0);
            else setStage('quiz');
          }}
        />
      </ScrollView>
      </ScreenBg>
    );
  }

  const q = quiz[qIdx];
  const onPick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const isRight = opt === q.answer;
    ReactNativeHapticFeedback.trigger(
      isRight ? 'notificationSuccess' : 'notificationError',
      { enableVibrateFallback: true, ignoreAndroidSystemSettings: false },
    );
    if (isRight) setCorrect((c) => c + 1);
    setTimeout(() => {
      setPicked(null);
      if (qIdx + 1 >= quiz.length) {
        finalize(correct + (isRight ? 1 : 0));
      } else {
        setQIdx((i) => i + 1);
      }
    }, 700);
  };

  return (
    <ScreenBg>
    <View style={styles.quizContainer}>
      <Text style={styles.progress}>{qIdx + 1} / {quiz.length}</Text>
      <Text style={styles.prompt}>{q.prompt}</Text>
      <View style={styles.optionsGrid}>
        {q.options.map((opt) => {
          const isPickedRight = picked === opt && opt === q.answer;
          const isPickedWrong = picked === opt && opt !== q.answer;
          return (
            <Pressable
              key={opt}
              style={[
                styles.option,
                isPickedRight && { backgroundColor: colors.grass },
                isPickedWrong && { backgroundColor: colors.danger },
              ]}
              onPress={() => onPick(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  studyContent: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, letterSpacing: 0.2 },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  flashcard: {
    backgroundColor: colors.glassStrong,
    width: '48%',
    minHeight: 220,
    borderRadius: radii.lg,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    overflow: 'hidden',
    ...elevation.e2,
  },
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  glyphBox: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    color: colors.primary,
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
  },
  glyphName: { fontSize: 16, color: colors.ink, fontWeight: '700', textAlign: 'center' },
  example: { fontSize: 12, color: colors.inkSoft, textAlign: 'center', marginTop: 2 },
  quizContainer: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  progress: { fontWeight: '800', color: colors.inkSoft, textAlign: 'center', fontSize: 16 },
  prompt: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, textAlign: 'center', marginVertical: spacing.lg },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  option: {
    backgroundColor: colors.glassStrong,
    minWidth: '46%',
    paddingVertical: spacing.xl,
    borderRadius: radii.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...elevation.e2,
  },
  optionText: { fontSize: 36, fontWeight: '900', color: colors.ink },
});
