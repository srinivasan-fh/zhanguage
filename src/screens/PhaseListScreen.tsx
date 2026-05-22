import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { PHASES } from '@/content/languages';
import { hasPhase } from '@/content';
import { Card } from '@/components/Card';
import { colors, spacing } from '@/theme';
import { ScreenBg } from '@/components/ScreenBg';

type Props = NativeStackScreenProps<RootStackParamList, 'PhaseList'>;

export function PhaseListScreen({ navigation, route }: Props) {
  const { language } = route.params;

  return (
    <ScreenBg>
    <FlatList
      data={PHASES}
      keyExtractor={(p) => String(p.id)}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item }) => {
        const available = hasPhase(language, item.id);
        return (
          <Card
            title={`Phase ${item.id}`}
            subtitle={item.title}
            emoji={item.emoji}
            locked={!available}
            onPress={() =>
              item.id === 10
                ? navigation.navigate('Certification', { language })
                : navigation.navigate('Alphabet', { language, phase: item.id })
            }
          />
        );
      }}
    />
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, flexGrow: 1 },
});
