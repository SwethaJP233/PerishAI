// Powered by OnSpace.AI
// PerishAI prediction engine — pure functions, no React.
// Computes spoilage probability, risk level, anomalies, shelf life, and explainable reasons.

import { RawShipment } from './shipmentData';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Reason {
  label: string;
  detail: string;
  weight: number; // 0..1 contribution
  severity: RiskLevel;
}

export interface Prediction {
  probability: number; // 0..1
  risk: RiskLevel;
  remainingShelfDays: number;
  originalShelfDays: number;
  freshnessPercent: number; // 0..100
  anomaly: boolean;
  anomalyType: string | null;
  reasons: Reason[];
  metrics: {
    tempDeviationC: number;
    humidityExcess: number;
    transitExcessHours: number;
  };
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function predictShipment(s: RawShipment): Prediction {
  // Temperature deviation outside safe band
  const tempOver = Math.max(0, s.currentTempC - s.targetTempMaxC);
  const tempUnder = Math.max(0, s.targetTempMinC - s.currentTempC);
  const tempDev = Math.max(tempOver, tempUnder);

  // Humidity excess above max
  const humidityExcess = Math.max(0, s.currentHumidity - s.targetHumidityMax);

  // Transit excess vs optimal
  const transitExcess = Math.max(0, s.transitHours - s.optimalTransitHours);

  // Normalized scores
  const tempScore = clamp(tempDev / 6, 0, 1);
  const humScore = clamp(humidityExcess / 25, 0, 1);
  const transitScore = clamp(transitExcess / 18, 0, 1);

  // Vehicle/storage modifier
  const vehicleRisk =
    s.vehicleType === 'standard' ? 0.08 : s.vehicleType === 'reefer-van' ? 0.02 : 0;
  const storageRisk = s.storageType === 'ambient' ? 0.1 : s.storageType === 'insulated' ? 0.04 : 0;

  let probability =
    0.55 * tempScore + 0.2 * humScore + 0.2 * transitScore + vehicleRisk + storageRisk;
  probability = clamp(probability, 0, 0.99);

  const risk: RiskLevel = probability >= 0.6 ? 'high' : probability >= 0.3 ? 'medium' : 'low';

  // Shelf life decay model
  const decayFactor = 1 + tempDev * 0.55 + humScore * 0.4 + transitScore * 0.35;
  const consumedDays = s.transitHours / 24;
  const adjustedShelf = s.originalShelfDays / Math.max(1, decayFactor);
  const remainingShelfDays = Math.max(0, adjustedShelf - consumedDays);
  const freshnessPercent = clamp((remainingShelfDays / s.originalShelfDays) * 100, 0, 100);

  // Anomaly detection
  let anomaly = false;
  let anomalyType: string | null = null;
  if (tempDev >= 4) {
    anomaly = true;
    anomalyType = 'Temperature spike outside safe band';
  } else if (humidityExcess >= 15) {
    anomaly = true;
    anomalyType = 'Sustained high humidity';
  } else if (transitExcess >= 10) {
    anomaly = true;
    anomalyType = 'Significant transit delay';
  }

  // Reasons
  const reasons: Reason[] = [];
  if (tempDev > 0.5) {
    reasons.push({
      label: 'Temperature out of band',
      detail: `Reading ${s.currentTempC.toFixed(1)}°C — target ${s.targetTempMinC}°C to ${s.targetTempMaxC}°C (${tempDev.toFixed(1)}°C deviation).`,
      weight: 0.55 * tempScore,
      severity: tempDev >= 4 ? 'high' : tempDev >= 2 ? 'medium' : 'low',
    });
  }
  if (humidityExcess > 1) {
    reasons.push({
      label: 'Humidity above target',
      detail: `Humidity at ${s.currentHumidity}% vs max ${s.targetHumidityMax}% — accelerates microbial growth.`,
      weight: 0.2 * humScore,
      severity: humidityExcess >= 15 ? 'high' : humidityExcess >= 6 ? 'medium' : 'low',
    });
  }
  if (transitExcess > 1) {
    reasons.push({
      label: 'Transit delay',
      detail: `Transit ${s.transitHours.toFixed(0)}h vs ${s.optimalTransitHours}h optimal (+${transitExcess.toFixed(0)}h).`,
      weight: 0.2 * transitScore,
      severity: transitExcess >= 10 ? 'high' : transitExcess >= 4 ? 'medium' : 'low',
    });
  }
  if (vehicleRisk > 0) {
    reasons.push({
      label: 'Vehicle profile risk',
      detail: `Vehicle type "${s.vehicleType}" provides limited active cooling.`,
      weight: vehicleRisk,
      severity: 'medium',
    });
  }
  if (reasons.length === 0) {
    reasons.push({
      label: 'All conditions nominal',
      detail: 'Temperature, humidity, and transit time are within expected envelopes.',
      weight: 0.05,
      severity: 'low',
    });
  }
  reasons.sort((a, b) => b.weight - a.weight);

  return {
    probability,
    risk,
    remainingShelfDays,
    originalShelfDays: s.originalShelfDays,
    freshnessPercent,
    anomaly,
    anomalyType,
    reasons,
    metrics: {
      tempDeviationC: tempDev,
      humidityExcess,
      transitExcessHours: transitExcess,
    },
  };
}

export interface AnalyzedShipment extends RawShipment {
  prediction: Prediction;
}

export function analyzeAll(shipments: RawShipment[]): AnalyzedShipment[] {
  return shipments.map((s) => ({ ...s, prediction: predictShipment(s) }));
}

export interface FleetStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  anomalies: number;
  avgProbability: number;
  avgFreshness: number;
}

export function computeFleetStats(items: AnalyzedShipment[]): FleetStats {
  if (items.length === 0) {
    return { total: 0, high: 0, medium: 0, low: 0, anomalies: 0, avgProbability: 0, avgFreshness: 0 };
  }
  const high = items.filter((i) => i.prediction.risk === 'high').length;
  const medium = items.filter((i) => i.prediction.risk === 'medium').length;
  const low = items.filter((i) => i.prediction.risk === 'low').length;
  const anomalies = items.filter((i) => i.prediction.anomaly).length;
  const avgProbability =
    items.reduce((acc, i) => acc + i.prediction.probability, 0) / items.length;
  const avgFreshness =
    items.reduce((acc, i) => acc + i.prediction.freshnessPercent, 0) / items.length;
  return { total: items.length, high, medium, low, anomalies, avgProbability, avgFreshness };
}
