/* Records are the real seed rows from src/server/db/seed.ts.
   Two fields are adjusted for the prototype and marked so:
   - `color` is set to the colour of the sourced photograph, so the page is internally coherent.
   - `swatch` is a hex approximation of that colour name, added as design material for
     the colour chip. It is not a manufacturer paint value.
   - waypoint 08 is shown as `sold` to exercise the VENDU stamp; the seed row says `reserved`.
   Photographs are studio restages of model-accurate Wikimedia Commons files (black
   cyclorama, 4:3). They are not a Dakar shoot. The seed "Land Cruiser" is a Porsche 911. */

const plate = (n) => `/media/cars/${n}.png`
/* `face`: the side the car's nose points to in its photograph. The plateau mirrors photos so side cars face the front one. */

export const waypoints = [
  {
    n: 1, make: 'Toyota', model: 'Land Cruiser 300 GR Sport',
    year: 2024, km: 1200, price: 52000000, status: 'available',
    fuel: 'diesel', gearbox: 'automatic', color: 'Blanc Perle',
    vin: 'JTMAB3FV5RD100001',
    note: "Finition GR Sport. Verrouillage de differentiel avant et arriere. Livre avec deux jeux de cles et le carnet d'entretien complet.",
    swatch: '#E8E6E0',
    pos: '50% 52%', zoom: 1,
    img: plate(1), face: 'left',
  },
  {
    n: 2, make: 'Range Rover', model: 'Autobiography LWB',
    year: 2024, km: 500, price: 98000000, status: 'available',
    fuel: 'diesel', gearbox: 'automatic', color: 'Noir Santorini',
    vin: 'SALWA2BK5PA100002',
    note: "Empattement long. Sieges arriere executifs inclinables. Vehicule de direction, premiere main.",
    swatch: '#14161A',
    pos: '48% 52%', zoom: 1,
    img: plate(2), face: 'left',
  },
  {
    n: 3, make: 'BMW', model: 'X7 xDrive40i M Sport',
    year: 2024, km: 2800, price: 65000000, status: 'available',
    fuel: 'gasoline', gearbox: 'automatic', color: 'Noir Saphir',
    vin: '5UXCR6C05P9100003',
    note: "Sept places. Pack M Sport complet. Suspension pneumatique aux deux essieux.",
    swatch: '#101318',
    pos: '55% 52%', zoom: 1,
    img: plate(3), face: 'right',
  },
  {
    n: 4, make: 'Lexus', model: 'LX 600 Ultra Luxury',
    year: 2024, km: 0, price: 78000000, status: 'available',
    fuel: 'gasoline', gearbox: 'automatic', color: 'Gris Atomic',
    vin: 'AHTBB3CD50K100004',
    note: "Zero kilometre. Configuration quatre places Ultra Luxury. Non immatricule a ce jour.",
    swatch: '#6E6B62',
    pos: '50% 52%', zoom: 1,
    img: plate(4), face: 'left',
  },
  {
    n: 5, make: 'Mercedes-Benz', model: 'GLE 450 AMG Line',
    year: 2024, km: 3500, price: 58000000, status: 'available',
    fuel: 'hybrid', gearbox: 'automatic', color: 'Noir Obsidienne',
    vin: 'W1N1670421A100005',
    note: "Hybride leger 48 V. Ligne AMG exterieure et interieure. Entretien Mercedes a jour.",
    swatch: '#0E0F10',
    pos: '50% 52%', zoom: 1,
    img: plate(5), face: 'left',
  },
  {
    n: 6, make: 'Toyota', model: 'Hilux GR Sport Double Cab',
    year: 2024, km: 800, price: 28000000, status: 'available',
    fuel: 'diesel', gearbox: 'automatic', color: 'Blanc Nacre',
    vin: 'JTFHX02P50K100006',
    note: "Double cabine. Voie elargie et amortisseurs GR. Le pick-up de la gamme Gazoo Racing.",
    swatch: '#EDEBE4',
    pos: '58% 52%', zoom: 1,
    img: plate(6), face: 'right',
  },
  {
    n: 7, make: 'Jaguar', model: 'F-Pace SVR',
    year: 2023, km: 8500, price: 62000000, status: 'available',
    fuel: 'gasoline', gearbox: 'automatic', color: 'Bleu Ultra',
    vin: 'SADCM2BV5HA100007',
    note: "V8 suralimente. Echappement variable SVR. Carnet complet, une seule main.",
    swatch: '#1B4FA3',
    pos: '50% 52%', zoom: 1,
    img: plate(7), face: 'left',
  },
  {
    n: 8, make: 'Toyota', model: 'Land Cruiser 300 ZX',
    year: 2023, km: 15000, price: 46000000, status: 'sold',
    fuel: 'diesel', gearbox: 'automatic', color: 'Noir Attitude',
    vin: 'JTJBM7FX5R5100008',
    note: "Finition ZX sept places. Vendu en septembre. Conserve au carnet comme reference de prix.",
    swatch: '#0D0E0F',
    pos: '50% 52%', zoom: 1,
    img: plate(8), face: 'left',
  },
]

export const FR = {
  fuel: { diesel: 'Diesel', gasoline: 'Essence', hybrid: 'Hybride', electric: 'Electrique' },
  gearbox: { automatic: 'Automatique', manual: 'Manuelle', cvt: 'CVT' },
  status: { available: 'Disponible', reserved: 'Reserve', sold: 'Vendu' },
}
