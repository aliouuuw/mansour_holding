import Link from 'next/link'
import { Car01Icon } from 'hugeicons-react'
import { MotorsNavbar } from '@/components/motors/MotorsNavbar'
import { MotorsFooter } from '@/components/motors/MotorsFooter'

export default function NotFound() {
  return (
    <div className="motors-theme flex min-h-screen flex-col bg-carbon-950 font-motors text-silver-100">
      <MotorsNavbar />
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center border border-white/[0.06] bg-carbon-900">
          <Car01Icon className="h-8 w-8 text-silver-600" />
        </div>
        <p className="font-motors-display text-xl uppercase tracking-wide text-white">Véhicule non trouvé</p>
        <Link
          href="/mansour-motors/vehicules"
          className="mt-4 font-motors text-xs font-bold uppercase tracking-widest text-gold-600 transition-colors hover:text-gold-500"
        >
          Retour au catalogue
        </Link>
      </div>
      <MotorsFooter />
    </div>
  )
}
