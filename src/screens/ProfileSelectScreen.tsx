import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { useProfileStore, MAX_PROFILE_COUNT } from '@/store/profileStore';
import { Avatar } from '@/components/Avatar';
import { BigButton } from '@/components/BigButton';
import { colors, spacing, fontSizes } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSelect'>;

export function ProfileSelectScreen({ navigation }: Props) {
  const { profiles, switchProfile, canAddProfile } = useProfileStore();

  const onPick = async (id: string) => {
    await switchProfile(id);
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.hero}>Who's learning today?</Text>
      <FlatList
        data={profiles}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: spacing.md }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <Pressable style={styles.tile} onPress={() => onPick(item.id)}>
            <Avatar emoji={item.avatar} size={110} />
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No players yet. Tap below to create one.</Text>
        }
      />
      <BigButton
        label={canAddProfile() ? 'Add Player' : `Max ${MAX_PROFILE_COUNT} players`}
        emoji="➕"
        disabled={!canAddProfile()}
        onPress={() => navigation.navigate('CreateProfile')}
        style={{ marginTop: spacing.lg }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream, padding: spacing.lg },
  hero: {
    fontSize: fontSizes.hero,
    fontWeight: '900',
    color: colors.ink,
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
  grid: { gap: spacing.md, paddingBottom: spacing.lg },
  tile: { flex: 1, alignItems: 'center', gap: spacing.sm },
  name: { fontSize: 22, fontWeight: '800', color: colors.ink },
  empty: { textAlign: 'center', color: colors.inkSoft, marginTop: spacing.xl },
});
