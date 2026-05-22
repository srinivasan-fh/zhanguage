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
  const { language, phase = 1 } = route.params;
  const meta = LANGUAGES.find((l) => l.code === language)!;
  const all = useMemo(() => getLetters(language, phase), [language, phase]);
  const sections = useMemo(() => getSections(language, phase), [language, phase]);
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
          <Text style={styles.heroSub}>{all.length} {itemNoun} · tap any one</Text>
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
                {phase !== 6 ? (
                  <Pressable
                    style={styles.quizPill}
                    onPress={() => navigation.navigate('Quiz', { language, phase, lessonId: sec.lessonId })}
                  >
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
                      onPress={() =>
                        phase === 6
                          ? navigation.navigate('Trace', { language, phase, index: gi })
                          : navigation.navigate('Letter', { language, phase, index: gi })
                      }
                    >
                      <Text
                        style={phase === 1 ? styles.cellGlyph : styles.cellGlyphWord}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.6}
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
  cellWide: {
    width: '31.5%',
    minHeight: 84,
    backgroundColor: colors.glassStrong,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    ...e2,
  },
  cellGlyphWord: { fontSize: 18, fontWeight: '900', color: colors.primary, textAlign: 'center' },
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
