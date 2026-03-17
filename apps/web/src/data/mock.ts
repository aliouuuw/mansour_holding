export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  status: 'available' | 'reserved' | 'sold'
  fuelType: string
  transmission: string
  color: string
  vin: string
  description: string
  image: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  source: 'walk-in' | 'referral' | 'online' | 'phone'
  createdAt: string
  totalDeals: number
}

export interface Deal {
  id: string
  vehicleId: string
  customerId: string
  salesPerson: string
  status: 'prospect' | 'negotiation' | 'test-drive' | 'closed-won' | 'closed-lost'
  price: number
  customerName: string
  vehicleName: string
  createdAt: string
}

export interface Activity {
  id: string
  type: 'sale' | 'lead' | 'vehicle' | 'appointment'
  message: string
  time: string
}

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    make: 'Toyota',
    model: 'Land Cruiser 300',
    year: 2024,
    mileage: 1200,
    price: 45000000,
    status: 'available',
    fuelType: 'Diesel',
    transmission: 'Automatique',
    color: 'Blanc Perle',
    vin: 'JTMAB3FV5RD123456',
    description: 'Land Cruiser 300 GR Sport, full options, cuir, toit ouvrant, caméra 360°',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
  },
  {
    id: 'v2',
    make: 'Mercedes-Benz',
    model: 'S-Class 580',
    year: 2024,
    mileage: 800,
    price: 75000000,
    status: 'available',
    fuelType: 'Hybride',
    transmission: 'Automatique',
    color: 'Noir Obsidienne',
    vin: 'W1N1670421A234567',
    description: 'S-Class 580 4MATIC, Executive Line, sièges massants, Burmester 4D, conduite autonome niveau 3',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
  },
  {
    id: 'v3',
    make: 'BMW',
    model: 'X7 xDrive40i',
    year: 2024,
    mileage: 2500,
    price: 58000000,
    status: 'reserved',
    fuelType: 'Essence',
    transmission: 'Automatique',
    color: 'Gris Minéral',
    vin: '5UXCR6C05P9B34567',
    description: 'X7 Excellence, 6 places, toit panoramique Sky Lounge, Bowers & Wilkins Diamond',
    image: 'https://images.unsplash.com/photo-1655196601602-054593845c46?w=800&h=600&fit=crop',
  },
  {
    id: 'v4',
    make: 'Range Rover',
    model: 'Autobiography LWB',
    year: 2024,
    mileage: 500,
    price: 92000000,
    status: 'available',
    fuelType: 'Diesel',
    transmission: 'Automatique',
    color: 'Vert Belgravia',
    vin: 'SALWA2BK5PA456789',
    description: 'Range Rover Autobiography LWB, exécutif avec cloison, Meridian Signature, sièges réclinables',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  },
  {
    id: 'v5',
    make: 'Lexus',
    model: 'LM 350h',
    year: 2024,
    mileage: 0,
    price: 65000000,
    status: 'available',
    fuelType: 'Hybride',
    transmission: 'Automatique',
    color: 'Blanc Sonic',
    vin: 'AHTBB3CD50K567890',
    description: 'Lexus LM 350h VIP, 4 places avec cloison, écran 48", réfrigérateur, massage intégral',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
  },
  {
    id: 'v6',
    make: 'Toyota',
    model: 'Land Cruiser 300',
    year: 2024,
    mileage: 3000,
    price: 48000000,
    status: 'sold',
    fuelType: 'Diesel',
    transmission: 'Automatique',
    color: 'Blanc Perle',
    vin: 'JTJBM7FX5R5678901',
    description: 'Land Cruiser 300 ZX, full options, caméra 360°, suspension KDSS, cuir semi-aniline',
    image: 'https://images.unsplash.com/photo-1629897048514-3dd74151aeaf?w=800&h=600&fit=crop',
  },
  {
    id: 'v7',
    make: 'Audi',
    model: 'A8 L 60 TFSI',
    year: 2024,
    mileage: 1800,
    price: 68000000,
    status: 'available',
    fuelType: 'Essence',
    transmission: 'Automatique',
    color: 'Bleu Firmament',
    vin: 'KM8J3CAL5PU789012',
    description: 'A8 L 60 TFSI quattro, exécutif avec relaxation pack, Bang & Olufsen 3D Advanced',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop',
  },
  {
    id: 'v8',
    make: 'Porsche',
    model: 'Panamera 4S',
    year: 2024,
    mileage: 3500,
    price: 55000000,
    status: 'available',
    fuelType: 'Essence',
    transmission: 'PDK',
    color: 'Gris Quartzite',
    vin: 'WP0AE2A79PL123456',
    description: 'Panamera 4S Executive, allongé, sièges arrière à réglage électrique, PDLS Plus',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&h=600&fit=crop',
  },
]

