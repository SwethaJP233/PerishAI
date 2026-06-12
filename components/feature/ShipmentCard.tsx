// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, riskColor } from '@/constants/theme';
import { AnalyzedShipment } from '@/services/predictionService';
import { RiskBadge } from '@/components/ui/RiskBadge';

interface Props {
  shipment: AnalyzedShipment;
  compact?: boolean;
}

const categoryIcon: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Fish: 'fish',
  Dairy: 'cup',
  Meat: 'food-steak',
  Produce: 'fruit-cherries',
  Vaccines: 'needle',
  Bakery: 'bread-slice',
};

export function ShipmentCard({ shipment, compact = false }: Props) {
  const router = useRouter();
  const p = shipment.prediction;
  const tint = riskColor(p.risk);
  const icon = categoryIcon[shipment.category] ?? 'package-variant';
  const probPct = Math.round(p.probability * 100);

  return (
    <Pressable
      onPress={() => router.push(`/shipment/${shipment.id}`)}
      style={({ pressed }) => [
        styles.card,
        { borderColor: tint + '55' },
        pressed && { opacity: 0.85, transform: [{ scale: 0.995 }] },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: tint }]} />
      <View style={styles.header}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { borderColor: tint + '55', backgroundColor: tint + '14' }]}>
            <MaterialCommunityIcons name={icon} size={20} color={tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.id}>{shipment.id}</Text>
            <Text style={styles.product} numberOfLines={1}>
              {shipment.product}
            </Text>
          </View>
          <RiskBadge risk={p.risk} compact />
        </View>
      </View>

      <View style={styles.route}>
        <MaterialCommunityIcons name="map-marker-radius-outline" size={14} color={colors.textDim} />
        <Text style={styles.routeText} numberOfLines={1}>
          {shipment.origin}  →  {shipment.destination}
        </Text>
      </View>

      {!compact ? (
        <View style={styles.metricsRow}>
          <Metric
            icon="thermometer"
            label="Temp"
            value={`${shipment.currentTempC.toFixed(1)}°C`}
            warn={p.metrics.tempDeviationC > 0.5}
          />
          <Metric
            icon="water-percent"
            label="Humidity"
            value={`${shipment.currentHumidity}%`}
            warn={p.metrics.humidityExcess > 0}
          />
          <Metric
            icon="clock-outline"
            label="Transit"
            value={`${shipment.transitHours}h`}
            warn={p.metrics.transitExcessHours > 0}
          />
        </View>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${probPct}%`, backgroundColor: tint }]} />
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Spoilage prob.</Text>
          <Text style={[styles.footerValue, { color: tint }]}>{probPct}%</Text>
          <Text style={styles.dotSep}>•</Text>
          <Text style={styles.footerLabel}>Shelf left</Text>
          <Text style={styles.footerValue}>{p.remainingShelfDays.toFixed(1)}d</Text>
        </View>
      </View>
    </Pressable>
  );
}

function Metric({
  icon,
  label,
  value,
  warn,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  warn?: boolean;
}) {
  const tint = warn ? colors.riskHigh : colors.text;
  return (
    <View style={styles.metric}>
      <MaterialCommunityIcons name={icon} size={14} color={warn ? colors.riskHigh : colors.textDim} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: tint }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  header: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  id: {
    ...typography.bodyStrong,
    color: colors.text,
    letterSpacing: 0.5,
  },
  product: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  routeText: {
    ...typography.small,
    color: colors.textDim,
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metric: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: 2,
  },
  metricValue: {
    ...typography.bodyStrong,
    fontSize: 14,
    marginTop: 2,
  },
  footer: { gap: 6 },
  bar: {
    height: 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: { height: '100%' },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLabel: {
    ...typography.caption,
    color: colors.textDim,
  },
  footerValue: {
    ...typography.small,
    color: colors.text,
  },
  dotSep: { color: colors.textDim, marginHorizontal: 4 },
});
