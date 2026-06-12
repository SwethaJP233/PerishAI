// Powered by OnSpace.AI
// Mock shipment dataset — represents a realistic cold-chain fleet snapshot.

export type ProductCategory =
  | 'Fish'
  | 'Dairy'
  | 'Meat'
  | 'Produce'
  | 'Vaccines'
  | 'Bakery';

export type VehicleType = 'reefer-truck' | 'reefer-van' | 'air-cargo' | 'standard';
export type StorageType = 'controlled' | 'insulated' | 'ambient';

export interface RawShipment {
  id: string;
  product: string;
  category: ProductCategory;
  origin: string;
  destination: string;
  departureIso: string;
  vehicleType: VehicleType;
  storageType: StorageType;
  currentTempC: number;
  targetTempMinC: number;
  targetTempMaxC: number;
  currentHumidity: number;
  targetHumidityMax: number;
  transitHours: number;
  optimalTransitHours: number;
  distanceKm: number;
  originalShelfDays: number;
  driver: string;
  weightKg: number;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();

export const SHIPMENTS: RawShipment[] = [
  {
    id: 'FIS-1023',
    product: 'Atlantic Salmon Fillets',
    category: 'Fish',
    origin: 'Bergen, NO',
    destination: 'Hamburg, DE',
    departureIso: hoursAgo(34),
    vehicleType: 'reefer-truck',
    storageType: 'controlled',
    currentTempC: 8.2,
    targetTempMinC: 0,
    targetTempMaxC: 4,
    currentHumidity: 88,
    targetHumidityMax: 75,
    transitHours: 34,
    optimalTransitHours: 24,
    distanceKm: 1420,
    originalShelfDays: 10,
    driver: 'L. Jensen',
    weightKg: 2400,
  },
  {
    id: 'DAI-2210',
    product: 'Pasteurised Whole Milk',
    category: 'Dairy',
    origin: 'Amsterdam, NL',
    destination: 'Brussels, BE',
    departureIso: hoursAgo(6),
    vehicleType: 'reefer-van',
    storageType: 'controlled',
    currentTempC: 3.8,
    targetTempMinC: 2,
    targetTempMaxC: 5,
    currentHumidity: 62,
    targetHumidityMax: 75,
    transitHours: 6,
    optimalTransitHours: 8,
    distanceKm: 210,
    originalShelfDays: 14,
    driver: 'M. de Vries',
    weightKg: 1800,
  },
  {
    id: 'MEA-3344',
    product: 'Vacuum-packed Beef Loin',
    category: 'Meat',
    origin: 'Buenos Aires, AR',
    destination: 'Madrid, ES',
    departureIso: hoursAgo(58),
    vehicleType: 'air-cargo',
    storageType: 'controlled',
    currentTempC: 5.1,
    targetTempMinC: -1,
    targetTempMaxC: 2,
    currentHumidity: 70,
    targetHumidityMax: 80,
    transitHours: 58,
    optimalTransitHours: 50,
    distanceKm: 10100,
    originalShelfDays: 28,
    driver: 'C. Romero',
    weightKg: 3200,
  },
  {
    id: 'PRD-4781',
    product: 'Mixed Berries Pallets',
    category: 'Produce',
    origin: 'Huelva, ES',
    destination: 'Paris, FR',
    departureIso: hoursAgo(18),
    vehicleType: 'reefer-truck',
    storageType: 'controlled',
    currentTempC: 2.4,
    targetTempMinC: 0,
    targetTempMaxC: 4,
    currentHumidity: 92,
    targetHumidityMax: 90,
    transitHours: 18,
    optimalTransitHours: 20,
    distanceKm: 1750,
    originalShelfDays: 7,
    driver: 'S. Garcia',
    weightKg: 1600,
  },
  {
    id: 'VAC-9012',
    product: 'mRNA Vaccine Batch B-44',
    category: 'Vaccines',
    origin: 'Mainz, DE',
    destination: 'Warsaw, PL',
    departureIso: hoursAgo(12),
    vehicleType: 'reefer-van',
    storageType: 'controlled',
    currentTempC: -68.5,
    targetTempMinC: -80,
    targetTempMaxC: -60,
    currentHumidity: 35,
    targetHumidityMax: 50,
    transitHours: 12,
    optimalTransitHours: 14,
    distanceKm: 1080,
    originalShelfDays: 30,
    driver: 'T. Kowalski',
    weightKg: 240,
  },
  {
    id: 'FIS-1188',
    product: 'Fresh Tuna Loins',
    category: 'Fish',
    origin: 'Vigo, ES',
    destination: 'Lyon, FR',
    departureIso: hoursAgo(22),
    vehicleType: 'reefer-truck',
    storageType: 'controlled',
    currentTempC: 5.6,
    targetTempMinC: 0,
    targetTempMaxC: 4,
    currentHumidity: 82,
    targetHumidityMax: 75,
    transitHours: 22,
    optimalTransitHours: 18,
    distanceKm: 1180,
    originalShelfDays: 6,
    driver: 'P. Moreau',
    weightKg: 980,
  },
  {
    id: 'DAI-2511',
    product: 'Artisan Cheese Wheels',
    category: 'Dairy',
    origin: 'Lyon, FR',
    destination: 'Milan, IT',
    departureIso: hoursAgo(9),
    vehicleType: 'reefer-van',
    storageType: 'insulated',
    currentTempC: 6.2,
    targetTempMinC: 4,
    targetTempMaxC: 8,
    currentHumidity: 78,
    targetHumidityMax: 85,
    transitHours: 9,
    optimalTransitHours: 10,
    distanceKm: 480,
    originalShelfDays: 60,
    driver: 'A. Bianchi',
    weightKg: 720,
  },
  {
    id: 'PRD-4920',
    product: 'Leafy Greens Crates',
    category: 'Produce',
    origin: 'Almería, ES',
    destination: 'Berlin, DE',
    departureIso: hoursAgo(40),
    vehicleType: 'reefer-truck',
    storageType: 'controlled',
    currentTempC: 9.4,
    targetTempMinC: 1,
    targetTempMaxC: 4,
    currentHumidity: 95,
    targetHumidityMax: 92,
    transitHours: 40,
    optimalTransitHours: 28,
    distanceKm: 2300,
    originalShelfDays: 5,
    driver: 'K. Becker',
    weightKg: 2100,
  },
  {
    id: 'BAK-5550',
    product: 'Frozen Croissant Dough',
    category: 'Bakery',
    origin: 'Strasbourg, FR',
    destination: 'Zurich, CH',
    departureIso: hoursAgo(5),
    vehicleType: 'reefer-truck',
    storageType: 'controlled',
    currentTempC: -16.5,
    targetTempMinC: -22,
    targetTempMaxC: -15,
    currentHumidity: 40,
    targetHumidityMax: 60,
    transitHours: 5,
    optimalTransitHours: 6,
    distanceKm: 220,
    originalShelfDays: 90,
    driver: 'R. Müller',
    weightKg: 1450,
  },
  {
    id: 'MEA-3402',
    product: 'Poultry Breast Pallets',
    category: 'Meat',
    origin: 'Poznań, PL',
    destination: 'Vienna, AT',
    departureIso: hoursAgo(11),
    vehicleType: 'reefer-truck',
    storageType: 'controlled',
    currentTempC: 1.4,
    targetTempMinC: 0,
    targetTempMaxC: 4,
    currentHumidity: 68,
    targetHumidityMax: 80,
    transitHours: 11,
    optimalTransitHours: 12,
    distanceKm: 540,
    originalShelfDays: 8,
    driver: 'J. Nowak',
    weightKg: 2050,
  },
];
