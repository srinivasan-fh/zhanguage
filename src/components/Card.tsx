import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, e1, e2, e3, brandGlow, spacing } from '@/theme';

interface Props {
  title: string;
  subtitle?: string;
  emoji?: string;
  onPress?: () => void;
  locked?: boolean;
  rightSlot?: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ title, subtitle, emoji, onPress, locked, rightSlot, style }: Props) {
  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      style={({ pressed }) => [
        styles.card,
        locked && styles.locked,
        pressed && !locked && styles.pressed,
        style,
      ]}
    >
      {emoji ? (
        <View style={styles.emojiBubble}>
          <Text style={styles.emoji}>{locked ? '🔒' : emoji}</Text>
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightSlot}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glassStrong,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 96,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    // overflow:hidden + elevation causes a soft inner ring on Android — drop it.
    ...e2,
  },
  locked: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.985 }] },
  emojiBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: 'rgba(255,122,89,0.18)',
  },
  emoji: { fontSize: 30 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink, letterSpacing: 0.2 },
  subtitle: { fontSize: 15, color: colors.inkSoft, marginTop: 4 },
});
