import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, shadow, spacing } from '@/theme';

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
      {emoji ? <Text style={styles.emoji}>{locked ? '🔒' : emoji}</Text> : null}
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
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 96,
    ...shadow.card,
  },
  locked: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.98 }] },
  emoji: { fontSize: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 15, color: colors.inkSoft, marginTop: 4 },
});
