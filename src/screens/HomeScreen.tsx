import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { LANGUAGES } from '@/content/languages';
import { useAppSelector } from '@/store/hooks';
import { selectActiveProfile, selectActiveProfileId, selectWallet, selectTotalPointsFor } from '@/store/selectors';
import { Avatar } from '@/components/Avatar';
import { ScreenBg } from '@/components/ScreenBg';
import { colors, fontSizes, radii, elevation, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const profile = useAppSelector(selectActiveProfile);
  const activeId = useAppSelector(selectActiveProfileId);
  const wallet = useAppSelector(selectWallet(activeId));
  const totalPoints = useAppSelector(selectTotalPointsFor(activeId));

  return (
    <ScreenBg>
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => navigation.navigate('ProfileSelect')}>
        {profile ? <Avatar emoji={profile.avatar} size={56} /> : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.hi}>Hi, {profile?.name ?? 'friend'}!</Text>
          <Text style={styles.sub}>{totalPoints} points • tap to switch</Text>
        </View>
        <View style={styles.wallet}>
          <Text style={styles.walletAmount}>
            {wallet ? (wallet.balanceCents / 100).toFixed(2) : '—'}
          </Text>
          <Text style={styles.walletLabel}>wallet</Text>
        </View>
      </Pressable>

      <Text style={styles.heading}>Pick a language</Text>

      <FlatList
        data={LANGUAGES}
        keyExtractor={(l) => l.code}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.md }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.97 }] }]}
            onPress={() => navigation.navigate('PhaseList', { language: item.code })}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.native}>{item.nativeName}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
        ListFooterComponent={
          <View style={styles.footerRow}>
            <Pressable style={styles.footerBtn} onPress={() => navigation.navigate('Rewards')}>
              <Text style={styles.footerEmoji}>🏆</Text>
              <Text style={styles.footerLabel}>Rewards</Text>
            </Pressable>
            <Pressable style={styles.footerBtn} onPress={() => navigation.navigate('ParentGate')}>
              <Text style={styles.footerEmoji}>👨‍👩‍👧</Text>
              <Text style={styles.footerLabel}>Parents</Text>
            </Pressable>
          </View>
        }
      />
    </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.glassStrong,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...elevation.e2,
  },
  hi: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { color: colors.inkSoft, fontSize: 13 },
  wallet: { alignItems: 'flex-end' },
  walletAmount: { fontSize: 20, fontWeight: '800', color: colors.primary },
  walletLabel: { fontSize: 12, color: colors.inkSoft },
  heading: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, marginTop: spacing.sm, letterSpacing: 0.2 },
  tile: {
    flex: 1,
    backgroundColor: colors.glassStrong,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...elevation.e2,
  },
  flag: { fontSize: 56 },
  native: { fontSize: 22, fontWeight: '800', color: colors.ink },
  name: { fontSize: 14, color: colors.inkSoft },
  footerRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  footerBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    ...elevation.e3,
  },
  footerEmoji: { fontSize: 32 },
  footerLabel: { color: '#fff', fontWeight: '800', fontSize: 18, marginTop: 4 },
});
