import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  plugins: [inferAdditionalFields()],
  fetchOptions: {
    credentials: 'include',
    onRequest(context) {
      // Attach bearer token if available (for cross-domain auth)
      const token = localStorage.getItem('better-auth-token')
      if (token) {
        context.headers.set('Authorization', `Bearer ${token}`)
      }
    },
    onSuccess(context) {
      // Store token from response headers if present
      const token = context.response.headers.get('set-auth-token')
      if (token) {
        localStorage.setItem('better-auth-token', token)
      }
    },
  },
})

export const { signIn, signUp, signOut, useSession } = authClient
