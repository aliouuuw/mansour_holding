import { redirect } from 'next/navigation'
import { listDealsBoard } from '@/server/deals'
import { unwrap } from '@/server/action-result'
import { currentUser } from '@/server/session'
import { MotorsSalesPage } from './sales-shell'

export default async function Page() {
  /* the only dashboard page that loads data on the server: an expired session goes to login, not to the error page */
  if (!(await currentUser())) redirect('/login')
  const board = await unwrap(listDealsBoard())
  return <MotorsSalesPage initial={board} />
}
