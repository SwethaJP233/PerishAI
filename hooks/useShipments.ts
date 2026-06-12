// Powered by OnSpace.AI
import { useContext } from 'react';
import { ShipmentContext } from '@/contexts/ShipmentContext';

export function useShipments() {
  const ctx = useContext(ShipmentContext);
  if (!ctx) throw new Error('useShipments must be used within a ShipmentProvider');
  return ctx;
}
