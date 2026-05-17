import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { medalFor } from '@/store/progressStore';
import { Medal } from '@/components/Medal';
import { BigButton } from '@/components/BigButton';
import { colors, fontSizes, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonComplete'>;

export function LessonCompleteScreen({ navigation, route }: Props) {
  const { scorePct, pointsEarned, moneyEarnedCents } = route.params;
  const { tier } = medalFor(scorePct);

  return (
    <View style={styles.container}>
      <Text style={styles.cheer}>Great job! 🎉</Text>
      <Medal tier={tier} size={140} />
      <Text style={styles.score}>{scorePct}%</Text>
      <View style={styles.stats}>
        <Stat label="Points" value={`+${pointsEarned}`} />
        <Stat label="Earned" value={`${(moneyEarnedCents / 100).toFixed(2)}`} />
      </View>
      <BigButton label="Done" emoji="✅" onPress={() => navigation.popToTop()} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  cheer: { fontSize: fontSizes.hero, fontWeight: '900', color: colors.primary },
  score: { fontSize: 56, fontWeight: '900', color: colors.ink },
  stats: { flexDirection: 'row', gap: spacing.lg },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: '900', color: colors.ink },
  statLabel: { color: colors.inkSoft },
});
