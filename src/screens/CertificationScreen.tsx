import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { getPhasePack } from '@/content';
import { LANGUAGES } from '@/content/languages';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveProfile, selectActiveProfileId, selectTotalPointsFor } from '@/store/selectors';
import { recordLessonResult, medalFor } from '@/store/slices/pointsSlice';
import { earnFromPoints } from '@/store/slices/walletSlice';
import { BigButton } from '@/components/BigButton';
import { colors, fontSizes, radii, e2, e3, spacing } from '@/theme';
import type { QuizQuestion } from '@/types/content';

type Props = NativeStackScreenProps<RootStackParamList, 'Certification'>;

const TOTAL_QUESTIONS = 10;

function sampleQuestions(language: string): QuizQuestion[] {
  const all: QuizQuestion[] = [];
  for (let p = 1; p <= 9; p++) {
    const pack = getPhasePack(language as never, p);
    if (!pack) continue;
    for (const lesson of pack.lessons) {
      for (const q of lesson.quiz ?? []) {
        // Only pick tap-style questions in the cert; fill-blank also works
        // because it uses the same 4-option UI.
        if (q.kind === 'tap-the-sound' || q.kind === 'fill-blank') {
          all.push(q);
        }
      }
    }
  }
  // Fisher–Yates shuffle, then take first N.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, TOTAL_QUESTIONS);
}

export function CertificationScreen({ navigation, route }: Props) {
  const { language } = route.params;
  const meta = LANGUAGES.find((l) => l.code === language)!;
  const questions = useMemo(() => sampleQuestions(language), [language]);

  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const dispatch = useAppDispatch();
  const activeId = useAppSelector(selectActiveProfileId);
  const profile = useAppSelector(selectActiveProfile);
  const totalPoints = useAppSelector(selectTotalPointsFor(activeId));

  if (questions.length === 0) {
    return (
      <ScreenBg>
        <View style={styles.center}>
          <Text style={styles.empty}>Not enough quiz content yet. Complete some earlier phases first.</Text>
        </View>
      </ScreenBg>
    );
  }

  const finalize = (right: number) => {
    if (!activeId) { setDone(true); return; }
    const pct = Math.round((right / questions.length) * 100);
    const { points } = medalFor(pct);
    dispatch(recordLessonResult({
      studentId: activeId,
      language,
      phase: 10,
      lessonId: `${language}-p10-l1`,
      scorePct: pct,
    }));
    dispatch(earnFromPoints({ studentId: activeId, points }));
    setDone(true);
  };

  if (done) {
    const score = correct;
    const pct = Math.round((score / questions.length) * 100);
    const { tier } = medalFor(pct);
    const today = new Date().toISOString().slice(0, 10);
    return (
      <ScreenBg>
        <View style={styles.center}>
          <View style={styles.certCard}>
            <Text style={styles.certCorner}>★</Text>
            <Text style={styles.certHeader}>Certificate of Completion</Text>
            <Text style={styles.certLang}>{meta.nativeName}  ·  {meta.name}</Text>
            <View style={styles.certLine} />
            <Text style={styles.certLabel}>This is to certify that</Text>
            <Text style={styles.certName}>{profile?.name ?? 'Young Learner'}</Text>
            <Text style={styles.certLabel}>
              has finished all ten phases of Zhanguage
              {'\n'}with a final score of
            </Text>
            <Text style={styles.certScore}>{score} / {questions.length}  ·  {pct}%</Text>
            <Text style={styles.certMedal}>🏅  {tier.toUpperCase()}</Text>
            <View style={styles.certLine} />
            <Text style={styles.certFoot}>Total points earned: {totalPoints}</Text>
            <Text style={styles.certFoot}>Issued on {today}</Text>
          </View>
          <BigButton label="Done" emoji="✅" onPress={() => navigation.popToTop()} style={{ marginTop: spacing.lg }} />
        </View>
      </ScreenBg>
    );
  }

  const q = questions[qIdx];
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
      if (qIdx + 1 >= questions.length) finalize(correct + (isRight ? 1 : 0));
      else setQIdx((i) => i + 1);
    }, 700);
  };

  return (
    <ScreenBg>
      <View style={styles.container}>
        <Text style={styles.crown}>👑  Final Certification Test</Text>
        <Text style={styles.progress}>{qIdx + 1} / {questions.length}</Text>
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
  empty: { color: colors.inkSoft, fontSize: 18, textAlign: 'center' },
  crown: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, textAlign: 'center' },
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

  certCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(255, 246, 220, 0.95)',
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 200, 69, 0.7)',
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    ...e3,
  },
  certCorner: { position: 'absolute', top: 8, right: 12, fontSize: 26, color: '#B97800' },
  certHeader: { fontSize: 22, fontWeight: '900', color: '#7A5A00', letterSpacing: 1.5, textAlign: 'center' },
  certLang: { fontSize: 16, color: '#7A5A00', fontWeight: '700' },
  certLine: { width: '70%', height: 1, backgroundColor: 'rgba(122, 90, 0, 0.35)', marginVertical: spacing.sm },
  certLabel: { fontSize: 13, color: '#5A4400', textAlign: 'center', lineHeight: 18 },
  certName: { fontSize: 28, fontWeight: '900', color: '#3F2A00', textAlign: 'center', marginVertical: 4 },
  certScore: { fontSize: 26, fontWeight: '900', color: '#3F2A00', marginTop: 4 },
  certMedal: { fontSize: 22, fontWeight: '900', color: '#7A5A00' },
  certFoot: { fontSize: 12, color: '#5A4400', fontStyle: 'italic' },
});
