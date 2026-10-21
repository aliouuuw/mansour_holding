'use client'

import { Link, useNavigate } from '@/lib/router'
import { ViewIcon, ViewOffIcon } from 'hugeicons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from '@/lib/auth'
import { DashButton, mmInputClass, mmLabelClass } from '@/components/dashboard'

type LoginForm = {
  email: string
  password: string
  rememberMe?: boolean
}

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: { rememberMe: true } })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    setIsLoading(true)
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/dashboard/motors',
        rememberMe: data.rememberMe,
      })
      if (result.error) {
        setError('Email ou mot de passe incorrect.')
        return
      }
      navigate({ to: '/dashboard/motors' })
    } catch (err) {
      setError('Connexion impossible. Vérifiez le réseau, puis réessayez.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-6">
          <Link to="/" aria-label="Mansour Motors, site public">
            <img src="/mansour-motors/logo-header.png" alt="" width={469} height={429} className="h-10 w-auto" decoding="async" />
          </Link>
          <div>
            <h1 className="mm-title">Espace pro</h1>
            <p className="mm-lead">Inventaire, clients et ventes du showroom.</p>
          </div>
        </div>

        <form className="mm-panel mm-panel-pad space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && <div className="mm-alert-error" role="alert">{error}</div>}

          <div>
            <label htmlFor="login-email" className={mmLabelClass}>Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={mmInputClass}
              aria-invalid={errors.email ? true : undefined}
              {...register('email', {
                required: 'Email requis',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' },
              })}
            />
            {errors.email && <p className="mm-field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className={mmLabelClass}>Mot de passe</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={`${mmInputClass} pr-12`}
                aria-invalid={errors.password ? true : undefined}
                {...register('password', { required: 'Mot de passe requis' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="mm-icon-btn absolute right-0 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-pressed={showPassword}
              >
                {showPassword ? <ViewOffIcon className="h-4 w-4" aria-hidden="true" /> : <ViewIcon className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p className="mm-field-error">{errors.password.message}</p>}
          </div>

          <label className="flex min-h-[var(--mm-touch)] items-center gap-3 text-sm text-[var(--mm-grey)]">
            <input type="checkbox" className="h-4 w-4 accent-[var(--mm-ink)]" {...register('rememberMe')} />
            Rester connecté
          </label>

          <DashButton type="submit" disabled={isLoading} full>
            {isLoading ? 'Connexion…' : 'Se connecter'}
          </DashButton>
        </form>

        <p className="text-sm text-[var(--mm-grey)]">
          Mot de passe oublié : demandez à l&apos;administrateur du showroom.
        </p>
      </div>
    </main>
  )
}

export default LoginPage
