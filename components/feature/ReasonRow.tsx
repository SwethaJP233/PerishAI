// Powered by OnSpace.AI
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, riskColor } from '@/constants/theme';
import { Reason } from '@/services/predictionService';

interface Props {
  reason: Reason;
  rank: number;
}

export function ReasonRow({ reason, rank }: Props) {
  const tint = riskColor(reason.severity);
  const widthPct = Math.min(100, Math.round(reason.weight * 180));
  return (
    <View style={styles.row}>
      <View style={styles.headerLine}>
        <View style={styles.rankWrap}>
          <Text style={[styles.rank, { color: tint }]}>{rank}</Text>
        </View>
        <Text style={styles.label}>{reason.label}</Text>
        <Text style={[styles.weight, { color: tint }]}>{Math.round(reason.weight * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${widthPct}%`, backgroundColor: tint }]} />
      </View>
      <Text style={styles.detail}>{reason.detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rankWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rank: {
    ...typography.caption,
    fontSize: 12,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.text,
    flex: 1,
  },
  weight: {
    ...typography.bodyStrong,
    fontSize: 14,
  },
  track: {
    height: 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    marginVertical: 8,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.pill },
  detail: {
    ...typography.small,
    color: colors.textMuted,
    lineHeight: 19,
  },
});
