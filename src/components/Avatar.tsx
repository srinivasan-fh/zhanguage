import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, elevation } from '@/theme';

export const AVATAR_CHOICES = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐵', '🦉', '🐧', '🦄', '🐶'];

interface Props {
  emoji: string;
  size?: number;
}

export function Avatar({ emoji, size = 96 }: Props) {
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        pointerEvents="none"
        style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
      />
      <Text style={{ fontSize: size * 0.58 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.sun,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...elevation.e3,
  },
  ring: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
  },
});
