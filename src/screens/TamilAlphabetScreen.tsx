import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { TAMIL_LETTERS, TAMIL_SECTIONS } from '@/content/ta/letters';
import { colors, radii, spacing, e2 } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TamilAlphabet'>;

export function TamilAlphabetScreen({ navigation }: Props) {
  const openLetter = (globalIndex: number) =>
    navigation.navigate('TamilLetter', { index: globalIndex });

  // Map glyph → global index in TAMIL_LETTERS for quick lookup.
  const indexByGlyph = React.useMemo(() => {
    const m = new Map<string, number>();
    TAMIL_LETTERS.forEach((l, i) => m.set(l.glyph + ':' + l.lessonId, i));
    return m;
  }, []);

  return (
    <ScreenBg>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBlock}>
          <Text style={styles.heroLabel}>TAMIL</Text>
          <Text style={styles.heroNative}>தமிழ்</Text>
          <Text style={styles.heroSub}>{TAMIL_LETTERS.length} letters · tap any letter</Text>
        </View>

        {TAMIL_SECTIONS.map((sec) => (
          <View key={sec.lessonId} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            <View style={styles.grid}>
              {sec.letters.map((letter) => {
                const gi = indexByGlyph.get(letter.glyph + ':' + sec.lessonId) ?? 0;
                return (
                  <Pressable
                    key={letter.glyph + sec.lessonId}
                    style={({ pressed }) => [
                      styles.cell,
                      pressed && { transform: [{ scale: 0.94 }] },
                    ]}
                    onPress={() => openLetter(gi)}
                  >
                    <Text style={styles.cellGlyph} numberOfLines={1}>{letter.glyph}</Text>
                    <Text style={styles.cellName} numberOfLines={1}>{letter.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
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
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.inkSoft, letterSpacing: 0.3 },
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
  cellGlyph: { fontSize: 28, fontWeight: '900', color: colors.primary, lineHeight: 36 },
  cellName: { fontSize: 10, fontWeight: '700', color: colors.inkSoft, marginTop: 2, textTransform: 'uppercase' },
});
