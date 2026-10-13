import type { ApiVehicle } from '@/lib/api'
import { MOTORS_SITE } from '@/lib/motors-public-host'
import { spotlightSrc } from '@/server/vehicle-image'
import { CONAKRY, CONTACT, FUEL, GEARBOX, HOURS, pad2, vehicleUrl } from './_ui/shared'

/* child openGraph replaces the layout's whole object, so pages spread this base */
export const og = { type: 'website', siteName: 'Mansour Motors', locale: 'fr_SN' } as const

const abs = (src: string) => new URL(src, MOTORS_SITE).href

/* raw upload for social cards: crawlers want a plain JPEG, not the optimizer URL */
export const shareImage = (v: ApiVehicle) => {
  const src = spotlightSrc(v.extras, v.images)
  return src ? abs(src) : undefined
}

/* `<` escaped so a description cannot close the script tag */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAKAR = `${MOTORS_SITE}/#dakar`

/* two showrooms. Dakar is UTC+0, so HOURS read as local time. Conakry hours are not published. */
export const dealerLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AutoDealer',
      '@id': DAKAR,
      name: 'Mansour Motors',
      url: MOTORS_SITE,
      logo: abs('/mansour-motors/logo.jpeg'),
      image: abs('/mansour-motors/hero-still.jpg'),
      telephone: CONTACT.tel.replace('tel:', ''),
      email: CONTACT.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Route de la Corniche Ouest',
        addressLocality: 'Almadies, Dakar',
        addressCountry: 'SN',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 14.7347277, longitude: -17.5085261 },
      hasMap: CONTACT.maps,
      openingHoursSpecification: Object.entries(HOURS).map(([d, [open, close]]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${DAYS[Number(d)]}`,
        opens: `${pad2(open)}:00`,
        closes: `${pad2(close)}:00`,
      })),
      sameAs: [CONTACT.instagram],
    },
    {
      '@type': 'AutoDealer',
      '@id': `${MOTORS_SITE}/#conakry`,
      name: 'Mansour Motors Conakry',
      url: MOTORS_SITE,
      telephone: CONAKRY.tel.replace('tel:', ''),
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3e Avenue',
        addressLocality: 'Kaloum, Conakry',
        addressCountry: 'GN',
      },
      hasMap: CONAKRY.maps,
    },
  ],
}

const AVAILABILITY = { available: 'InStock', reserved: 'LimitedAvailability', sold: 'SoldOut' } as const

export function carLd(v: ApiVehicle) {
  const url = `${MOTORS_SITE}${vehicleUrl(v)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${v.make} ${v.model} ${v.year}`,
    url,
    brand: { '@type': 'Brand', name: v.make },
    model: v.model,
    vehicleModelDate: String(v.year),
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.mileage, unitCode: 'KMT' },
    fuelType: FUEL[v.fuelType],
    vehicleTransmission: GEARBOX[v.transmission],
    color: v.color || undefined,
    description: v.description || undefined,
    image: v.images.map(abs),
    /* an Offer without a price is invalid: a car on "prix sur demande" ships without one */
    offers:
      v.price == null
        ? undefined
        : {
            '@type': 'Offer',
            url,
            price: v.price,
            priceCurrency: 'XOF',
            availability: `https://schema.org/${AVAILABILITY[v.status]}`,
            seller: { '@id': DAKAR },
          },
  }
}
