// Powered by OnSpace.AI
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  AnalyzedShipment,
  analyzeAll,
  computeFleetStats,
  FleetStats,
} from '@/services/predictionService';
import { SHIPMENTS } from '@/services/shipmentData';

export interface AlertEntry {
  id: string;
  shipmentId: string;
  title: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
  ts: number;
}

export interface ShipmentContextValue {
  shipments: AnalyzedShipment[];
  stats: FleetStats;
  alerts: AlertEntry[];
  refresh: () => void;
  getById: (id: string) => AnalyzedShipment | undefined;
}

export const ShipmentContext = createContext<ShipmentContextValue | undefined>(undefined);

const buildAlerts = (items: AnalyzedShipment[]): AlertEntry[] => {
  const out: AlertEntry[] = [];
  items.forEach((s) => {
    if (s.prediction.risk === 'high') {
      out.push({
        id: `${s.id}-risk`,
        shipmentId: s.id,
        title: `${s.id} flagged HIGH risk`,
        detail: `${s.product} — spoilage probability ${(s.prediction.probability * 100).toFixed(0)}%.`,
        severity: 'high',
        ts: Date.now() - 1000 * 60 * 5,
      });
    }
    if (s.prediction.anomaly) {
      out.push({
        id: `${s.id}-anom`,
        shipmentId: s.id,
        title: `Anomaly on ${s.id}`,
        detail: s.prediction.anomalyType ?? 'Unusual condition detected',
        severity: 'high',
        ts: Date.now() - 1000 * 60 * 12,
      });
    } else if (s.prediction.risk === 'medium') {
      out.push({
        id: `${s.id}-watch`,
        shipmentId: s.id,
        title: `${s.id} on watchlist`,
        detail: `${s.prediction.reasons[0]?.label ?? 'Conditions trending unfavorable'}.`,
        severity: 'medium',
        ts: Date.now() - 1000 * 60 * 30,
      });
    }
  });
  return out.sort((a, b) => b.ts - a.ts);
};

export function ShipmentProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<AnalyzedShipment[]>(() => analyzeAll(SHIPMENTS));
  const [tick, setTick] = useState(0);

  // Lightweight live-feel: re-analyze every 30s with subtle drift.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (tick === 0) return;
    setShipments((prev) =>
      prev.map((s) => {
        const drift = (Math.random() - 0.5) * 0.4;
        const drifted = { ...s, currentTempC: +(s.currentTempC + drift).toFixed(2) };
        return { ...drifted, prediction: analyzeAll([drifted])[0].prediction };
      }),
    );
  }, [tick]);

  const stats = useMemo(() => computeFleetStats(shipments), [shipments]);
  const alerts = useMemo(() => buildAlerts(shipments), [shipments]);

  const value: ShipmentContextValue = {
    shipments,
    stats,
    alerts,
    refresh: () => setShipments(analyzeAll(SHIPMENTS)),
    getById: (id: string) => shipments.find((s) => s.id === id),
  };

  return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>;
}
