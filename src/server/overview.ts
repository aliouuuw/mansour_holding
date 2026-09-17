'use server'

import { desc, eq, sql } from 'drizzle-orm'
import { db } from './db/index'
import { vehicles, customers, deals } from './db/schema'
import { requireUser } from './session'

export type HoldingOverview = {
  vehicleTotal: number
  customerTotal: number
  dealTotal: number
  closedWon: number
  totalRevenue: number
}

export type MotorsOverviewDeal = {
  id: string
  price: number
  status: 'lead' | 'negotiation' | 'closed-won' | 'closed-lost'
  vehicleName: string | null
  customerName: string | null
}

export type MotorsOverviewVehicle = {
  id: string
  make: string
  model: string
  year: number
  price: number
  images: string[]
}

export type MotorsOverview = {
  vehicleTotal: number
  availableCount: number
  customerTotal: number
  dealTotal: number
  activeDeals: number
  lead: number
  negotiation: number
  'closed-won': number
  'closed-lost': number
  totalRevenue: number
  recentDeals: MotorsOverviewDeal[]
  availableVehicles: MotorsOverviewVehicle[]
}

async function dealPipeline() {
  const [rows, [{ totalRevenue }]] = await Promise.all([
    db
      .select({ status: deals.status, count: sql<number>`count(*)::int` })
      .from(deals)
      .groupBy(deals.status),
    db
      .select({ totalRevenue: sql<number>`coalesce(sum(price), 0)::int` })
      .from(deals)
      .where(eq(deals.status, 'closed-won')),
  ])

  const pipeline = { lead: 0, negotiation: 0, 'closed-won': 0, 'closed-lost': 0 }
  for (const row of rows) pipeline[row.status] = row.count
  const dealTotal = pipeline.lead + pipeline.negotiation + pipeline['closed-won'] + pipeline['closed-lost']
  return { ...pipeline, dealTotal, totalRevenue, activeDeals: pipeline.lead + pipeline.negotiation }
}

export async function getHoldingOverview(): Promise<HoldingOverview> {
  await requireUser()
  const [[{ vehicleTotal }], [{ customerTotal }], pipeline] = await Promise.all([
    db.select({ vehicleTotal: sql<number>`count(*)::int` }).from(vehicles),
    db.select({ customerTotal: sql<number>`count(*)::int` }).from(customers),
    dealPipeline(),
  ])
  return {
    vehicleTotal,
    customerTotal,
    dealTotal: pipeline.dealTotal,
    closedWon: pipeline['closed-won'],
    totalRevenue: pipeline.totalRevenue,
  }
}

export async function getMotorsOverview(): Promise<MotorsOverview> {
  await requireUser()
  const [[{ vehicleTotal }], [{ availableCount }], [{ customerTotal }], pipeline, dealRows, vehicleRows] = await Promise.all([
    db.select({ vehicleTotal: sql<number>`count(*)::int` }).from(vehicles),
    db.select({ availableCount: sql<number>`count(*)::int` }).from(vehicles).where(eq(vehicles.status, 'available')),
    db.select({ customerTotal: sql<number>`count(*)::int` }).from(customers),
    dealPipeline(),
    db
      .select({
        id: deals.id,
        price: deals.price,
        status: deals.status,
        vehicleMake: vehicles.make,
        vehicleModel: vehicles.model,
        vehicleYear: vehicles.year,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
      })
      .from(deals)
      .leftJoin(vehicles, eq(deals.vehicleId, vehicles.id))
      .leftJoin(customers, eq(deals.customerId, customers.id))
      .orderBy(desc(deals.createdAt))
      .limit(5),
    db
      .select({
        id: vehicles.id,
        make: vehicles.make,
        model: vehicles.model,
        year: vehicles.year,
        price: vehicles.price,
        images: vehicles.images,
      })
      .from(vehicles)
      .where(eq(vehicles.status, 'available'))
      .orderBy(desc(vehicles.createdAt))
      .limit(3),
  ])

  return {
    vehicleTotal,
    availableCount,
    customerTotal,
    dealTotal: pipeline.dealTotal,
    activeDeals: pipeline.activeDeals,
    lead: pipeline.lead,
    negotiation: pipeline.negotiation,
    'closed-won': pipeline['closed-won'],
    'closed-lost': pipeline['closed-lost'],
    totalRevenue: pipeline.totalRevenue,
    recentDeals: dealRows.map((row) => ({
      id: row.id,
      price: row.price,
      status: row.status,
      vehicleName: row.vehicleMake ? `${row.vehicleMake} ${row.vehicleModel} ${row.vehicleYear}` : null,
      customerName: row.customerFirstName ? `${row.customerFirstName} ${row.customerLastName}` : null,
    })),
    availableVehicles: vehicleRows.map((row) => ({
      ...row,
      images: row.images ?? [],
    })),
  }
}
