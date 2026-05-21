import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { getLetters } from '@/content/letters';
import { colors, radii, spacing, e3 } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Letter'>;

const SWIPE_THRESHOLD = 60;

function tap() {
  ReactNativeHapticFeedback.trigger('impactLight', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
}

export function LetterScreen({ navigation, route }: Props) {
  const { language } = route.params;
  const letters = useMemo(() => getLetters(language), [language]);
  const [index, setIndex] = useState(route.params.index);

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i >= letters.length - 1) return i;
      tap();
      return i + 1;
    });
  }, [letters.length]);
  const goPrev = useCallback(() => {
    setIndex((i) => {
      if (i <= 0) return i;
      tap();
      return i - 1;
    });
  }, []);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, g) =>
        Math.abs(g.dx) > 12 || Math.abs(g.dy) > 12,
      onPanResponderRelease: (_evt, g) => {
        const absX = Math.abs(g.dx);
        const absY = Math.abs(g.dy);
        if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;
        if (absY > absX) {
          if (g.dy > 0) goNext();
          else goPrev();
        } else if (g.dx < 0) {
          goBack();
        }
      },
    }),
  ).current;

  if (letters.length === 0) {
    return (
      <ScreenBg>
        <View style={styles.container}>
          <Text style={styles.example}>No letters available.</Text>
        </View>
      </ScreenBg>
    );
  }

  const letter = letters[index];

  return (
    <ScreenBg>
      <View style={styles.container} {...responder.panHandlers}>
        <Text style={styles.position}>{index + 1} / {letters.length}</Text>

        <View style={styles.glyphCard}>
          <Text
            style={styles.glyph}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
          >
            {letter.glyph}
          </Text>
        </View>

        <Text style={styles.name}>{letter.name}</Text>
        {letter.exampleWord ? (
          <Text style={styles.example}>{letter.exampleWord}</Text>
        ) : null}

        <Text style={styles.sectionLabel}>{letter.lessonTitle}</Text>

        <View style={styles.hints}>
          <Hint emoji="⬇️" label="Swipe down · next" />
          <Hint emoji="⬆️" label="Swipe up · previous" />
          <Hint emoji="⬅️" label="Swipe left · back" />
        </View>
      </View>
    </ScreenBg>
  );
}

function Hint({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.hintRow}>
      <Text style={styles.hintEmoji}>{emoji}</Text>
      <Text style={styles.hintLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  position: { fontSize: 14, color: colors.inkMuted, fontWeight: '700', letterSpacing: 2 },
  glyphCard: {
    width: 240,
    height: 240,
    borderRadius: radii.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    ...e3,
  },
  glyph: {
    fontSize: 140,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  name: { fontSize: 32, fontWeight: '900', color: colors.ink, letterSpacing: 0.6, textTransform: 'uppercase' },
  example: { fontSize: 22, color: colors.inkSoft, fontWeight: '700' },
  sectionLabel: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.sm, textAlign: 'center' },
  hints: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassEdge,
  },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hintEmoji: { fontSize: 18 },
  hintLabel: { fontSize: 14, color: colors.inkSoft, fontWeight: '700' },
});
