import React, { useMemo } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { PHASES, LANGUAGES } from '@/content/languages';
import { hasPhase } from '@/content';
import { Card } from '@/components/Card';
import { colors, spacing } from '@/theme';
import { ScreenBg } from '@/components/ScreenBg';

type Props = NativeStackScreenProps<RootStackParamList, 'PhaseList'>;

export function PhaseListScreen({ navigation, route }: Props) {
  const { language } = route.params;
  const meta = LANGUAGES.find((l) => l.code === language)!;

  const ListHeader = useMemo(
    () => (
      <View style={styles.heroBlock}>
        <Text style={styles.heroLabel}>{meta.name.toUpperCase()}</Text>
        <Text style={styles.heroNative}>{meta.nativeName}</Text>
        <Text style={styles.heroSub}>{PHASES.length} phases · pick one</Text>
      </View>
    ),
    [meta.name, meta.nativeName],
  );

  return (
    <ScreenBg>
      <FlatList
        data={PHASES}
        keyExtractor={(p) => String(p.id)}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => {
          const available = hasPhase(language, item.id);
          return (
            <Card
              title={`Phase ${item.id}`}
              subtitle={item.title}
              badge={`P${item.id}`}
              locked={!available}
              onPress={() =>
                item.id === 10
                  ? navigation.navigate('Certification', { language })
                  : navigation.navigate('Lessons', { language, phase: item.id })
              }
            />
          );
        }}
      />
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  heroBlock: { alignItems: 'center', paddingVertical: spacing.md, gap: 4, marginBottom: spacing.lg },
  heroLabel: { fontSize: 13, letterSpacing: 4, fontWeight: '800', color: colors.inkMuted },
  heroNative: { fontSize: 42, fontWeight: '900', color: colors.ink, lineHeight: 50 },
  heroSub: { fontSize: 13, color: colors.inkSoft, marginTop: 4 },
});
