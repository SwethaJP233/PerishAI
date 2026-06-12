// Powered by OnSpace.AI
// PerishAI design tokens — cold-chain operations control room

export const colors = {
  bg: '#0B1220',
  bgDeep: '#070C18',
  surface: '#131C2E',
  surfaceElevated: '#1A2640',
  surfaceMuted: '#0F1726',
  border: '#243047',
  borderSoft: '#1B243A',

  primary: '#4FD1FF',
  primaryDim: '#2BA3CC',
  primarySoft: 'rgba(79,209,255,0.14)',

  accent: '#FFB547',
  accentSoft: 'rgba(255,181,71,0.16)',

  text: '#E6F0FF',
  textMuted: '#8B9BBA',
  textDim: '#5A6B8C',

  riskLow: '#34D399',
  riskMed: '#FBBF24',
  riskHigh: '#EF4444',
  riskLowSoft: 'rgba(52,211,153,0.16)',
  riskMedSoft: 'rgba(251,191,36,0.16)',
  riskHighSoft: 'rgba(239,68,68,0.18)',

  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#60A5FA',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(7,12,24,0.72)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const typography = {
  hero: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h1: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: '600' as const },
  h3: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  small: { fontSize: 13, fontWeight: '500' as const },
  caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.6 },
  number: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.5 },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: {
    shadowColor: '#4FD1FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
};

export const riskColor = (risk: 'low' | 'medium' | 'high') =>
  risk === 'high' ? colors.riskHigh : risk === 'medium' ? colors.riskMed : colors.riskLow;

export const riskSoft = (risk: 'low' | 'medium' | 'high') =>
  risk === 'high' ? colors.riskHighSoft : risk === 'medium' ? colors.riskMedSoft : colors.riskLowSoft;

export const riskLabel = (risk: 'low' | 'medium' | 'high') =>
  risk === 'high' ? 'HIGH RISK' : risk === 'medium' ? 'MEDIUM RISK' : 'LOW RISK';
