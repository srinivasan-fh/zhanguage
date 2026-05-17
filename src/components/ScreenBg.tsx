import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '@/theme';

// Cheap gradient feel without a native gradient lib: 3 stacked translucent
// blobs over the warm canvas. Place inside a flex:1 parent.
export function ScreenBg({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <View pointerEvents="none" style={styles.blobTop} />
      <View pointerEvents="none" style={styles.blobMid} />
      <View pointerEvents="none" style={styles.blobBottom} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  content: { flex: 1 },
  blobTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: 'rgba(255, 200, 69, 0.35)',
  },
  blobMid: {
    position: 'absolute',
    top: 220,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: 'rgba(122, 184, 255, 0.22)',
  },
  blobBottom: {
    position: 'absolute',
    bottom: -160,
    right: -60,
    width: 340,
    height: 340,
    borderRadius: 340,
    backgroundColor: 'rgba(61, 217, 198, 0.18)',
  },
});
