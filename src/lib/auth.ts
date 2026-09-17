import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields()],
  fetchOptions: {
    credentials: 'include',
  },
})

export const { signIn, signUp, signOut, useSession } = authClient
