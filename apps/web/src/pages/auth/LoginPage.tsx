import { Link } from '@tanstack/react-router'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary-300" />
          <span className="text-xl font-bold text-white">Mansour Holding</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Gérez toutes vos entreprises depuis une seule plateforme
          </h2>
          <p className="mt-4 text-lg text-primary-200">
            Accédez à vos tableaux de bord, suivez vos ventes et gérez vos clients en temps réel.
          </p>
        </div>
        <p className="text-sm text-primary-300">© 2026 Mansour Holding</p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <Building2 className="h-7 w-7 text-primary-600" />
              <span className="text-lg font-bold text-primary-950">Mansour Holding</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-primary-950">Connexion</h1>
          <p className="mt-2 text-sm text-muted">
            Entrez vos identifiants pour accéder à votre espace
          </p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-primary-900">
                Adresse email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-primary-900">
                  Mot de passe
                </label>
                <button type="button" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-white px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary-900"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember" className="text-sm text-muted">
                Se souvenir de moi
              </label>
            </div>

            <Link
              to="/dashboard"
              className="block w-full rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
            >
              Se connecter
            </Link>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
