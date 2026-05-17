import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, shadow } from '@/theme';

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
      <Text style={{ fontSize: size * 0.6 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.sun,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
});
