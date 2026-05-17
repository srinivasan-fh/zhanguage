// Design tokens — Material 3 depth + iOS glass translucency.
// No native blur dep; "glass" is achieved with layered translucent surfaces
// over a soft tinted background.

export const colors = {
  // Brand
  primary: '#FF7A59',
  primaryDark: '#E25A3B',
  primarySoft: 'rgba(255, 122, 89, 0.12)',
  accent: '#3DD9C6',
  accentSoft: 'rgba(61, 217, 198, 0.12)',
  sun: '#FFC845',
  sky: '#7AB8FF',
  grass: '#7BD389',
  danger: '#E5484D',

  // Surfaces
  bg: '#FFF1DE',           // warm canvas base
  bgTint: '#FFE3C9',       // gradient top tint (paint a View on top)
  bgTintBottom: '#FFE9D2',
  paper: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.72)',     // frosted surface
  glassStrong: 'rgba(255, 255, 255, 0.88)',
  glassEdge: 'rgba(255, 255, 255, 0.65)',  // 1px top highlight
  hairline: 'rgba(20, 22, 40, 0.08)',
  overlay: 'rgba(20, 22, 40, 0.35)',

  // Text
  ink: '#1F2238',
  inkSoft: '#5C6178',
  inkMuted: '#8A8FA3',
  onPrimary: '#FFFFFF',

  // Medals
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFC845',
  diamond: '#9FE7F5',
  emerald: '#50C878',

  // Legacy aliases (some screens still reference)
  cream: '#FFF1DE',
};

export const radii = {
  sm: 14,
  md: 22,
  lg: 28,
  xl: 36,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  body: 18,
  title: 28,
  hero: 40,
  glyph: 96,
};

// Material 3 elevation — layered soft shadows. Each level is its own top-level
// export so there's no nested-object access at module load time (avoids
// "Cannot read property 'e2' of undefined" if a consumer evaluates before the
// theme module finishes initialising).
export const e1 = {
  shadowColor: '#1F2238',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 3,
  elevation: 2,
};

export const e2 = {
  shadowColor: '#1F2238',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.10,
  shadowRadius: 14,
  elevation: 6,
};

export const e3 = {
  shadowColor: '#1F2238',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.16,
  shadowRadius: 22,
  elevation: 10,
};

export const brandGlow = {
  shadowColor: '#FF7A59',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 8,
};

// Convenience preset for the frosted glass surface.
export const glassSurface = {
  backgroundColor: colors.glass,
  borderWidth: 1,
  borderColor: colors.glassEdge,
  borderRadius: radii.lg,
  ...e2,
};

// Legacy alias kept for screens that still write `shadow.card`.
export const shadow = { card: e2 };
// Back-compat: components that imported the `elevation` object can still spread it.
export const elevation = { e1, e2, e3, brandGlow };
