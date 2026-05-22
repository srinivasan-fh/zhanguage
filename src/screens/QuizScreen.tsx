import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { getPhasePack } from '@/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
import { recordLessonResult, medalFor } from '@/store/slices/pointsSlice';
import { earnFromPoints } from '@/store/slices/walletSlice';
import { colors, fontSizes, radii, e2, e3, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export function QuizScreen({ navigation, route }: Props) {
  const { language, phase = 1, lessonId } = route.params;
  const pack = getPhasePack(language, phase);
  const lesson = pack?.lessons.find((l) => l.id === lessonId);
  const quiz = useMemo(() => lesson?.quiz ?? [], [lesson]);

  const dispatch = useAppDispatch();
  const activeId = useAppSelector(selectActiveProfileId);

  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  if (!lesson || quiz.length === 0) {
    return (
      <ScreenBg>
        <View style={styles.center}>
          <Text style={styles.empty}>No quiz for this lesson.</Text>
        </View>
      </ScreenBg>
    );
  }

  const finalize = (right: number) => {
    if (!activeId) return;
    const pct = Math.round((right / quiz.length) * 100);
    const { points } = medalFor(pct);
    dispatch(recordLessonResult({ studentId: activeId, language, phase, lessonId, scorePct: pct }));
    dispatch(earnFromPoints({ studentId: activeId, points }));
    navigation.replace('LessonComplete', {
      language,
      lessonId,
      scorePct: pct,
      pointsEarned: points,
    });
  };

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
      <View style={styles.container}>
        <Text style={styles.heading}>{lesson.title}</Text>
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
                  isPickedRight && { backgroundColor: colors.grass, borderColor: colors.grass },
                  isPickedWrong && { backgroundColor: colors.danger, borderColor: colors.danger },
                ]}
                onPress={() => onPick(opt)}
              >
                <Text style={[styles.optionText, (isPickedRight || isPickedWrong) && { color: '#fff' }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  empty: { color: colors.inkSoft, fontSize: 18 },
  heading: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, letterSpacing: 0.2, textAlign: 'center' },
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
    ...e2,
  },
  optionText: { fontSize: 36, fontWeight: '900', color: colors.ink },
});
