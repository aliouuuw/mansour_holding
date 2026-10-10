import { expect, test } from 'bun:test'
import { buildKbbLink, computeKbbDuties, isSuvBodyClass, kbbMileage, kbbModelKey, parseKbbOffersUrl } from './kbb'

test('kbbMileage uses 25 000 per year of age', () => {
  expect(kbbMileage(2024, 2026)).toBe(50000)
  expect(kbbMileage(2027, 2026)).toBe(0)
})

test('computeKbbDuties matches the GLE 450 example (CV 44 790 USD, SUV)', () => {
  // (44790 * 600 + 900000) * 64.38% = 17 880 901.2 ; remise = DD - 35%
  expect(computeKbbDuties(44790, true)).toEqual({
    valueFcfa: 26874000,
    fees: 900000,
    base: 27774000,
    dd: 17880901,
    remise: 11622586,
  })
})

test('computeKbbDuties uses 700 000 fees for non-SUV', () => {
  expect(computeKbbDuties(44790, false).dd).toBe(Math.round(27574000 * 0.6438))
})

test('isSuvBodyClass reads the NHTSA body class', () => {
  expect(isSuvBodyClass('Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]')).toBe(true)
  expect(isSuvBodyClass('Sedan/Saloon')).toBe(false)
})

const GLE_LINK =
  'https://www.kbb.com/mercedes-benz/gle/2024/gle-450-4matic-sport-utility-4d/car-offers/?vehicleid=466280&mileage=50000&vin=4jgfb5kb3rb243802&intent=trade-in-sell&pricetype=trade-in&condition=good&options=11510625%7Ctrue%7C11510631%7Ctrue&extcolor=black'

test('parseKbbOffersUrl keeps only kbb.com links with a vehicleid', () => {
  expect(parseKbbOffersUrl(` ${GLE_LINK} `)).toBe(new URL(GLE_LINK).toString())
  expect(parseKbbOffersUrl('https://www.kbb.com/whats-my-car-worth/')).toBeNull()
  expect(parseKbbOffersUrl('https://evil.example/?vehicleid=1')).toBeNull()
  expect(parseKbbOffersUrl('pas une adresse')).toBeNull()
})

test('buildKbbLink swaps VIN and mileage, keeps KBB ids and options', () => {
  const url = new URL(buildKbbLink(GLE_LINK, { vin: '4JGFB5KB0RB999999', mileage: 25000 }))
  expect(url.searchParams.get('vin')).toBe('4jgfb5kb0rb999999')
  expect(url.searchParams.get('mileage')).toBe('25000')
  expect(url.searchParams.get('vehicleid')).toBe('466280')
  expect(url.searchParams.get('options')).toBe('11510625|true|11510631|true')
})

test('kbbModelKey ignores the VIN and normalises case', () => {
  const car = { year: 2024, make: 'MERCEDES-BENZ', model: 'GLE-Class', trim: 'GLE450 4MATIC', drive: 'AWD', cab: '', engine: '3 L 6 cyl.' }
  expect(kbbModelKey(car)).toBe('2024|MERCEDES-BENZ|GLE-CLASS|GLE450 4MATIC|AWD||3 L 6 CYL.')
})

test('kbbModelKey separates trim-less versions by drive, cab and engine', () => {
  const f150 = { year: 2018, make: 'FORD', model: 'F-150', trim: '', drive: '4WD', cab: 'Extra', engine: '5 L 8 cyl.' }
  expect(kbbModelKey(f150)).not.toBe(kbbModelKey({ ...f150, engine: '3.5 L 6 cyl.' }))
  expect(kbbModelKey(f150)).not.toBe(kbbModelKey({ ...f150, drive: '4x2' }))
})
