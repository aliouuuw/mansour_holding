import { Link } from '@tanstack/react-router'
import { Buildings } from '@phosphor-icons/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen bg-noir-950">
      {/* Centered form */}
      <div className="flex w-full items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12 flex flex-col items-center">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <Buildings className="h-8 w-8 text-gold-400" weight="duotone" />
              <span className="text-xl font-bold uppercase tracking-widest text-white">Mansour Holding</span>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Espace Professionnel</h1>
              <p className="mt-3 text-sm text-silver-400">
                Connectez-vous pour accéder à votre tableau de bord
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-silver-400 mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-400 focus:bg-white/10 focus:ring-2 focus:ring-gold-400/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-silver-400">
                  Mot de Passe
                </label>
                <button type="button" className="text-xs font-medium text-gold-400 hover:text-gold-300">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-400 focus:bg-white/10 focus:ring-2 focus:ring-gold-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded-sm border-white/10 bg-white/5 text-gold-400 focus:ring-gold-400"
              />
              <label htmlFor="remember" className="text-sm text-silver-400">
                Se souvenir de moi
              </label>
            </div>

            <Link
              to="/dashboard"
              className="block w-full rounded-sm bg-gold-400 px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-noir-950 shadow-sm hover:bg-gold-300 transition-colors"
            >
              Se Connecter
            </Link>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-silver-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-semibold text-gold-400 hover:text-gold-300">
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-xs text-silver-500">
              © {new Date().getFullYear()} Mansour Holding. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
