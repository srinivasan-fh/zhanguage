import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { getPhasePack } from '@/content';
import { useProfileStore } from '@/store/profileStore';
import { useProgressStore } from '@/store/progressStore';
import { Card } from '@/components/Card';
import { colors, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LessonList'>;

export function LessonListScreen({ navigation, route }: Props) {
  const { language, phase } = route.params;
  const pack = getPhasePack(language, phase);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const getResult = useProgressStore((s) => s.getResult);

  if (!pack) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>This phase isn't ready yet. Coming soon! ✨</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pack.lessons}
      keyExtractor={(l) => l.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListHeaderComponent={
        <Text style={styles.heading}>{pack.title}</Text>
      }
      renderItem={({ item }) => {
        const r = activeProfileId ? getResult(activeProfileId, language, item.id) : undefined;
        const subtitle = r
          ? `Best: ${r.scorePct}% • ${r.medal.toUpperCase()}`
          : `${item.items?.length ?? 0} items • ${item.quiz?.length ?? 0} questions`;
        return (
          <Card
            title={item.title}
            subtitle={subtitle}
            emoji={r ? medalEmoji(r.medal) : '📚'}
            onPress={() =>
              navigation.navigate('Lesson', { language, phase, lessonId: item.id })
            }
          />
        );
      }}
    />
  );
}

function medalEmoji(tier: string): string {
  switch (tier) {
    case 'emerald': return '💚';
    case 'diamond': return '💎';
    case 'gold':    return '🥇';
    case 'silver':  return '🥈';
    default:        return '🥉';
  }
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, backgroundColor: colors.cream, flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: '900', color: colors.ink, marginBottom: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.cream },
  emptyText: { fontSize: 20, color: colors.inkSoft, textAlign: 'center' },
});
