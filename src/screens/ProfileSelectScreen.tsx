import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectProfiles, selectCanAddProfile } from '@/store/selectors';
import { selectProfile } from '@/store/slices/profilesSlice';
import { Avatar } from '@/components/Avatar';
import { BigButton } from '@/components/BigButton';
import { ScreenBg } from '@/components/ScreenBg';
import { colors, spacing, fontSizes, radii, e1, e2, e3, brandGlow } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSelect'>;

export function ProfileSelectScreen({ navigation }: Props) {
  const profiles = useAppSelector(selectProfiles);
  const canAddProfile = useAppSelector(selectCanAddProfile);
  const dispatch = useAppDispatch();

  const onPick = (id: string) => {
    dispatch(selectProfile(id));
    navigation.replace('Home');
  };

  return (
    <ScreenBg>
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
          label={canAddProfile ? 'Add Player' : 'Max 3 players'}
          emoji="➕"
          disabled={!canAddProfile}
          onPress={() => navigation.navigate('CreateProfile')}
          style={{ marginTop: spacing.lg }}
        />
      </SafeAreaView>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: spacing.lg },
  hero: {
    fontSize: fontSizes.hero,
    fontWeight: '900',
    color: colors.ink,
    marginVertical: spacing.lg,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  grid: { gap: spacing.md, paddingBottom: spacing.lg },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.glassStrong,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    ...e2,
  },
  name: { fontSize: 22, fontWeight: '800', color: colors.ink },
  empty: { textAlign: 'center', color: colors.inkSoft, marginTop: spacing.xl, fontSize: 16 },
});
