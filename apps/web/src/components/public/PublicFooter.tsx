import { Link } from '@tanstack/react-router'
import {
  Buildings,
  Phone,
  Envelope,
  MapPin,
} from '@phosphor-icons/react'

export function PublicFooter() {
  return (
    <footer className="bg-surface-dim px-6 py-24 lg:px-12">
      <div className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 hover-trigger">
            <Buildings className="h-8 w-8 text-gold-400" weight="duotone" />
            <span className="text-lg font-bold uppercase tracking-widest text-noir-950">
              Mansour Holding
            </span>
          </Link>
          <p className="mt-8 max-w-sm text-noir-500 font-light">
            Groupe diversifié basé à Dakar, Sénégal. Excellence et performance dans chaque
            secteur.
          </p>
        </div>

        <div>
          <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-noir-400">
            Navigation
          </h4>
          <ul className="space-y-4">
            {['Portfolio', 'À propos', 'Carrières', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-noir-600 transition-colors hover:text-gold-400 hover-trigger inline-block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-noir-400">
            Contact
          </h4>
          <ul className="space-y-4 text-noir-600">
            <li className="flex items-center gap-3 hover-trigger">
              <Phone className="h-4 w-4 text-gold-400" weight="fill" />
              +221 33 123 45 67
            </li>
            <li className="flex items-center gap-3 hover-trigger">
              <Envelope className="h-4 w-4 text-gold-400" weight="fill" />
              contact@mansour.sn
            </li>
            <li className="flex items-center gap-3 hover-trigger">
              <MapPin className="h-4 w-4 text-gold-400" weight="fill" />
              Dakar, Sénégal
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 border-t border-noir-200 pt-8 md:flex-row">
        <p className="text-sm text-noir-400">
          © {new Date().getFullYear()} Mansour Holding. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          {['LinkedIn', 'Twitter', 'Instagram'].map((social) => (
            <a
              key={social}
              href="#"
              className="text-sm font-medium text-noir-600 hover:text-gold-400 hover-trigger"
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
