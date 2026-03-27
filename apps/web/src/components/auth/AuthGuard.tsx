import { Navigate } from '@tanstack/react-router'
import { useSession } from '@/lib/auth.js'
import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Auth Guard component
 * Redirects to login if user is not authenticated
 * Shows loading state while checking session
 */
export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data, isPending } = useSession()

  // Show loading state or fallback while checking session
  if (isPending) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!data?.user) {
    return <Navigate to="/login" />
  }

  // Render children if authenticated
  return <>{children}</>
}
