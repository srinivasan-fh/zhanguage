import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { BigButton } from '@/components/BigButton';
import { colors, fontSizes, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ParentGate'>;

function makeQuestion(): { text: string; answer: number } {
  const a = 6 + Math.floor(Math.random() * 8);
  const b = 6 + Math.floor(Math.random() * 8);
  return { text: `${a} × ${b}`, answer: a * b };
}

export function ParentGateScreen({ navigation }: Props) {
  const question = useMemo(makeQuestion, []);
  const [input, setInput] = useState('');

  const onSubmit = () => {
    if (Number(input) === question.answer) {
      navigation.replace('ParentDashboard');
    } else {
      Alert.alert('Not quite', 'Ask a grown-up to try again.');
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parents only 👋</Text>
      <Text style={styles.subtitle}>Solve this to continue:</Text>
      <Text style={styles.question}>{question.text} = ?</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        keyboardType="number-pad"
        placeholder="answer"
        placeholderTextColor={colors.inkSoft}
        autoFocus
      />
      <BigButton label="Unlock" emoji="🔓" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.lg, backgroundColor: colors.cream },
  title: { fontSize: fontSizes.hero, fontWeight: '900', color: colors.ink },
  subtitle: { fontSize: fontSizes.body, color: colors.inkSoft },
  question: { fontSize: 56, fontWeight: '900', color: colors.primary, textAlign: 'center', marginVertical: spacing.xl },
  input: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    padding: spacing.lg,
    fontSize: 28,
    textAlign: 'center',
    color: colors.ink,
  },
});
