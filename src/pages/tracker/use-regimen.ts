import { useLiveQuery } from 'dexie-react-hooks'
import db from './db'

export const useRegimen = () => {
  const morningActivities = useLiveQuery(() => db.regimen.filter((ra) => ra.timeslot == 'morning').toArray(), [])
  const nightActivities = useLiveQuery(() => db.regimen.filter((ra) => ra.timeslot == 'night').toArray(), [])

  return { morningActivities, nightActivities }
}
