// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, riskColor, riskSoft } from '@/constants/theme';
import { RiskLevel } from '@/services/predictionService';

interface Props {
  risk: RiskLevel;
  label?: string;
  compact?: boolean;
}

export function RiskBadge({ risk, label, compact = false }: Props) {
  const c = riskColor(risk);
  const bg = riskSoft(risk);
  const text =
    label ?? (risk === 'high' ? 'HIGH RISK' : risk === 'medium' ? 'MEDIUM' : 'LOW RISK');
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, borderColor: c },
        compact && styles.compact,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Text style={[styles.text, { color: c }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 6,
  },
  compact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...typography.caption,
    color: colors.text,
  },
});
