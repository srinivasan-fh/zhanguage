import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { LANGUAGES } from '@/content/languages';
import { getLetters, getSections } from '@/content/letters';
import { colors, radii, spacing, e2 } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Alphabet'>;

export function AlphabetScreen({ navigation, route }: Props) {
  const { language } = route.params;
  const meta = LANGUAGES.find((l) => l.code === language)!;
  const all = useMemo(() => getLetters(language), [language]);
  const sections = useMemo(() => getSections(language), [language]);

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
          <Text style={styles.heroSub}>
            {all.length} letters · tap any letter
          </Text>
        </View>

        {sections.map((sec) => (
          <View key={sec.lessonId} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            <View style={styles.grid}>
              {sec.letters.map((letter) => {
                const gi = indexByGlyph.get(letter.glyph + ':' + sec.lessonId) ?? 0;
                return (
                  <Pressable
                    key={letter.glyph + sec.lessonId + gi}
                    style={({ pressed }) => [
                      styles.cell,
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
  cellGlyph: { fontSize: 26, fontWeight: '900', color: colors.primary, lineHeight: 34 },
  cellName: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.inkSoft,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
