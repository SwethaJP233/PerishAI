// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryBar } from '@/components/feature/CategoryBar';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ShipmentCard } from '@/components/feature/ShipmentCard';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useShipments } from '@/hooks/useShipments';

const FILTERS = ['All', 'High', 'Medium', 'Low', 'Anomalies'] as const;
type Filter = (typeof FILTERS)[number];

export default function ShipmentsScreen() {
  const { shipments } = useShipments();
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = shipments;
    if (filter === 'High') list = list.filter((s) => s.prediction.risk === 'high');
    else if (filter === 'Medium') list = list.filter((s) => s.prediction.risk === 'medium');
    else if (filter === 'Low') list = list.filter((s) => s.prediction.risk === 'low');
    else if (filter === 'Anomalies') list = list.filter((s) => s.prediction.anomaly);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.product.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => b.prediction.probability - a.prediction.probability);
  }, [shipments, filter, query]);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScreenHeader
        eyebrow="FLEET MONITOR"
        title="Active Shipments"
        subtitle={`${filtered.length} of ${shipments.length} matching`}
      />

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.textDim} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search ID, product, route..."
            placeholderTextColor={colors.textDim}
            style={styles.searchInput}
            accessibilityLabel="Search shipments"
          />
        </View>
      </View>

      <CategoryBar
        options={FILTERS as unknown as string[]}
        value={filter}
        onChange={(v) => setFilter(v as Filter)}
      />

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <ShipmentCard shipment={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="archive-search-outline" size={42} color={colors.textDim} />
            <Text style={styles.emptyTitle}>No matching shipments</Text>
            <Text style={styles.emptyText}>Try a different filter or search term.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  searchWrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 0,
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
