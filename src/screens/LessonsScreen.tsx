import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { Card } from '@/components/Card';
import { LANGUAGES } from '@/content/languages';
import { getSections, type LetterSection } from '@/content/letters';
import { useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
import type { RootState } from '@/store';
import { colors, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Lessons'>;

const ITEM_EMOJI = ['📚','✨','🎯','🌟','🚀','🌈','🌸','🍀','🎈','🎀'];

export function LessonsScreen({ navigation, route }: Props) {
  const { language, phase } = route.params;
  const meta = LANGUAGES.find((l) => l.code === language)!;
  const sections = useMemo(() => getSections(language, phase), [language, phase]);

  const activeId = useAppSelector(selectActiveProfileId);
  const lettersSeen = useAppSelector((s: RootState) =>
    activeId ? s.points.byStudent[activeId]?.lettersSeen ?? {} : {},
  );
  const lessonResults = useAppSelector((s: RootState) =>
    activeId ? s.points.byStudent[activeId]?.lessonResults ?? {} : {},
  );

  const openLesson = useCallback(
    (lessonId: string) =>
      navigation.navigate('Alphabet', { language, phase, lessonId }),
    [navigation, language, phase],
  );

  const renderItem: ListRenderItem<LetterSection> = useCallback(
    ({ item: sec, index }) => {
      const seen = lettersSeen[`${language}:${sec.lessonId}`];
      const seenCount = seen ? Object.keys(seen).length : 0;
      const total = sec.letters.length;
      const result = lessonResults[sec.lessonId];
      const subtitle = result
        ? `${seenCount} / ${total} · ${result.medal.toUpperCase()} ${result.scorePct}%`
        : `${seenCount} / ${total}`;
      return (
        <Card
          title={`${index + 1}. ${sec.title}`}
          subtitle={subtitle}
          emoji={ITEM_EMOJI[index % ITEM_EMOJI.length]}
          onPress={() => openLesson(sec.lessonId)}
        />
      );
    },
    [language, lettersSeen, lessonResults, openLesson],
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.heroBlock}>
        <Text style={styles.heroLabel}>{meta.name.toUpperCase()}  ·  PHASE {phase}</Text>
        <Text style={styles.heroNative}>{meta.nativeName}</Text>
        <Text style={styles.heroSub}>{sections.length} lessons · pick one</Text>
      </View>
    ),
    [meta.name, meta.nativeName, phase, sections.length],
  );

  return (
    <ScreenBg>
      <FlatList
        data={sections}
        keyExtractor={(s) => s.lessonId}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={Spacer}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
      />
    </ScreenBg>
  );
}

function Spacer() {
  return <View style={{ height: spacing.md }} />;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  heroBlock: { alignItems: 'center', paddingVertical: spacing.md, gap: 4, marginBottom: spacing.lg },
  heroLabel: { fontSize: 13, letterSpacing: 4, fontWeight: '800', color: colors.inkMuted },
  heroNative: { fontSize: 42, fontWeight: '900', color: colors.ink, lineHeight: 50 },
  heroSub: { fontSize: 13, color: colors.inkSoft, marginTop: 4 },
});
