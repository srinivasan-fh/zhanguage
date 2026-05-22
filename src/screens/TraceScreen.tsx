import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RootStackParamList } from '@/navigation/types';
import { ScreenBg } from '@/components/ScreenBg';
import { getLetters } from '@/content/letters';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveProfileId } from '@/store/selectors';
import { markLetterSeen } from '@/store/slices/pointsSlice';
import { getPhasePack } from '@/content';
import { colors, radii, spacing, e3 } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Trace'>;

const CANVAS = 320;
const STROKE = 8;

interface Stroke { d: string }

export function TraceScreen({ navigation, route }: Props) {
  const { language, phase = 6 } = route.params;
  const letters = useMemo(() => getLetters(language, phase), [language, phase]);
  const pack = useMemo(() => getPhasePack(language, phase), [language, phase]);
  const lessonSize = useMemo(() => {
    const m = new Map<string, number>();
    pack?.lessons.forEach((l) => m.set(l.id, l.items?.length ?? 0));
    return m;
  }, [pack]);
  const dispatch = useAppDispatch();
  const activeId = useAppSelector(selectActiveProfileId);

  const [index, setIndex] = useState(route.params.index);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const current = useRef<string>('');

  const letter = letters[index];

  const clear = useCallback(() => {
    setStrokes([]);
    current.current = '';
  }, []);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        current.current = `M${x.toFixed(1)} ${y.toFixed(1)}`;
        setStrokes((prev) => [...prev, { d: current.current }]);
      },
      onPanResponderMove: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        current.current += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
        setStrokes((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { d: current.current };
          return next;
        });
      },
    }),
  ).current;

  if (!letter) {
    return (
      <ScreenBg>
        <View style={styles.container}><Text style={styles.empty}>No letters to trace.</Text></View>
      </ScreenBg>
    );
  }

  const done = () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    if (activeId) {
      dispatch(
        markLetterSeen({
          studentId: activeId,
          language,
          phase,
          lessonId: letter.lessonId,
          glyph: letter.glyph,
          lessonSize: lessonSize.get(letter.lessonId) ?? 0,
        }),
      );
    }
    if (index + 1 < letters.length) {
      setIndex((i) => i + 1);
      clear();
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScreenBg>
      <View style={styles.container}>
        <Text style={styles.position}>{index + 1} / {letters.length}</Text>
        <Text style={styles.label}>Trace this!</Text>

        <View style={styles.canvasWrap}>
          {/* Faded guide glyph behind the canvas */}
          <Text style={styles.guide} numberOfLines={1} adjustsFontSizeToFit>
            {letter.glyph}
          </Text>
          {/* Touch capture + SVG overlay */}
          <View style={styles.svgLayer} {...responder.panHandlers}>
            <Svg width={CANVAS} height={CANVAS} viewBox={`0 0 ${CANVAS} ${CANVAS}`}>
              {strokes.map((s, i) => (
                <Path
                  key={i}
                  d={s.d}
                  stroke={colors.primary}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
            </Svg>
          </View>
        </View>

        <View style={styles.row}>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={clear}>
            <Text style={[styles.btnLabel, { color: colors.ink }]}>Clear</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={done}>
            <Text style={styles.btnLabel}>Done · Next</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>{letter.lessonTitle}</Text>
      </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  position: { fontSize: 14, color: colors.inkMuted, fontWeight: '700', letterSpacing: 2 },
  label: { fontSize: 20, color: colors.inkSoft, fontWeight: '800' },
  canvasWrap: {
    width: CANVAS,
    height: CANVAS,
    backgroundColor: colors.glassStrong,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glassEdge,
    alignItems: 'center',
    justifyContent: 'center',
    ...e3,
  },
  guide: {
    position: 'absolute',
    fontSize: 220,
    fontWeight: '900',
    color: 'rgba(31, 34, 56, 0.10)',
    textAlign: 'center',
    includeFontPadding: false,
  },
  svgLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  row: { flexDirection: 'row', gap: spacing.md },
  btn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    ...e3,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnGhost: {
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassEdge,
  },
  btnLabel: { color: '#fff', fontWeight: '900', fontSize: 16 },
  section: { fontSize: 12, color: colors.inkMuted, textAlign: 'center' },
  empty: { color: colors.inkSoft, fontSize: 18 },
});