export const customers: Customer[] = [
  { id: 'c1', firstName: 'Amadou', lastName: 'Diallo', email: 'amadou.diallo@email.com', phone: '+221 77 123 45 67', source: 'walk-in', createdAt: '2024-12-15', totalDeals: 2 },
  { id: 'c2', firstName: 'Fatou', lastName: 'Sow', email: 'fatou.sow@email.com', phone: '+221 78 234 56 78', source: 'referral', createdAt: '2025-01-08', totalDeals: 1 },
  { id: 'c3', firstName: 'Moussa', lastName: 'Ba', email: 'moussa.ba@email.com', phone: '+221 76 345 67 89', source: 'online', createdAt: '2025-01-20', totalDeals: 0 },
  { id: 'c4', firstName: 'Aïssatou', lastName: 'Ndiaye', email: 'aissatou.n@email.com', phone: '+221 77 456 78 90', source: 'phone', createdAt: '2025-02-01', totalDeals: 1 },
  { id: 'c5', firstName: 'Ibrahima', lastName: 'Fall', email: 'ibrahima.fall@email.com', phone: '+221 78 567 89 01', source: 'walk-in', createdAt: '2025-02-05', totalDeals: 3 },
  { id: 'c6', firstName: 'Mariama', lastName: 'Diop', email: 'mariama.diop@email.com', phone: '+221 76 678 90 12', source: 'online', createdAt: '2025-02-10', totalDeals: 0 },
]

export const deals: Deal[] = [
  { id: 'd1', vehicleId: 'v1', customerId: 'c1', salesPerson: 'Ousmane Sy', status: 'closed-won', price: 44500000, customerName: 'Amadou Diallo', vehicleName: 'Toyota Land Cruiser 300', createdAt: '2025-01-10' },
  { id: 'd2', vehicleId: 'v2', customerId: 'c2', salesPerson: 'Ousmane Sy', status: 'negotiation', price: 51000000, customerName: 'Fatou Sow', vehicleName: 'Mercedes-Benz GLE 450', createdAt: '2025-01-25' },
  { id: 'd3', vehicleId: 'v3', customerId: 'c3', salesPerson: 'Awa Dieng', status: 'test-drive', price: 37500000, customerName: 'Moussa Ba', vehicleName: 'BMW X5 xDrive40i', createdAt: '2025-02-01' },
  { id: 'd4', vehicleId: 'v4', customerId: 'c4', salesPerson: 'Awa Dieng', status: 'prospect', price: 62000000, customerName: 'Aïssatou Ndiaye', vehicleName: 'Range Rover Sport HSE', createdAt: '2025-02-05' },
  { id: 'd5', vehicleId: 'v5', customerId: 'c5', salesPerson: 'Ousmane Sy', status: 'prospect', price: 22000000, customerName: 'Ibrahima Fall', vehicleName: 'Toyota Hilux Double Cab', createdAt: '2025-02-08' },
  { id: 'd6', vehicleId: 'v7', customerId: 'c6', salesPerson: 'Awa Dieng', status: 'negotiation', price: 17500000, customerName: 'Mariama Diop', vehicleName: 'Hyundai Tucson', createdAt: '2025-02-10' },
  { id: 'd7', vehicleId: 'v6', customerId: 'c1', salesPerson: 'Ousmane Sy', status: 'closed-won', price: 67000000, customerName: 'Amadou Diallo', vehicleName: 'Lexus LX 600', createdAt: '2024-12-20' },
  { id: 'd8', vehicleId: 'v8', customerId: 'c5', salesPerson: 'Awa Dieng', status: 'closed-lost', price: 25000000, customerName: 'Ibrahima Fall', vehicleName: 'Ford Ranger Wildtrak', createdAt: '2025-01-15' },
]

export const recentActivity: Activity[] = [
  { id: 'a1', type: 'sale', message: 'Vente conclue — Lexus LX 600 à Amadou Diallo', time: 'Il y a 2 heures' },
  { id: 'a2', type: 'lead', message: 'Nouveau prospect — Mariama Diop intéressée par Hyundai Tucson', time: 'Il y a 4 heures' },
  { id: 'a3', type: 'appointment', message: 'Essai programmé — Moussa Ba pour BMW X5', time: 'Demain 10h00' },
  { id: 'a4', type: 'vehicle', message: 'Nouveau véhicule ajouté — Ford Ranger Wildtrak', time: 'Hier' },
  { id: 'a5', type: 'sale', message: 'Négociation en cours — Fatou Sow pour Mercedes GLE', time: 'Hier' },
]

export const dealStatusLabels: Record<Deal['status'], string> = {
  'prospect': 'Prospect',
  'negotiation': 'Négociation',
  'test-drive': 'Essai',
  'closed-won': 'Conclu',
  'closed-lost': 'Perdu',
}

export const dealStatusColors: Record<Deal['status'], string> = {
  'prospect': 'bg-blue-100 text-blue-800',
  'negotiation': 'bg-amber-100 text-amber-800',
  'test-drive': 'bg-purple-100 text-purple-800',
  'closed-won': 'bg-emerald-100 text-emerald-800',
  'closed-lost': 'bg-red-100 text-red-800',
}

export const vehicleStatusLabels: Record<Vehicle['status'], string> = {
  'available': 'Disponible',
  'reserved': 'Réservé',
  'sold': 'Vendu',
}

export const vehicleStatusColors: Record<Vehicle['status'], string> = {
  'available': 'bg-emerald-100 text-emerald-800',
  'reserved': 'bg-amber-100 text-amber-800',
  'sold': 'bg-slate-100 text-slate-600',
}
