import { listDealsBoard } from '@/server/deals'
import { unwrap } from '@/server/action-result'
import { MotorsSalesPage } from './sales-shell'

export default async function Page() {
  const board = await unwrap(listDealsBoard())
  return <MotorsSalesPage initial={board} />
}
