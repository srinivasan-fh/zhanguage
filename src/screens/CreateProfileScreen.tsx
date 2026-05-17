import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useProfileStore } from '@/store/profileStore';
import { Avatar, AVATAR_CHOICES } from '@/components/Avatar';
import { BigButton } from '@/components/BigButton';
import { colors, fontSizes, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProfile'>;

export function CreateProfileScreen({ navigation }: Props) {
  const createProfile = useProfileStore((s) => s.createProfile);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_CHOICES[0]);

  const onCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please type a name first.');
      return;
    }
    await createProfile({ name: name.trim(), age: age ? Number(age) : undefined, avatar });
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Avatar emoji={avatar} size={120} />
      </View>

      <Text style={styles.label}>Pick an avatar</Text>
      <FlatList
        data={AVATAR_CHOICES}
        keyExtractor={(e) => e}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setAvatar(item)}
            style={[styles.avatarPick, avatar === item && styles.avatarActive]}
          >
            <Text style={{ fontSize: 36 }}>{item}</Text>
          </Pressable>
        )}
      />

      <Text style={styles.label}>Your name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Aanya"
        placeholderTextColor={colors.inkSoft}
        maxLength={24}
      />

      <Text style={styles.label}>Age (optional)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="e.g. 7"
        placeholderTextColor={colors.inkSoft}
        maxLength={2}
      />

      <BigButton label="Start Learning" emoji="🚀" onPress={onCreate} style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  label: { fontSize: fontSizes.body, fontWeight: '700', color: colors.ink, marginTop: spacing.md },
  input: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: fontSizes.body,
    color: colors.ink,
  },
  avatarPick: {
    backgroundColor: colors.paper,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActive: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
});
