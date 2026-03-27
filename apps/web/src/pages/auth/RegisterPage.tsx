import { Link, useNavigate } from '@tanstack/react-router'
import { Building03Icon, ViewIcon, ViewOffIcon } from 'hugeicons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signUp } from '@/lib/auth.js'

type RegisterForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>()

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    setIsLoading(true)
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        callbackURL: '/dashboard',
      })
      if (result.error) {
        setError(result.error.message || "Erreur d'inscription")
        return
      }
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error('Register error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-noir-950">
      <div className="flex w-full items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12 flex flex-col items-center">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <Building03Icon className="h-8 w-8 text-gold-400" />
              <span className="text-xl font-bold uppercase tracking-widest text-white">Mansour Holding</span>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
              <p className="mt-3 text-sm text-silver-400">
                Remplissez le formulaire pour créer votre espace
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-silver-400 mb-2">Prénom</label>
                <input
                  type="text"
                  placeholder="Aliou"
                  className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-400 focus:bg-white/10"
                  {...register('firstName', { required: 'Prénom requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-silver-400 mb-2">Nom</label>
                <input
                  type="text"
                  placeholder="Wade"
                  className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-400 focus:bg-white/10"
                  {...register('lastName', { required: 'Nom requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-silver-400 mb-2">Adresse Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-400 focus:bg-white/10"
                {...register('email', {
                  required: 'Email requis',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Adresse email invalide' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-silver-400 mb-2">Téléphone</label>
              <input
                type="tel"
                placeholder="+221 77 123 45 67"
                className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-400 focus:bg-white/10"
                {...register('phone', { required: 'Téléphone requis', minLength: { value: 8, message: 'Numéro invalide' } })}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-silver-400 mb-2">Mot de Passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-400 focus:bg-white/10"
                  {...register('password', {
                    required: 'Mot de passe requis',
                    minLength: { value: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 hover:text-white"
                >
                  {showPassword ? <ViewOffIcon className="h-4 w-4" /> : <ViewIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              <p className="mt-1.5 text-xs text-silver-500">Minimum 8 caractères</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="block w-full rounded-sm bg-gold-400 px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-noir-950 shadow-sm hover:bg-gold-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-silver-400">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-gold-400 hover:text-gold-300">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
