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
import { colors, fontSizes, radii, shadow, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

// Pick a glyph fontSize from the codepoint count so 1-char letters stay big
// and 2/3-char composites still fit inside a 2x2 card.
function fontSizeFor(glyph: string): number {
  const n = [...glyph].length; // codepoints, not UTF-16 code units
  if (n <= 1) return 96;
  if (n === 2) return 64;
  if (n === 3) return 52;
  return 44;
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
      <ScrollView contentContainerStyle={styles.studyContent}>
        <Text style={styles.title}>{lesson.title}</Text>
        <View style={styles.cardsGrid}>
          {items.map((item) => (
            <View key={item.glyph} style={styles.flashcard}>
              <View style={styles.glyphBox}>
                <Text
                  style={[styles.glyph, { fontSize: fontSizeFor(item.glyph) }]}
                  numberOfLines={1}
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
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  studyContent: { padding: spacing.lg, gap: spacing.lg, backgroundColor: colors.cream },
  title: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  flashcard: {
    backgroundColor: colors.paper,
    width: '48%',
    aspectRatio: 1,
    borderRadius: radii.lg,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    ...shadow.card,
  },
  glyphBox: {
    flex: 1,
    alignSelf: 'stretch',
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
  quizContainer: { flex: 1, padding: spacing.lg, gap: spacing.lg, backgroundColor: colors.cream },
  progress: { fontWeight: '800', color: colors.inkSoft, textAlign: 'center' },
  prompt: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, textAlign: 'center', marginVertical: spacing.lg },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  option: {
    backgroundColor: colors.paper,
    minWidth: '46%',
    paddingVertical: spacing.xl,
    borderRadius: radii.lg,
    alignItems: 'center',
    ...shadow.card,
  },
  optionText: { fontSize: 36, fontWeight: '900', color: colors.ink },
});
