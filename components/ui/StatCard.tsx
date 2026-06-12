// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';

interface Props {
  label: string;
  value: string;
  trend?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint?: string;
}

export function StatCard({ label, value, trend, icon, tint = colors.primary }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: tint + '22', borderColor: tint + '55' }]}>
        <MaterialCommunityIcons name={icon} size={18} color={tint} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: tint }]}>{value}</Text>
      {trend ? <Text style={styles.trend}>{trend}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
    minHeight: 118,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: spacing.md,
  },
  value: {
    ...typography.number,
    marginTop: 2,
  },
  trend: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
});
