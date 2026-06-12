// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, riskColor } from '@/constants/theme';
import { RiskLevel } from '@/services/predictionService';

interface Props {
  probability: number; // 0..1
  risk: RiskLevel;
  label?: string;
}

export function RiskMeter({ probability, risk, label = 'Spoilage probability' }: Props) {
  const pct = Math.round(probability * 100);
  const tint = riskColor(risk);
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: tint }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.max(4, pct)}%`, backgroundColor: tint },
          ]}
        />
        <View style={[styles.notch, { left: '30%' }]} />
        <View style={[styles.notch, { left: '60%' }]} />
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendItem}>Low</Text>
        <Text style={styles.legendItem}>Medium</Text>
        <Text style={styles.legendItem}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.small,
    color: colors.textMuted,
  },
  value: {
    ...typography.number,
    fontSize: 22,
  },
  track: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  notch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.bg,
    opacity: 0.7,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  legendItem: {
    ...typography.caption,
    color: colors.textDim,
  },
});
