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
    model: 'GLE 450',
    year: 2024,
    mileage: 800,
    price: 52000000,
    status: 'available',
    fuelType: 'Essence',
    transmission: 'Automatique',
    color: 'Noir Obsidienne',
    vin: 'W1N1670421A234567',
    description: 'GLE 450 AMG Line, pack premium, Burmester, suspension pneumatique',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
  },
  {
    id: 'v3',
    make: 'BMW',
    model: 'X5 xDrive40i',
    year: 2023,
    mileage: 15000,
    price: 38000000,
    status: 'reserved',
    fuelType: 'Essence',
    transmission: 'Automatique',
    color: 'Gris Phytonic',
    vin: '5UXCR6C05P9B34567',
    description: 'X5 M Sport, toit panoramique, affichage tête haute, Harman Kardon',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
  },
  {
    id: 'v4',
    make: 'Range Rover',
    model: 'Sport HSE',
    year: 2024,
    mileage: 500,
    price: 62000000,
    status: 'available',
    fuelType: 'Diesel',
    transmission: 'Automatique',
    color: 'Vert Britannique',
    vin: 'SALWA2BK5PA456789',
    description: 'Range Rover Sport HSE Dynamic, Meridian, sièges ventilés, suspension adaptative',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
  },
  {
    id: 'v5',
    make: 'Toyota',
    model: 'Hilux Double Cab',
    year: 2024,
    mileage: 0,
    price: 22000000,
    status: 'available',
    fuelType: 'Diesel',
    transmission: 'Manuelle',
    color: 'Gris Titane',
    vin: 'AHTBB3CD50K567890',
    description: 'Hilux DC 2.8 GD-6 Legend, caméra de recul, Apple CarPlay',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=300&fit=crop',
  },
  {
    id: 'v6',
    make: 'Lexus',
    model: 'LX 600',
    year: 2024,
    mileage: 3000,
    price: 68000000,
    status: 'sold',
    fuelType: 'Essence',
    transmission: 'Automatique',
    color: 'Blanc Sonic',
    vin: 'JTJBM7FX5R5678901',
    description: 'LX 600 F Sport, Mark Levinson, sièges massants, vision nocturne',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
  },
  {
    id: 'v7',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    mileage: 5000,
    price: 18000000,
    status: 'available',
    fuelType: 'Essence',
    transmission: 'Automatique',
    color: 'Bleu Intense',
    vin: 'KM8J3CAL5PU789012',
    description: 'Tucson Premium, toit panoramique, BOSE, conduite semi-autonome',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop',
  },
  {
    id: 'v8',
    make: 'Ford',
    model: 'Ranger Wildtrak',
    year: 2023,
    mileage: 12000,
    price: 25000000,
    status: 'available',
    fuelType: 'Diesel',
    transmission: 'Automatique',
    color: 'Orange Sedona',
    vin: 'MNCLMFF60PW890123',
    description: 'Ranger Wildtrak V6, SYNC 4, caméra 360°, différentiel arrière bloquant',
    image: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&h=300&fit=crop',
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
