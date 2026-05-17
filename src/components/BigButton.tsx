import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { colors, radii, e1, e2, e3, brandGlow, spacing } from '@/theme';

interface Props {
  label: string;
  emoji?: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'glass';
}

export function BigButton({
  label,
  emoji,
  onPress,
  color = colors.primary,
  disabled,
  style,
  variant = 'primary',
}: Props) {
  const isGlass = variant === 'glass';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        isGlass ? styles.glass : { backgroundColor: disabled ? colors.inkMuted : color },
        isGlass ? null : brandGlow,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {/* Top highlight for glass shine */}
      <View pointerEvents="none" style={styles.shine} />
      <View style={styles.row}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <Text style={[styles.label, isGlass && { color: colors.ink }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 72,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  glass: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.glassEdge,
    ...e2,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: radii.pill,
    borderTopRightRadius: radii.pill,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 28 },
  label: { color: '#fff', fontSize: 22, fontWeight: '800' },
});
