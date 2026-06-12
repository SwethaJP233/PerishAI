// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ShipmentCard } from '@/components/feature/ShipmentCard';
import { StatCard } from '@/components/ui/StatCard';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useShipments } from '@/hooks/useShipments';

export default function DashboardScreen() {
  const { shipments, stats, alerts } = useShipments();
  const router = useRouter();

  const topRisk = useMemo(
    () => [...shipments].sort((a, b) => b.prediction.probability - a.prediction.probability).slice(0, 3),
    [shipments],
  );

  const tickerAlerts = alerts.slice(0, 3);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.huge }}
      >
        <ScreenHeader
          eyebrow="LIVE FLEET STATUS"
          title="PerishAI Operations"
          subtitle={`${stats.total} active shipments • ${stats.high} flagged high risk`}
          right={
            <View style={styles.statusPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusText}>LIVE</Text>
            </View>
          }
        />

        {/* Hero card */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCard}>
            <Image
              source={require('@/assets/images/hero-cold-chain.png')}
              style={styles.heroImg}
              contentFit="cover"
              transition={250}
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroEyebrow}>FLEET RISK INDEX</Text>
              <Text style={styles.heroNumber}>
                {Math.round(stats.avgProbability * 100)}
                <Text style={styles.heroUnit}>%</Text>
              </Text>
              <Text style={styles.heroSub}>
                Avg spoilage probability across {stats.total} shipments
              </Text>
              <View style={styles.heroPills}>
                <RiskPill count={stats.high} label="High" tint={colors.riskHigh} />
                <RiskPill count={stats.medium} label="Medium" tint={colors.riskMed} />
                <RiskPill count={stats.low} label="Low" tint={colors.riskLow} />
              </View>
            </View>
          </View>
        </View>

        {/* KPIs */}
        <View style={styles.statsRow}>
          <StatCard
            label="ANOMALIES"
            value={stats.anomalies.toString()}
            trend="Detected last 30m"
            icon="alert-decagram-outline"
            tint={colors.riskHigh}
          />
          <StatCard
            label="AVG FRESHNESS"
            value={`${Math.round(stats.avgFreshness)}%`}
            trend="Across active fleet"
            icon="leaf"
            tint={colors.riskLow}
          />
        </View>
        <View style={[styles.statsRow, { marginTop: spacing.md }]}>
          <StatCard
            label="ON WATCHLIST"
            value={stats.medium.toString()}
            trend="Trending unfavorable"
            icon="eye-outline"
            tint={colors.accent}
          />
          <StatCard
            label="STABLE"
            value={stats.low.toString()}
            trend="Within safe envelope"
            icon="shield-check-outline"
            tint={colors.primary}
          />
        </View>

        {/* Live alerts ticker */}
        {tickerAlerts.length > 0 ? (
          <View style={styles.tickerWrap}>
            <View style={styles.tickerHeader}>
              <MaterialCommunityIcons name="radio-tower" size={16} color={colors.accent} />
              <Text style={styles.tickerTitle}>Live alerts</Text>
              <Pressable onPress={() => router.push('/(tabs)/alerts')}>
                <Text style={styles.tickerLink}>View all</Text>
              </Pressable>
            </View>
            {tickerAlerts.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => router.push(`/shipment/${a.shipmentId}`)}
                style={({ pressed }) => [styles.tickerRow, pressed && { opacity: 0.7 }]}
              >
                <View
                  style={[
                    styles.tickerDot,
                    {
                      backgroundColor:
                        a.severity === 'high' ? colors.riskHigh : a.severity === 'medium' ? colors.riskMed : colors.riskLow,
                    },
                  ]}
                />
                <Text style={styles.tickerText} numberOfLines={1}>
                  <Text style={styles.tickerStrong}>{a.shipmentId}</Text>  •  {a.detail}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* Top at-risk shipments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top at-risk shipments</Text>
          <Pressable onPress={() => router.push('/(tabs)/shipments')}>
            <Text style={styles.sectionLink}>See all</Text>
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: spacing.xl, gap: spacing.md }}>
          {topRisk.map((s) => (
            <ShipmentCard key={s.id} shipment={s} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RiskPill({ count, label, tint }: { count: number; label: string; tint: string }) {
  return (
    <View style={[styles.pill, { borderColor: tint + '66', backgroundColor: tint + '14' }]}>
      <Text style={[styles.pillCount, { color: tint }]}>{count}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.riskLowSoft,
    borderWidth: 1,
    borderColor: colors.riskLow + '66',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.riskLow,
  },
  statusText: {
    ...typography.caption,
    color: colors.riskLow,
  },
  heroWrap: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  heroCard: {
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,18,32,0.55)',
  },
  heroContent: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'flex-end',
  },
  heroEyebrow: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: 4,
  },
  heroNumber: {
    color: colors.text,
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 60,
  },
  heroUnit: { fontSize: 28, fontWeight: '600', color: colors.primary },
  heroSub: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4,
  },
  heroPills: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pillCount: { ...typography.bodyStrong, fontSize: 14 },
  pillLabel: { ...typography.caption, color: colors.text },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  tickerWrap: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  tickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tickerTitle: {
    ...typography.bodyStrong,
    color: colors.text,
    flex: 1,
  },
  tickerLink: {
    ...typography.small,
    color: colors.primary,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  tickerDot: { width: 8, height: 8, borderRadius: 4 },
  tickerText: { ...typography.small, color: colors.textMuted, flex: 1 },
  tickerStrong: { color: colors.text, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
  },
  sectionLink: {
    ...typography.small,
    color: colors.primary,
  },
});
