// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertItem } from '@/components/feature/AlertItem';
import { CategoryBar } from '@/components/feature/CategoryBar';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useShipments } from '@/hooks/useShipments';

const FILTERS = ['All', 'High', 'Medium'] as const;

export default function AlertsScreen() {
  const { alerts } = useShipments();
  const [filter, setFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return alerts;
    if (filter === 'High') return alerts.filter((a) => a.severity === 'high');
    return alerts.filter((a) => a.severity === 'medium');
  }, [alerts, filter]);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScreenHeader
        eyebrow="REAL-TIME"
        title="Alert Feed"
        subtitle={`${alerts.length} alerts in the last hour`}
        right={
          <View style={styles.bellWrap}>
            <MaterialCommunityIcons name="bell-ring-outline" size={20} color={colors.accent} />
          </View>
        }
      />

      <CategoryBar
        options={FILTERS as unknown as string[]}
        value={filter}
        onChange={setFilter}
      />

      <FlatList
        data={filtered}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => <AlertItem alert={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bell-check-outline" size={42} color={colors.riskLow} />
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptyText}>No alerts at this severity right now.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  bellWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
    gap: 8,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyText: {
    ...typography.small,
    color: colors.textMuted,
  },
});
