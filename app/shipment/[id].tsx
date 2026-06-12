// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RiskMeter } from '@/components/ui/RiskMeter';
import { ReasonRow } from '@/components/feature/ReasonRow';
import { colors, radius, spacing, typography, riskColor } from '@/constants/theme';
import { useShipments } from '@/hooks/useShipments';

export default function ShipmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById } = useShipments();
  const router = useRouter();
  const shipment = id ? getById(id) : undefined;

  if (!shipment) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.h1}>Shipment not found</Text>
          <Text style={styles.muted}>It may have been removed from the active feed.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const p = shipment.prediction;
  const tint = riskColor(p.risk);
  const recommended =
    p.risk === 'high'
      ? 'Reroute to nearest cold-storage hub. Verify reefer setpoint and notify the receiver.'
      : p.risk === 'medium'
      ? 'Tighten reefer to lower bound, reduce door openings, recheck within 1 hour.'
      : 'No intervention needed — continue routine monitoring.';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { borderColor: tint + '55' }]}>
          <View style={[styles.heroAccent, { backgroundColor: tint }]} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>{shipment.category.toUpperCase()}</Text>
              <Text style={styles.heroId}>{shipment.id}</Text>
              <Text style={styles.heroProduct}>{shipment.product}</Text>
            </View>
            <RiskBadge risk={p.risk} />
          </View>
          <View style={styles.routeBlock}>
            <RouteEnd label="ORIGIN" place={shipment.origin} />
            <View style={styles.routeLine}>
              <MaterialCommunityIcons name="truck-fast-outline" size={20} color={colors.primary} />
            </View>
            <RouteEnd label="DEST" place={shipment.destination} alignRight />
          </View>
          <View style={styles.heroFooter}>
            <Tag icon="account-outline" text={shipment.driver} />
            <Tag icon="weight-kilogram" text={`${shipment.weightKg} kg`} />
            <Tag icon="map-marker-distance" text={`${shipment.distanceKm} km`} />
          </View>
        </View>

        {p.anomaly ? (
          <View style={styles.anomalyCard}>
            <MaterialCommunityIcons name="alert-octagon" size={20} color={colors.riskHigh} />
            <View style={{ flex: 1 }}>
              <Text style={styles.anomalyTitle}>Anomaly detected</Text>
              <Text style={styles.anomalyText}>{p.anomalyType}</Text>
            </View>
          </View>
        ) : null}

        {/* Risk meter */}
        <View style={styles.section}>
          <RiskMeter probability={p.probability} risk={p.risk} />
        </View>

        {/* Live conditions */}
        <Text style={styles.sectionTitle}>Live conditions</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="thermometer"
            label="Temperature"
            value={`${shipment.currentTempC.toFixed(1)}°C`}
            sub={`Target ${shipment.targetTempMinC}° — ${shipment.targetTempMaxC}°C`}
            warn={p.metrics.tempDeviationC > 0.5}
          />
          <MetricCard
            icon="water-percent"
            label="Humidity"
            value={`${shipment.currentHumidity}%`}
            sub={`Max ${shipment.targetHumidityMax}%`}
            warn={p.metrics.humidityExcess > 0}
          />
          <MetricCard
            icon="clock-outline"
            label="Transit"
            value={`${shipment.transitHours}h`}
            sub={`Optimal ${shipment.optimalTransitHours}h`}
            warn={p.metrics.transitExcessHours > 0}
          />
          <MetricCard
            icon="truck-cargo-container"
            label="Vehicle"
            value={shipment.vehicleType}
            sub={shipment.storageType}
          />
        </View>

        {/* Shelf life */}
        <Text style={styles.sectionTitle}>Shelf life forecast</Text>
        <View style={styles.shelfCard}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shelfBig}>
                {p.remainingShelfDays.toFixed(1)}
                <Text style={styles.shelfUnit}> days left</Text>
              </Text>
              <Text style={styles.shelfSub}>
                Original shelf life {p.originalShelfDays} days
              </Text>
            </View>
            <View style={[styles.freshnessRing, { borderColor: tint }]}>
              <Text style={[styles.freshnessNum, { color: tint }]}>
                {Math.round(p.freshnessPercent)}%
              </Text>
              <Text style={styles.freshnessLabel}>fresh</Text>
            </View>
          </View>
          <View style={styles.shelfBar}>
            <View
              style={[
                styles.shelfFill,
                { width: `${Math.max(2, p.freshnessPercent)}%`, backgroundColor: tint },
              ]}
            />
          </View>
        </View>

        {/* Explainable reasons */}
        <Text style={styles.sectionTitle}>Why is it risky?</Text>
        <View style={styles.reasonsCard}>
          {p.reasons.slice(0, 4).map((r, idx) => (
            <View key={r.label}>
              {idx > 0 ? <View style={styles.divider} /> : null}
              <ReasonRow reason={r} rank={idx + 1} />
            </View>
          ))}
        </View>

        {/* Recommended action */}
        <Text style={styles.sectionTitle}>Recommended action</Text>
        <View style={[styles.actionCard, { borderColor: tint + '55' }]}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={tint} />
          <Text style={styles.actionText}>{recommended}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function RouteEnd({
  label,
  place,
  alignRight,
}: {
  label: string;
  place: string;
  alignRight?: boolean;
}) {
  return (
    <View style={{ flex: 1, alignItems: alignRight ? 'flex-end' : 'flex-start' }}>
      <Text style={styles.routeLabel}>{label}</Text>
      <Text style={styles.routePlace}>{place}</Text>
    </View>
  );
}

function Tag({
  icon,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.tag}>
      <MaterialCommunityIcons name={icon} size={12} color={colors.textMuted} />
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  warn,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  sub: string;
  warn?: boolean;
}) {
  const tint = warn ? colors.riskHigh : colors.primary;
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: tint + '14', borderColor: tint + '55' }]}>
        <MaterialCommunityIcons name={icon} size={16} color={tint} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, warn && { color: colors.riskHigh }]}>{value}</Text>
      <Text style={styles.metricSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  h1: { ...typography.h1, color: colors.text },
  muted: { ...typography.small, color: colors.textMuted, marginTop: 8 },

  hero: {
    margin: spacing.xl,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  eyebrow: { ...typography.caption, color: colors.primary, marginBottom: 4 },
  heroId: { ...typography.h1, color: colors.text },
  heroProduct: { ...typography.small, color: colors.textMuted, marginTop: 4 },

  routeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  routeLine: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLabel: { ...typography.caption, color: colors.textDim, marginBottom: 2 },
  routePlace: { ...typography.bodyStrong, color: colors.text },

  heroFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  tagText: { ...typography.caption, color: colors.textMuted },

  anomalyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.riskHighSoft,
    borderWidth: 1,
    borderColor: colors.riskHigh + '66',
  },
  anomalyTitle: { ...typography.bodyStrong, color: colors.riskHigh },
  anomalyText: { ...typography.small, color: colors.text, marginTop: 2 },

  section: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  metricCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
  },
  metricIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textDim,
  },
  metricValue: {
    ...typography.h2,
    color: colors.text,
    marginTop: 2,
  },
  metricSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },

  shelfCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
  },
  shelfBig: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  shelfUnit: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  shelfSub: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  freshnessRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freshnessNum: { fontSize: 18, fontWeight: '700' },
  freshnessLabel: { ...typography.caption, color: colors.textDim, marginTop: 2 },
  shelfBar: {
    height: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  shelfFill: { height: '100%', borderRadius: radius.pill },

  reasonsCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
  },
  divider: { height: 1, backgroundColor: colors.borderSoft },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  actionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
});
