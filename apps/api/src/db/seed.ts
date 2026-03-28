import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import { auth } from '../auth'
import { db } from './index'
import * as schema from './schema-for-migrations'

config({ path: '../../.env' })

// ─── Vehicle seed data ────────────────────────────────────────────────────────
// Mansour Motors inventory: premium SUVs, 4×4, pick-ups and luxury sedans
// Images sourced from Unsplash (free to use) and official press rooms
const vehicleSeed = [
  {
    make: 'Toyota',
    model: 'Land Cruiser 300 GR Sport',
    year: 2024,
    mileage: 1200,
    price: 52000000,
    status: 'available' as const,
    fuelType: 'diesel' as const,
    transmission: 'automatic' as const,
    color: 'Blanc Perle',
    vin: 'JTMAB3FV5RD100001',
    description: 'Land Cruiser 300 GR Sport, full options. Cuir semi-aniline, toit ouvrant panoramique, caméra 360°, suspension KDSS, système multimédia 12.3". Véhicule de direction, première main.',
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=85&fit=crop',
    ],
    extras: { 'Toit ouvrant': 'Panoramique', 'Caméra': '360°', 'Suspension': 'KDSS', 'Sièges': 'Cuir semi-aniline' },
  },
  {
    make: 'Range Rover',
    model: 'Autobiography LWB',
    year: 2024,
    mileage: 500,
    price: 98000000,
    status: 'available' as const,
    fuelType: 'diesel' as const,
    transmission: 'automatic' as const,
    color: 'Vert Belgravia',
    vin: 'SALWA2BK5PA100002',
    description: 'Range Rover Autobiography Long Wheelbase. Cloison exécutive, sièges arrière réclinables massants, Meridian Signature Sound System, toit panoramique fixe. Le summum du luxe automobile.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600&q=85&fit=crop',
    ],
    extras: { 'Cloison': 'Exécutive', 'Sièges arrière': 'Massants réclinables', 'Audio': 'Meridian Signature', 'Toit': 'Panoramique fixe' },
  },
  {
    make: 'BMW',
    model: 'X7 xDrive40i M Sport',
    year: 2024,
    mileage: 2800,
    price: 65000000,
    status: 'available' as const,
    fuelType: 'gasoline' as const,
    transmission: 'automatic' as const,
    color: 'Gris Minéral',
    vin: '5UXCR6C05P9100003',
    description: 'BMW X7 M Sport, 7 places. Toit panoramique Sky Lounge, Bowers & Wilkins Diamond Surround Sound, affichage tête haute, conduite semi-autonome. Parfait état.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&q=85&fit=crop',
    ],
    extras: { 'Toit': 'Sky Lounge panoramique', 'Audio': 'Bowers & Wilkins Diamond', 'Places': '7', 'Conduite': 'Semi-autonome' },
  },
  {
    make: 'Lexus',
    model: 'LX 600 Ultra Luxury',
    year: 2024,
    mileage: 0,
    price: 78000000,
    status: 'available' as const,
    fuelType: 'gasoline' as const,
    transmission: 'automatic' as const,
    color: 'Blanc Sonic',
    vin: 'AHTBB3CD50K100004',
    description: 'Lexus LX 600 Ultra Luxury 4 places. Cloison de séparation, écran 48" arrière, réfrigérateur intégré, sièges ottomans massants. Neuf, jamais immatriculé.',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1600&q=85&fit=crop',
    ],
    extras: { 'Configuration': '4 places VIP', 'Écran arrière': '48"', 'Réfrigérateur': 'Intégré', 'Sièges': 'Ottoman massants' },
  },
  {
    make: 'Mercedes-Benz',
    model: 'GLE 450 AMG Line',
    year: 2024,
    mileage: 3500,
    price: 58000000,
    status: 'available' as const,
    fuelType: 'hybrid' as const,
    transmission: 'automatic' as const,
    color: 'Noir Obsidienne',
    vin: 'W1N1670421A100005',
    description: 'Mercedes GLE 450 AMG Line 4MATIC. Hybride rechargeable, suspension pneumatique E-Active Body Control, Burmester 3D Surround Sound, MBUX avec réalité augmentée.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1600&q=85&fit=crop',
    ],
    extras: { 'Motorisation': 'Hybride rechargeable', 'Suspension': 'E-Active Body Control', 'Audio': 'Burmester 3D', 'Navigation': 'MBUX AR' },
  },
  {
    make: 'Toyota',
    model: 'Hilux GR Sport Double Cab',
    year: 2024,
    mileage: 800,
    price: 28000000,
    status: 'available' as const,
    fuelType: 'diesel' as const,
    transmission: 'automatic' as const,
    color: 'Gris Foncé',
    vin: 'JTFHX02P50K100006',
    description: 'Toyota Hilux GR Sport Double Cab 2.8L 4×4. Édition sportive avec kit carrosserie GR, jantes 18" exclusives, intérieur sport bicolore. Robustesse et style réunis.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1600&q=85&fit=crop',
    ],
    extras: { 'Kit carrosserie': 'GR Sport', 'Jantes': '18" exclusives', 'Intérieur': 'Sport bicolore', 'Transmission': '4×4 permanente' },
  },
  {
    make: 'Jaguar',
    model: 'F-Pace SVR',
    year: 2023,
    mileage: 8500,
    price: 62000000,
    status: 'available' as const,
    fuelType: 'gasoline' as const,
    transmission: 'automatic' as const,
    color: 'Rouge Caldera',
    vin: 'SADCM2BV5HA100007',
    description: 'Jaguar F-Pace SVR 5.0L V8 Supercharged 550ch. Le SUV sport le plus puissant de Jaguar. Performances exceptionnelles, finition Ebony Windsor Leather, système Meridian.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=85&fit=crop',
    ],
    extras: { 'Moteur': 'V8 5.0L Supercharged', 'Puissance': '550 ch', 'Cuir': 'Ebony Windsor', 'Audio': 'Meridian' },
  },
  {
    make: 'Toyota',
    model: 'Land Cruiser 300 ZX',
    year: 2023,
    mileage: 15000,
    price: 46000000,
    status: 'reserved' as const,
    fuelType: 'diesel' as const,
    transmission: 'automatic' as const,
    color: 'Noir Attitude',
    vin: 'JTJBM7FX5R5100008',
    description: 'Land Cruiser 300 ZX finition haute. Cuir semi-aniline, caméra 360°, suspension KDSS, système multimédia 12.3". Entretien Toyota, carnet complet.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=85&fit=crop',
    ],
    extras: { 'Finition': 'ZX', 'Caméra': '360°', 'Suspension': 'KDSS' },
  },
]

