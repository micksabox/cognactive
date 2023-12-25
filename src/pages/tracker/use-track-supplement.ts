import { useLiveQuery } from 'dexie-react-hooks'
import db, { RegimenActivities } from './db' // Import your Dexie database instance

export const useTrackSupplement = (dateKey: string) => {
  const parsedDate = new Date(dateKey).toISOString().split('T')[0]

  const supplements = useLiveQuery(() => db.supplements.where({ date: parsedDate }).toArray(), [parsedDate])

  const activities: RegimenActivities = {
    oreganoOil: false,
    nac: false,
    blackSeedOil: false,
    nightOreganoOil: false,
    nightNac: false,
    nightBlackSeedOil: false,
  }

  supplements?.forEach((s) => {
    activities[s.name] = true
  })

  return { supplements, activities, addSupplementActivity: db.addSupplement }
}
