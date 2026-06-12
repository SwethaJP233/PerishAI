// Powered by OnSpace.AI
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, riskColor } from '@/constants/theme';
import { AlertEntry } from '@/contexts/ShipmentContext';

interface Props {
  alert: AlertEntry;
}

const formatTime = (ts: number) => {
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  return `${h}h ago`;
};

export function AlertItem({ alert }: Props) {
  const router = useRouter();
  const tint = riskColor(alert.severity);
  const icon =
    alert.severity === 'high' ? 'alert-octagon' : alert.severity === 'medium' ? 'alert' : 'information-outline';

  return (
    <Pressable
      onPress={() => router.push(`/shipment/${alert.shipmentId}`)}
      style={({ pressed }) => [
        styles.card,
        { borderColor: tint + '55' },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: tint + '1A', borderColor: tint + '55' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.detail} numberOfLines={2}>
          {alert.detail}
        </Text>
        <Text style={styles.time}>{formatTime(alert.ts)}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textDim} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  detail: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 19,
  },
  time: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: 6,
  },
});
