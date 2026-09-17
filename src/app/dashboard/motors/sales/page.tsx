import { listDealsBoard } from '@/server/deals'
import { MotorsSales } from './board'

export default async function Page() {
  const board = await listDealsBoard()
  return <MotorsSales initial={board} />
}
