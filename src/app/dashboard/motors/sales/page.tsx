import { listDealsBoard } from '@/server/deals'
import { MotorsSalesPage } from './sales-shell'

export default async function Page() {
  const board = await listDealsBoard()
  return <MotorsSalesPage initial={board} />
}
