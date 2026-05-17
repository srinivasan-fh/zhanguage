import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';
import {
  selectActiveProfileId,
  selectStudentLessonResults,
  selectTotalPointsFor,
  selectWallet,
} from '@/store/selectors';
import { Medal } from '@/components/Medal';
import { MedalTier } from '@/types/profile';
import { colors, fontSizes, radii, shadow, spacing } from '@/theme';

const TIERS: MedalTier[] = ['emerald', 'diamond', 'gold', 'silver', 'bronze'];

export function RewardsScreen() {
  const activeId = useAppSelector(selectActiveProfileId);
  const results = useAppSelector(selectStudentLessonResults(activeId));
  const totalPoints = useAppSelector(selectTotalPointsFor(activeId));
  const wallet = useAppSelector(selectWallet(activeId));

  const counts: Record<MedalTier, number> = useMemo(() => {
    const c: Record<MedalTier, number> = { bronze: 0, silver: 0, gold: 0, diamond: 0, emerald: 0 };
    results.forEach((r) => { c[r.medal] += 1; });
    return c;
  }, [results]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.summary}>
        <Stat label="Total points" value={String(totalPoints)} />
        <Stat label="Wallet" value={wallet ? (wallet.balanceCents / 100).toFixed(2) : '—'} />
        <Stat label="Lessons" value={String(results.length)} />
      </View>

      <Text style={styles.heading}>Medals</Text>
      <View style={styles.medalsRow}>
        {TIERS.map((t) => (
          <View key={t} style={styles.medalBox}>
            <Medal tier={t} size={64} />
            <Text style={styles.count}>× {counts[t]}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.heading}>Recent lessons</Text>
      <FlatList
        data={[...results].sort((a, b) => b.lastAt - a.lastAt).slice(0, 20)}
        keyExtractor={(r) => r.lessonId + r.lastAt}
        contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.lessonId}</Text>
            <Text style={styles.rowMeta}>
              {item.scorePct}% • {item.medal} • +{item.points}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Complete a lesson to start collecting medals.</Text>
        }
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream, padding: spacing.lg },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.paper,
    padding: spacing.lg,
    borderRadius: radii.lg,
    ...shadow.card,
  },
  statValue: { fontSize: 28, fontWeight: '900', color: colors.ink },
  statLabel: { color: colors.inkSoft },
  heading: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, marginTop: spacing.lg },
  medalsRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  medalBox: { alignItems: 'center', gap: 4 },
  count: { fontWeight: '800', color: colors.ink },
  row: { backgroundColor: colors.paper, padding: spacing.md, borderRadius: radii.md, ...shadow.card },
  rowTitle: { fontWeight: '800', color: colors.ink },
  rowMeta: { color: colors.inkSoft, marginTop: 2 },
  empty: { textAlign: 'center', color: colors.inkSoft, padding: spacing.xl },
});
