import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectProfiles, selectWallet, selectTotalPointsFor } from '@/store/selectors';
import { deposit, setRate } from '@/store/slices/walletSlice';
import { BigButton } from '@/components/BigButton';
import { Avatar } from '@/components/Avatar';
import { colors, fontSizes, radii, shadow, spacing } from '@/theme';
import { ScreenBg } from '@/components/ScreenBg';

export function ParentDashboardScreen() {
  const profiles = useAppSelector(selectProfiles);
  const dispatch = useAppDispatch();

  const [selectedId, setSelectedId] = useState<string | null>(profiles[0]?.id ?? null);
  const wallet = useAppSelector(selectWallet(selectedId));
  const totalPoints = useAppSelector(selectTotalPointsFor(selectedId));

  const [amount, setAmount] = useState('');
  const [rate, setRateInput] = useState('');

  const onDeposit = () => {
    if (!selectedId) return;
    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents <= 0) {
      Alert.alert('Enter an amount');
      return;
    }
    dispatch(deposit({ studentId: selectedId, amountCents: cents }));
    setAmount('');
    Alert.alert('Top-up added', `${(cents / 100).toFixed(2)} added to wallet.`);
  };

  const onSetRate = () => {
    if (!selectedId) return;
    const cents = Math.round(Number(rate) * 100);
    if (!cents || cents <= 0) {
      Alert.alert('Enter a rate per point');
      return;
    }
    dispatch(setRate({ studentId: selectedId, rateCentsPerPoint: cents }));
    setRateInput('');
    Alert.alert('Rate updated');
  };

  return (
    <ScreenBg>
    <SafeAreaView style={styles.safe}>
      <Text style={styles.heading}>Choose a child</Text>
      <FlatList
        data={profiles}
        keyExtractor={(p) => p.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.md }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.profileTile,
              selectedId === item.id && { borderColor: colors.primary, borderWidth: 3 },
            ]}
            onTouchEnd={() => setSelectedId(item.id)}
          >
            <Avatar emoji={item.avatar} size={64} />
            <Text style={styles.profileName}>{item.name}</Text>
          </View>
        )}
      />

      {selectedId && wallet ? (
        <View style={{ gap: spacing.md }}>
          <View style={styles.summary}>
            <Stat label="Balance" value={(wallet.balanceCents / 100).toFixed(2)} />
            <Stat label="Rate / pt" value={(wallet.rateCentsPerPoint / 100).toFixed(2)} />
            <Stat label="Points" value={String(totalPoints)} />
          </View>

          <Text style={styles.heading}>Top up pocket money</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="Amount (e.g. 5.00)"
              placeholderTextColor={colors.inkSoft}
            />
            <BigButton label="Add" emoji="💰" onPress={onDeposit} style={{ paddingHorizontal: spacing.lg }} />
          </View>

          <Text style={styles.heading}>Set conversion rate</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRateInput}
              keyboardType="decimal-pad"
              placeholder="Money per point (e.g. 0.10)"
              placeholderTextColor={colors.inkSoft}
            />
            <BigButton label="Save" emoji="✅" onPress={onSetRate} style={{ paddingHorizontal: spacing.lg }} />
          </View>
        </View>
      ) : (
        <Text style={styles.empty}>Create a profile first.</Text>
      )}
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
  safe: { flex: 1, padding: spacing.lg, gap: spacing.md },
  heading: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink, letterSpacing: 0.2 },
  profileTile: {
    backgroundColor: colors.glassStrong,
    padding: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...shadow.card,
  },
  profileName: { fontWeight: '800', color: colors.ink },
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
  statValue: { fontSize: 24, fontWeight: '900', color: colors.ink },
  statLabel: { color: colors.inkSoft },
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: colors.glassStrong,
    padding: spacing.md,
    borderRadius: radii.md,
    fontSize: fontSizes.body,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.glassEdge,
  },
  empty: { color: colors.inkSoft, textAlign: 'center', padding: spacing.xl },
});
