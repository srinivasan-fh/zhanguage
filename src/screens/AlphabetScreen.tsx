import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { LANGUAGES } from '@/content/languages';
import { getLetters, getSections } from '@/content/letters';
import { useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
import type { RootState } from '@/store';
import { colors, radii, spacing, e2 } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Alphabet'>;

export function AlphabetScreen({ navigation, route }: Props) {
  const { language } = route.params;
  const meta = LANGUAGES.find((l) => l.code === language)!;
  const all = useMemo(() => getLetters(language), [language]);
  const sections = useMemo(() => getSections(language), [language]);

  const activeId = useAppSelector(selectActiveProfileId);
  const lettersSeen = useAppSelector((s: RootState) =>
    activeId ? s.points.byStudent[activeId]?.lettersSeen ?? {} : {},
  );
  const lessonResults = useAppSelector((s: RootState) =>
    activeId ? s.points.byStudent[activeId]?.lessonResults ?? {} : {},
  );

  const indexByGlyph = useMemo(() => {
    const m = new Map<string, number>();
    all.forEach((l, i) => m.set(l.glyph + ':' + l.lessonId, i));
    return m;
  }, [all]);

  return (
    <ScreenBg>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBlock}>
          <Text style={styles.heroLabel}>{meta.name.toUpperCase()}</Text>
          <Text style={styles.heroNative}>{meta.nativeName}</Text>
          <Text style={styles.heroSub}>{all.length} letters · tap any letter</Text>
        </View>

        {sections.map((sec) => {
          const seen = lettersSeen[`${language}:${sec.lessonId}`];
          const seenCount = seen ? Object.keys(seen).length : 0;
          const result = lessonResults[sec.lessonId];
          return (
            <View key={sec.lessonId} style={styles.section}>
              <View style={styles.sectionHead}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>{sec.title}</Text>
                  <Text style={styles.sectionMeta}>
                    {seenCount} / {sec.letters.length}
                    {result ? `  ·  ${result.medal} ${result.scorePct}%` : ''}
                  </Text>
                </View>
                <Pressable
                  style={styles.quizPill}
                  onPress={() => navigation.navigate('Quiz', { language, lessonId: sec.lessonId })}
                >
                  <Text style={styles.quizPillLabel}>Quiz</Text>
                </Pressable>
              </View>
              <View style={styles.grid}>
                {sec.letters.map((letter) => {
                  const gi = indexByGlyph.get(letter.glyph + ':' + sec.lessonId) ?? 0;
                  const wasSeen = seen ? !!seen[letter.glyph] : false;
                  return (
                    <Pressable
                      key={letter.glyph + sec.lessonId + gi}
                      style={({ pressed }) => [
                        styles.cell,
                        wasSeen && styles.cellSeen,
                        pressed && { transform: [{ scale: 0.94 }] },
                      ]}
                      onPress={() => navigation.navigate('Letter', { language, index: gi })}
                    >
                      <Text style={styles.cellGlyph} numberOfLines={1}>{letter.glyph}</Text>
                      <Text style={styles.cellName} numberOfLines={1}>{letter.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  heroBlock: { alignItems: 'center', paddingVertical: spacing.md, gap: 4 },
  heroLabel: { fontSize: 14, letterSpacing: 6, fontWeight: '800', color: colors.inkMuted },
  heroNative: { fontSize: 48, fontWeight: '900', color: colors.ink, lineHeight: 56 },
  heroSub: { fontSize: 13, color: colors.inkSoft, marginTop: 4 },
  section: { gap: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.inkSoft, letterSpacing: 0.3 },
  sectionMeta: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontWeight: '700' },
  quizPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,122,89,0.25)',
  },
  quizPillLabel: { color: colors.primaryDark, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cell: {
    width: '18%',
    aspectRatio: 0.9,
    backgroundColor: colors.glassStrong,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    ...e2,
  },
  cellSeen: {
    borderColor: colors.grass,
    backgroundColor: 'rgba(123, 211, 137, 0.18)',
  },
  cellGlyph: { fontSize: 26, fontWeight: '900', color: colors.primary, lineHeight: 34 },
  cellName: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.inkSoft,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
