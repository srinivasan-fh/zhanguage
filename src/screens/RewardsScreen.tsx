import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileStore } from '@/store/profileStore';
import { useProgressStore } from '@/store/progressStore';
import { useWalletStore } from '@/store/walletStore';
import { Medal } from '@/components/Medal';
import { LessonResult, MedalTier } from '@/types/profile';
import { colors, fontSizes, radii, shadow, spacing } from '@/theme';

const TIERS: MedalTier[] = ['emerald', 'diamond', 'gold', 'silver', 'bronze'];

export function RewardsScreen() {
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const byProfile = useProgressStore((s) => s.byProfile);
  const wallet = useWalletStore((s) =>
    activeProfileId ? s.byProfile[activeProfileId] : null,
  );

  const allResults: LessonResult[] = useMemo(() => {
    if (!activeProfileId) return [];
    const langs = byProfile[activeProfileId] ?? {};
    return Object.values(langs).flatMap((lang) => Object.values(lang ?? {}));
  }, [activeProfileId, byProfile]);

  const counts: Record<MedalTier, number> = {
    bronze: 0, silver: 0, gold: 0, diamond: 0, emerald: 0,
  };
  let totalPoints = 0;
  for (const r of allResults) {
    counts[r.medal] += 1;
    totalPoints += r.points;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.summary}>
        <Stat label="Total points" value={String(totalPoints)} />
        <Stat label="Wallet" value={wallet ? (wallet.balanceCents / 100).toFixed(2) : '—'} />
        <Stat label="Lessons" value={String(allResults.length)} />
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
        data={[...allResults].sort((a, b) => b.lastAt - a.lastAt).slice(0, 20)}
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
    <View style={styles.statBox}>
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
  statBox: { alignItems: 'center' },
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
