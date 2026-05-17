import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileStore } from '@/store/profileStore';
import { useWalletStore } from '@/store/walletStore';
import { BigButton } from '@/components/BigButton';
import { Avatar } from '@/components/Avatar';
import { colors, fontSizes, radii, shadow, spacing } from '@/theme';

export function ParentDashboardScreen() {
  const profiles = useProfileStore((s) => s.profiles);
  const byProfile = useWalletStore((s) => s.byProfile);
  const deposit = useWalletStore((s) => s.deposit);
  const setRate = useWalletStore((s) => s.setRate);

  const [selectedId, setSelectedId] = useState<string | null>(profiles[0]?.id ?? null);
  const [amount, setAmount] = useState('');
  const [rate, setRateInput] = useState('');

  const wallet = selectedId ? byProfile[selectedId] : undefined;

  const onDeposit = async () => {
    if (!selectedId) return;
    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents <= 0) {
      Alert.alert('Enter an amount');
      return;
    }
    await deposit(selectedId, cents);
    setAmount('');
    Alert.alert('Top-up added', `${(cents / 100).toFixed(2)} added to wallet.`);
  };

  const onSetRate = async () => {
    if (!selectedId) return;
    const cents = Math.round(Number(rate) * 100);
    if (!cents || cents <= 0) {
      Alert.alert('Enter a rate per point');
      return;
    }
    await setRate(selectedId, cents);
    setRateInput('');
    Alert.alert('Rate updated');
  };

  return (
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
            <Stat label="Entries" value={String(wallet.ledger.length)} />
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
  safe: { flex: 1, backgroundColor: colors.cream, padding: spacing.lg, gap: spacing.md },
  heading: { fontSize: fontSizes.title, fontWeight: '900', color: colors.ink },
  profileTile: {
    backgroundColor: colors.paper,
    padding: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 100,
    ...shadow.card,
  },
  profileName: { fontWeight: '800', color: colors.ink },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.paper,
    padding: spacing.lg,
    borderRadius: radii.lg,
    ...shadow.card,
  },
  statValue: { fontSize: 24, fontWeight: '900', color: colors.ink },
  statLabel: { color: colors.inkSoft },
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: spacing.md,
    borderRadius: radii.md,
    fontSize: fontSizes.body,
    color: colors.ink,
  },
  empty: { color: colors.inkSoft, textAlign: 'center', padding: spacing.xl },
});
