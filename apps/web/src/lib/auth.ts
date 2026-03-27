import { createAuthClient } from 'better-auth/react'

/**
 * Better-auth client for React
 * Provides methods for signIn, signUp, signOut, and session management
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

// Export commonly used methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient
