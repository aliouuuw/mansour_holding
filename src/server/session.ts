import { headers } from 'next/headers'
import { auth } from './auth'
import { UserError } from './action-result'

export async function currentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ? session.user : null
}

export async function requireUser() {
  const user = await currentUser()
  if (!user) throw new UserError('Session expirée. Reconnectez-vous.')
  return user
}
