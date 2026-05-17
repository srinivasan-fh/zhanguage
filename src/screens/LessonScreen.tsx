import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '@/navigation/types';
import { getPhasePack } from '@/content';
import { useProfileStore } from '@/store/profileStore';
import { useProgressStore, medalFor } from '@/store/progressStore';
import { useWalletStore } from '@/store/walletStore';
import { BigButton } from '@/components/BigButton';
import { colors, fontSizes, radii, shadow, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

export function LessonScreen({ navigation, route }: Props) {
  const { language, phase, lessonId } = route.params;
  const pack = getPhasePack(language, phase);
  const lesson = pack?.lessons.find((l) => l.id === lessonId);

  const [stage, setStage] = useState<'study' | 'quiz' | 'done'>('study');
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const recordResult = useProgressStore((s) => s.recordResult);
  const earnFromPoints = useWalletStore((s) => s.earnFromPoints);

  const quiz = lesson?.quiz ?? [];

  const items = useMemo(() => lesson?.items ?? [], [lesson]);

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text>Lesson not found.</Text>
      </View>
    );
  }

  const finalize = async (right: number) => {
    if (!activeProfileId) return;
    const pct = quiz.length === 0 ? 100 : Math.round((right / quiz.length) * 100);
    const { tier, points } = medalFor(pct);
    await recordResult(activeProfileId, language, {
      lessonId: lesson.id,
      scorePct: pct,
      medal: tier,
      points,
      attempts: 1,
      lastAt: Date.now(),
    });
    const moneyEarnedCents = await earnFromPoints(activeProfileId, points);
    navigation.replace('LessonComplete', {
      language,
      lessonId: lesson.id,
      scorePct: pct,
      pointsEarned: points,
      moneyEarnedCents,
    });
  };

  if (stage === 'study') {
    return (
      <ScrollView contentContainerStyle={styles.studyContent}>
        <Text style={styles.title}>{lesson.title}</Text>
        <View style={styles.cardsGrid}>
          {items.map((item) => (
            <View key={item.glyph} style={styles.flashcard}>
              <Text style={styles.glyph}>{item.glyph}</Text>
              <Text style={styles.glyphName}>{item.name}</Text>
              {item.exampleWord ? <Text style={styles.example}>{item.exampleWord}</Text> : null}
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

  if (stage === 'quiz') {
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
        <Text style={styles.progress}>
          {qIdx + 1} / {quiz.length}
        </Text>
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

  return <View style={styles.center} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  studyContent: { padding: spacing.lg, gap: spacing.lg, backgroundColor: colors.cream },
  title: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  flashcard: {
    backgroundColor: colors.paper,
    width: '47%',
    aspectRatio: 1,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...shadow.card,
  },
  glyph: { fontSize: 80, color: colors.primary, fontWeight: '900' },
  glyphName: { fontSize: 18, color: colors.ink, fontWeight: '700' },
  example: { fontSize: 13, color: colors.inkSoft },
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
