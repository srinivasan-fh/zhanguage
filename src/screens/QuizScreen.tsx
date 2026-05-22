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
import { colors, fontSizes, radii, e2, spacing } from '@/theme';

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
  const [orderPicked, setOrderPicked] = useState<string[]>([]);

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
    navigation.replace('LessonComplete', { language, lessonId, scorePct: pct, pointsEarned: points });
  };

  const q = quiz[qIdx];
  const isOrder = q.kind === 'order-words';

  const advance = (isRight: boolean) => {
    ReactNativeHapticFeedback.trigger(
      isRight ? 'notificationSuccess' : 'notificationError',
      { enableVibrateFallback: true, ignoreAndroidSystemSettings: false },
    );
    if (isRight) setCorrect((c) => c + 1);
    setTimeout(() => {
      setPicked(null);
      setOrderPicked([]);
      if (qIdx + 1 >= quiz.length) {
        finalize(correct + (isRight ? 1 : 0));
      } else {
        setQIdx((i) => i + 1);
      }
    }, 700);
  };

  const onPickTap = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    advance(opt === q.answer);
  };

  const onPickOrder = (opt: string) => {
    if (orderPicked.includes(opt)) return;
    const next = [...orderPicked, opt];
    setOrderPicked(next);
    if (next.length === q.options.length) {
      const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
      const sentence = next.join(' ').replace(/\s+([.!?,])/g, '$1');
      advance(norm(sentence) === norm(q.answer));
    }
  };

  return (
    <ScreenBg>
      <View style={styles.container}>
        <Text style={styles.heading}>{lesson.title}</Text>
        <Text style={styles.progress}>{qIdx + 1} / {quiz.length}</Text>
        <Text style={styles.prompt}>{q.prompt}</Text>

        {isOrder ? (
          <>
            <View style={styles.orderBar}>
              {orderPicked.length === 0 ? (
                <Text style={styles.orderPlaceholder}>Tap the words in order…</Text>
              ) : (
                orderPicked.map((w, i) => (
                  <Text key={i + w} style={styles.orderChip}>{w}</Text>
                ))
              )}
            </View>
            <View style={styles.optionsGrid}>
              {q.options.map((opt) => {
                const used = orderPicked.includes(opt);
                return (
                  <Pressable
                    key={opt}
                    disabled={used}
                    style={[styles.option, used && { opacity: 0.3 }]}
                    onPress={() => onPickOrder(opt)}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
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
                  onPress={() => onPickTap(opt)}
                >
                  <Text style={[styles.optionText, (isPickedRight || isPickedWrong) && { color: '#fff' }]}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
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
  prompt: { fontSize: 22, fontWeight: '800', color: colors.ink, textAlign: 'center', marginVertical: spacing.md },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  option: {
    backgroundColor: colors.glassStrong,
    minWidth: '46%',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...e2,
  },
  optionText: { fontSize: 22, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  orderBar: {
    minHeight: 60,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    padding: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  orderPlaceholder: { color: colors.inkMuted, fontStyle: 'italic', paddingHorizontal: spacing.sm },
  orderChip: {
    backgroundColor: colors.primarySoft,
    color: colors.primaryDark,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    fontWeight: '800',
    fontSize: 18,
    overflow: 'hidden',
  },
});
