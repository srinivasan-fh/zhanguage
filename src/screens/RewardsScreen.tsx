import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';
import {
  selectActiveProfileId,
  selectTotalPointsFor,
  selectWallet,
} from '@/store/selectors';
import type { RootState } from '@/store';
import { Medal } from '@/components/Medal';
import { MedalTier } from '@/types/profile';
import { colors, fontSizes, radii, shadow, spacing } from '@/theme';
import { ScreenBg } from '@/components/ScreenBg';

const TIERS: MedalTier[] = ['emerald', 'diamond', 'gold', 'silver', 'bronze'];

export function RewardsScreen() {
  const activeId = useAppSelector(selectActiveProfileId);
  const lessonResultsMap = useAppSelector((s: RootState) =>
    activeId ? s.points.byStudent[activeId]?.lessonResults ?? {} : {},
  );
  const results = useMemo(() => Object.values(lessonResultsMap), [lessonResultsMap]);
  const totalPoints = useAppSelector(selectTotalPointsFor(activeId));
  const wallet = useAppSelector(selectWallet(activeId));

  const counts: Record<MedalTier, number> = useMemo(() => {
    const c: Record<MedalTier, number> = { bronze: 0, silver: 0, gold: 0, diamond: 0, emerald: 0 };
    results.forEach((r) => { c[r.medal] += 1; });
    return c;
  }, [results]);

  return (
    <ScreenBg>
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
    </ScreenBg>
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
  safe: { flex: 1, padding: spacing.lg },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.glassStrong,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...shadow.card,
  },
  statValue: { fontSize: 28, fontWeight: '900', color: colors.ink },
  statLabel: { color: colors.inkSoft },
  heading: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, marginTop: spacing.lg, letterSpacing: 0.2 },
  medalsRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  medalBox: { alignItems: 'center', gap: 4 },
  count: { fontWeight: '800', color: colors.ink },
  row: { backgroundColor: colors.glassStrong, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.glassEdge, ...shadow.card },
  rowTitle: { fontWeight: '800', color: colors.ink },
  rowMeta: { color: colors.inkSoft, marginTop: 2 },
  empty: { textAlign: 'center', color: colors.inkSoft, padding: spacing.xl },
});
