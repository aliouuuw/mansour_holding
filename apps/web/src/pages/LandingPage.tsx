import { Link } from '@tanstack/react-router'
import {
  Building2,
  Car,
  Home,
  Key,
  Scissors,
  Sparkles,
  HardHat,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

const businesses = [
  {
    name: 'Mansour Motors',
    description: 'Concessionnaire automobile premium — véhicules neufs et d\'occasion',
    icon: Car,
    color: 'bg-blue-500',
    ready: true,
  },
  {
    name: 'Mansour Immobilier',
    description: 'Vente et location de biens résidentiels et commerciaux',
    icon: Home,
    color: 'bg-emerald-500',
    ready: false,
  },
  {
    name: 'Mansour Location',
    description: 'Location de véhicules courte et longue durée',
    icon: Key,
    color: 'bg-purple-500',
    ready: false,
  },
  {
    name: 'Mansour Construction',
    description: 'Projets de construction résidentielle et commerciale',
    icon: HardHat,
    color: 'bg-amber-500',
    ready: false,
  },
  {
    name: 'Mansour Parfums',
    description: 'Fragrances de luxe et parfums d\'exception',
    icon: Sparkles,
    color: 'bg-pink-500',
    ready: false,
  },
  {
    name: 'Mansour Grooming',
    description: 'Salon de coiffure et soins pour hommes',
    icon: Scissors,
    color: 'bg-teal-500',
    ready: false,
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-7 w-7 text-primary-600" />
            <span className="text-lg font-bold text-primary-950">Mansour Holding</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/vehicules"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-primary-900 transition-colors sm:block"
            >
              Véhicules
            </Link>
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-primary-900 transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0zMHY2aC02VjRoNnptMCAxMHY2aC02VjE0aDZ6bTAgMTB2NmgtNlYyNGg2em0tMTAgMHY2aC02VjI0aDZ6bS0xMCAwdjZINlYyNGg2em0yMCAwdjZoLTZWMjRoNnptMTAgMHY2aC02VjI0aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-primary-200 backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              Groupe diversifié basé au Sénégal
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-6xl">
              Construire l'avenir,{' '}
              <span className="text-primary-300">une entreprise à la fois</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-200 lg:text-xl">
              Mansour Holding regroupe un portefeuille d'entreprises dynamiques dans l'automobile,
              l'immobilier, la construction et le commerce de détail. Notre mission : offrir
              l'excellence dans chaque secteur.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/vehicules"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-900 shadow-lg hover:bg-primary-50 transition-colors"
              >
                Voir nos véhicules
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#businesses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                Nos entreprises
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-surface-dim">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4 lg:px-8">
          {[
            { value: '7', label: 'Entreprises' },
            { value: '150+', label: 'Employés' },
            { value: '10+', label: 'Années d\'expérience' },
            { value: '1000+', label: 'Clients satisfaits' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-primary-900 lg:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Businesses */}
      <section id="businesses" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-950 lg:text-4xl">Nos entreprises</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Un portefeuille diversifié d'entreprises, chacune leader dans son domaine,
            unies par une vision commune d'excellence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((biz) => (
            <div
              key={biz.name}
              className="group relative rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`inline-flex rounded-xl ${biz.color} p-3 text-white`}>
                <biz.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-primary-950">{biz.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{biz.description}</p>
              {biz.ready ? (
                <Link
                  to="/vehicules"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Explorer <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <p className="mt-4 text-xs font-medium text-muted/60">Bientôt disponible</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-primary-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold lg:text-4xl">À propos de Mansour Holding</h2>
              <p className="mt-6 text-lg leading-relaxed text-primary-200">
                Fondé avec la vision de créer un groupe d'entreprises de premier plan au Sénégal,
                Mansour Holding s'est développé dans plusieurs secteurs stratégiques. Notre approche
                combine innovation, qualité de service et engagement envers nos communautés.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-primary-200">
                Chaque entreprise du groupe bénéficie de synergies uniques tout en conservant
                son identité propre et son expertise sectorielle.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Innovation', desc: 'Technologies modernes au service de nos clients' },
                { title: 'Excellence', desc: 'Standards élevés dans chaque interaction' },
                { title: 'Intégrité', desc: 'Transparence et confiance au cœur de nos valeurs' },
                { title: 'Communauté', desc: 'Impact positif sur notre environnement local' },
              ].map((val) => (
                <div key={val.title} className="rounded-xl bg-white/5 p-5 backdrop-blur-sm">
                  <h3 className="font-bold text-primary-300">{val.title}</h3>
                  <p className="mt-2 text-sm text-primary-200/80">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-dim">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary-600" />
                <span className="font-bold text-primary-950">Mansour Holding</span>
              </div>
              <p className="mt-3 text-sm text-muted">
                Groupe diversifié basé à Dakar, Sénégal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary-950">Entreprises</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><Link to="/vehicules" className="hover:text-primary-600">Mansour Motors</Link></li>
                <li><span className="text-muted/50">Mansour Immobilier</span></li>
                <li><span className="text-muted/50">Mansour Location</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-950">Liens</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><a href="#businesses" className="hover:text-primary-600">Nos entreprises</a></li>
                <li><Link to="/login" className="hover:text-primary-600">Connexion</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-950">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +221 33 123 45 67</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@mansourholding.com</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dakar, Sénégal</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
            © 2026 Mansour Holding. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
