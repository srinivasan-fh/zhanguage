import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MedalTier } from '@/types/profile';
import { colors, shadow } from '@/theme';

const TIER_COLOR: Record<MedalTier, string> = {
  bronze: colors.bronze,
  silver: colors.silver,
  gold: colors.gold,
  diamond: colors.diamond,
  emerald: colors.emerald,
};

const TIER_LABEL: Record<MedalTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  diamond: 'Diamond',
  emerald: 'Emerald',
};

interface Props {
  tier: MedalTier;
  size?: number;
}

export function Medal({ tier, size = 80 }: Props) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <View
        style={[
          styles.disc,
          {
            backgroundColor: TIER_COLOR[tier],
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.5 }}>🏅</Text>
      </View>
      <Text style={styles.label}>{TIER_LABEL[tier]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  disc: { alignItems: 'center', justifyContent: 'center', ...shadow.card },
  label: { fontWeight: '700', color: colors.ink },
});
