import { useLiveQuery } from 'dexie-react-hooks'
import db from './db'
import { useProtocolTrackerState } from './use-protocol-tracker-state'

export const useRegimen = () => {
  const { currentPhase } = useProtocolTrackerState()

  const morningActivities = useLiveQuery(
    () => db.regimen.filter((ra) => ra.timeslot == 'morning' && !ra.hidden).toArray(),
    [currentPhase],
  )
  const nightActivities = useLiveQuery(
    () => db.regimen.filter((ra) => ra.timeslot == 'night' && !ra.hidden).toArray(),
    [currentPhase],
  )

  return { morningActivities, nightActivities }
}
