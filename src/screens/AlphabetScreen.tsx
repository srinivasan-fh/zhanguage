import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ListRenderItem } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { LANGUAGES } from '@/content/languages';
import { getLetters, getSections, type LetterSection } from '@/content/letters';
import { useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
import type { RootState } from '@/store';
import { colors, radii, spacing, e2 } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Alphabet'>;

export function AlphabetScreen({ navigation, route }: Props) {
  const { language, phase = 1, lessonId } = route.params;
  const meta = LANGUAGES.find((l) => l.code === language)!;
  const all = useMemo(() => getLetters(language, phase), [language, phase]);
  const allSections = useMemo(() => getSections(language, phase), [language, phase]);
  // When a specific lessonId is passed (from LessonsScreen), only show that
  // lesson's grid. Otherwise fall back to the full sectioned view.
  const sections = useMemo(
    () => (lessonId ? allSections.filter((s) => s.lessonId === lessonId) : allSections),
    [allSections, lessonId],
  );
  const itemNoun =
    phase === 1 ? 'letters' :
    phase <= 4 ? 'words' :
    phase === 5 ? 'examples' :
    phase === 6 ? 'glyphs to trace' :
    phase === 7 ? 'passages' :
    phase === 8 ? 'phrases to say' :
    phase === 9 ? 'audio clips' :
    'items';

  const activeId = useAppSelector(selectActiveProfileId);
  const lettersSeen = useAppSelector((s: RootState) =>
    activeId ? s.points.byStudent[activeId]?.lettersSeen ?? {} : {},
  );
  const lessonResults = useAppSelector((s: RootState) =>
    activeId ? s.points.byStudent[activeId]?.lessonResults ?? {} : {},
  );

  // Pre-compute the global index for every glyph so cell taps don't hit a Map
  // build during render.
  const indexByGlyph = useMemo(() => {
    const m = new Map<string, number>();
    all.forEach((l, i) => m.set(l.glyph + ':' + l.lessonId, i));
    return m;
  }, [all]);

  const openLetter = useCallback(
    (gi: number) =>
      phase === 6
        ? navigation.navigate('Trace', { language, phase, index: gi })
        : navigation.navigate('Letter', { language, phase, index: gi }),
    [navigation, language, phase],
  );
  const openQuiz = useCallback(
    (lessonId: string) =>
      navigation.navigate('Quiz', { language, phase, lessonId }),
    [navigation, language, phase],
  );

  const renderSection: ListRenderItem<LetterSection> = useCallback(
    ({ item: sec }) => {
      const seen = lettersSeen[`${language}:${sec.lessonId}`];
      const seenCount = seen ? Object.keys(seen).length : 0;
      const result = lessonResults[sec.lessonId];
      return (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              <Text style={styles.sectionMeta}>
                {seenCount} / {sec.letters.length}
                {result ? `  ·  ${result.medal} ${result.scorePct}%` : ''}
              </Text>
            </View>
            {phase !== 6 ? (
              <Pressable style={styles.quizPill} onPress={() => openQuiz(sec.lessonId)}>
                <Text style={styles.quizPillLabel}>Quiz</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.grid}>
            {sec.letters.map((letter) => {
              const gi = indexByGlyph.get(letter.glyph + ':' + sec.lessonId) ?? 0;
              const wasSeen = seen ? !!seen[letter.glyph] : false;
              return (
                <Pressable
                  key={letter.glyph + sec.lessonId + gi}
                  style={({ pressed }) => [
                    phase === 1 ? styles.cell : styles.cellWide,
                    wasSeen && styles.cellSeen,
                    pressed && { transform: [{ scale: 0.94 }] },
                  ]}
                  onPress={() => openLetter(gi)}
                >
                  <Text
                    style={phase === 1 ? styles.cellGlyph : styles.cellGlyphWord}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.4}
                    allowFontScaling={false}
                  >
                    {letter.glyph}
                  </Text>
                  <Text style={styles.cellName} numberOfLines={1}>{letter.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      );
    },
    [phase, language, lettersSeen, lessonResults, indexByGlyph, openLetter, openQuiz],
  );

  const heroCount = lessonId && sections[0] ? sections[0].letters.length : all.length;
  const ListHeader = useMemo(
    () => (
      <View style={styles.heroBlock}>
        <Text style={styles.heroLabel}>{meta.name.toUpperCase()}</Text>
        <Text style={styles.heroNative}>{meta.nativeName}</Text>
        <Text style={styles.heroSub}>{heroCount} {itemNoun} · tap any one</Text>
      </View>
    ),
    [meta.name, meta.nativeName, heroCount, itemNoun],
  );

  return (
    <ScreenBg>
      <FlatList
        data={sections}
        keyExtractor={(s) => s.lessonId}
        renderItem={renderSection}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.content}
        // Virtualisation tuning: render the first screenful synchronously,
        // then stream subsequent sections in as the user scrolls. Keeps the
        // PhaseList tap from blocking on rendering 100 lessons × N cells.
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        ItemSeparatorComponent={Spacer}
      />
    </ScreenBg>
  );
}

function Spacer() {
  return <View style={{ height: spacing.lg }} />;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  heroBlock: { alignItems: 'center', paddingVertical: spacing.md, gap: 4, marginBottom: spacing.lg },
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, rowGap: spacing.md },
  cell: {
    width: '23%',
    aspectRatio: 0.85,
    backgroundColor: colors.glassStrong,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.glassEdge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    minHeight: 96,
    ...e2,
  },
  cellWide: {
    width: '48%',
    minHeight: 120,
    backgroundColor: colors.glassStrong,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.glassEdge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 6,
    ...e2,
  },
  cellGlyphWord: { fontSize: 28, fontWeight: '900', color: colors.primary, textAlign: 'center', lineHeight: 34 },
  cellSeen: {
    borderColor: colors.grass,
    backgroundColor: 'rgba(123, 211, 137, 0.22)',
  },
  cellGlyph: { fontSize: 40, fontWeight: '900', color: colors.primary, lineHeight: 50, textAlign: 'center' },
  cellName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.inkSoft,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
