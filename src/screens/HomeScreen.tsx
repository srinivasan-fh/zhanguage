import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { PRIMARY_LANGUAGES, SECONDARY_LANGUAGES } from '@/content/languages';
import { useAppSelector } from '@/store/hooks';
import { selectActiveProfile, selectActiveProfileId, selectWallet, selectTotalPointsFor } from '@/store/selectors';
import { Avatar } from '@/components/Avatar';
import { ScreenBg } from '@/components/ScreenBg';
import { colors, fontSizes, radii, e2, e3, spacing } from '@/theme';
import type { LanguageMeta } from '@/types/content';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const profile = useAppSelector(selectActiveProfile);
  const activeId = useAppSelector(selectActiveProfileId);
  const wallet = useAppSelector(selectWallet(activeId));
  const totalPoints = useAppSelector(selectTotalPointsFor(activeId));

  const openLang = (item: LanguageMeta) =>
    navigation.navigate('Alphabet', { language: item.code });

  return (
    <ScreenBg>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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

        <View style={styles.primaryGrid}>
          {PRIMARY_LANGUAGES.map((item) => (
            <Pressable
              key={item.code}
              style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.97 }] }]}
              onPress={() => openLang(item)}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={styles.native}>{item.nativeName}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerLabel}>More languages</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.secondaryGrid}>
          {SECONDARY_LANGUAGES.map((item) => (
            <Pressable
              key={item.code}
              style={({ pressed }) => [
                styles.secondaryTile,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
              onPress={() => openLang(item)}
            >
              <Text style={styles.secondaryFlag}>{item.flag}</Text>
              <Text style={styles.secondaryNative} numberOfLines={1}>{item.nativeName}</Text>
              <Text style={styles.secondaryName} numberOfLines={1}>{item.name}</Text>
            </Pressable>
          ))}
        </View>

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
      </ScrollView>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.glassStrong,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...e2,
  },
  hi: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { color: colors.inkSoft, fontSize: 13 },
  wallet: { alignItems: 'flex-end' },
  walletAmount: { fontSize: 20, fontWeight: '800', color: colors.primary },
  walletLabel: { fontSize: 12, color: colors.inkSoft },
  heading: {
    fontSize: fontSizes.title,
    fontWeight: '900',
    color: colors.ink,
    marginTop: spacing.sm,
    letterSpacing: 0.2,
  },

  // Primary grid — 2 columns, big tiles.
  primaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  tile: {
    width: '48%',
    backgroundColor: colors.glassStrong,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...e2,
  },
  flag: { fontSize: 56 },
  native: { fontSize: 22, fontWeight: '800', color: colors.ink },
  name: { fontSize: 14, color: colors.inkSoft },

  // Divider between primary and secondary blocks.
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.hairline },
  dividerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.inkMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Secondary grid — 3 columns, smaller compact tiles.
  secondaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  secondaryTile: {
    width: '31.5%',
    backgroundColor: colors.glass,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...e2,
  },
  secondaryFlag: { fontSize: 32 },
  secondaryNative: { fontSize: 15, fontWeight: '800', color: colors.ink },
  secondaryName: { fontSize: 11, color: colors.inkSoft },

  footerRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  footerBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    ...e3,
  },
  footerEmoji: { fontSize: 32 },
  footerLabel: { color: '#fff', fontWeight: '800', fontSize: 18, marginTop: 4 },
});
