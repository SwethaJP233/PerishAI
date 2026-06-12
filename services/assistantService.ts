// Powered by OnSpace.AI
// Mocked GenAI assistant — pattern-matched explanations using local prediction data.

import { AnalyzedShipment } from './predictionService';

const SHIPMENT_RE = /\b([A-Z]{3}-\d{3,4})\b/i;

function findShipment(query: string, fleet: AnalyzedShipment[]): AnalyzedShipment | null {
  const m = query.match(SHIPMENT_RE);
  if (m) {
    const id = m[1].toUpperCase();
    const hit = fleet.find((s) => s.id.toUpperCase() === id);
    if (hit) return hit;
  }
  // Try product/category match
  const lower = query.toLowerCase();
  return (
    fleet.find((s) => lower.includes(s.product.toLowerCase().split(' ')[0])) ||
    fleet.find((s) => lower.includes(s.category.toLowerCase())) ||
    null
  );
}

export function answerAssistant(query: string, fleet: AnalyzedShipment[]): string {
  const q = query.trim();
  if (!q) return 'Ask me about any shipment, risk level, or freshness. Try: "Why is FIS-1023 high risk?"';

  const lower = q.toLowerCase();
  const hit = findShipment(q, fleet);

  if (hit) {
    const p = hit.prediction;
    const probPct = Math.round(p.probability * 100);
    const reasonText = p.reasons
      .slice(0, 3)
      .map((r, i) => `${i + 1}. ${r.label} — ${r.detail}`)
      .join('\n');
    if (lower.includes('shelf') || lower.includes('fresh')) {
      return `Shipment ${hit.id} (${hit.product}) has roughly ${p.remainingShelfDays.toFixed(1)} of its original ${p.originalShelfDays} days of shelf life remaining (${Math.round(p.freshnessPercent)}% freshness). Decay is being driven by ${p.reasons[0].label.toLowerCase()}.`;
    }
    if (lower.includes('what should') || lower.includes('action') || lower.includes('do')) {
      const action =
        p.risk === 'high'
          ? `Reroute to the nearest cold-storage hub immediately, verify reefer setpoint, and notify the receiver of likely partial spoilage.`
          : p.risk === 'medium'
          ? `Tighten reefer setpoint to the lower bound, reduce door openings, and re-check telemetry within 1 hour.`
          : `No intervention needed — continue routine monitoring.`;
      return `Recommended action for ${hit.id}: ${action}`;
    }
    return `Shipment ${hit.id} (${hit.product}, ${hit.origin} → ${hit.destination}) is currently ${p.risk.toUpperCase()} risk with a spoilage probability of about ${probPct}%. Top contributing factors:\n${reasonText}\n\nEstimated remaining shelf life: ${p.remainingShelfDays.toFixed(1)} days of ${p.originalShelfDays}.`;
  }

  if (lower.includes('how many') || lower.includes('count')) {
    const high = fleet.filter((s) => s.prediction.risk === 'high').length;
    const med = fleet.filter((s) => s.prediction.risk === 'medium').length;
    return `Across ${fleet.length} active shipments: ${high} are high risk, ${med} are medium risk, and ${fleet.length - high - med} are within safe parameters.`;
  }

  if (lower.includes('anomal')) {
    const anomalies = fleet.filter((s) => s.prediction.anomaly);
    if (anomalies.length === 0) return 'No anomalies detected across the active fleet right now.';
    return `${anomalies.length} anomaly(ies) detected:\n${anomalies
      .map((a) => `• ${a.id} — ${a.prediction.anomalyType}`)
      .join('\n')}`;
  }

  if (lower.includes('worst') || lower.includes('riskiest') || lower.includes('top risk')) {
    const sorted = [...fleet].sort((a, b) => b.prediction.probability - a.prediction.probability);
    const top = sorted.slice(0, 3);
    return `The 3 highest-risk shipments right now:\n${top
      .map(
        (s, i) =>
          `${i + 1}. ${s.id} — ${s.product} • ${Math.round(s.prediction.probability * 100)}% spoilage probability`,
      )
      .join('\n')}`;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hi — I am the PerishAI assistant. I can explain any shipment, summarize fleet risk, or recommend actions. What would you like to know?';
  }

  return `I can help with risk explanations, shelf life, anomalies, and recommended actions. Try asking about a shipment ID like "${fleet[0]?.id ?? 'FIS-1023'}", or ask "what are the riskiest shipments?"`;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}