async function seed() {
  console.log('Starting database seed...')

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mansour.sn'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'
  const adminName = process.env.ADMIN_NAME || 'Admin User'

  try {
    // ── Admin user ──────────────────────────────────────────────────────────
    const [existingUser] = await db
      .select({ id: schema.user.id, email: schema.user.email })
      .from(schema.user)
      .where(eq(schema.user.email, adminEmail))
      .limit(1)

    if (existingUser) {
      console.log(`Removing existing admin user: ${adminEmail}`)
      // Null out FK references before deleting the user
      await db
        .update(schema.vehicles)
        .set({ createdBy: null })
        .where(eq(schema.vehicles.createdBy, existingUser.id))
      await db.delete(schema.account).where(eq(schema.account.userId, existingUser.id))
      await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id))
      await db.delete(schema.user).where(eq(schema.user.id, existingUser.id))
    }

    console.log(`Creating admin user: ${adminEmail}`)
    await auth.api.signUpEmail({
      body: { email: adminEmail, password: adminPassword, name: adminName },
    })
    console.log('✅ Admin user created')

    // ── Vehicles ────────────────────────────────────────────────────────────
    // Get the newly created admin user id for createdBy
    const [admin] = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, adminEmail))
      .limit(1)

    // Clear existing seeded vehicles (those with our seed VINs)
    const seedVins = vehicleSeed.map(v => v.vin)
    for (const vin of seedVins) {
      await db.delete(schema.vehicles).where(eq(schema.vehicles.vin, vin))
    }

    console.log('Seeding vehicles...')
    for (const { extras, ...v } of vehicleSeed) {
      await db.insert(schema.vehicles).values({
        ...v,
        extras: extras as unknown as Record<string, string>,
        createdBy: admin.id,
      })
      console.log(`  ✅ ${v.make} ${v.model}`)
    }

    console.log(`\n✅ Seed complete — ${vehicleSeed.length} vehicles inserted`)
    console.log(`   Login: ${adminEmail} / ${adminPassword}`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
