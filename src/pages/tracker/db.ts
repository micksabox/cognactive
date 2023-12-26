import Dexie from 'dexie'

export type RegimenActivities = {
  oreganoOil: boolean
  nac: boolean
  blackSeedOil: boolean
  nightOreganoOil: boolean
  nightNac: boolean
  nightBlackSeedOil: boolean
}

export interface ISupplement {
  id?: number
  date: string
  name: keyof RegimenActivities
  dosage: string
}

export interface ISymptom {
  id?: number
  date: string
  type: string
  severity: number
  custom: number
}

export interface IBreakthrough {
  id?: number
  date: string
  description: string
}

// Define the database
class NACTrackDB extends Dexie {
  supplements: Dexie.Table<ISupplement, number>
  symptoms: Dexie.Table<ISymptom, number>
  breakthroughs: Dexie.Table<IBreakthrough, number>

  constructor() {
    super('NACTrackDB')

    // Only columns that are indexed need to be specified here
    this.version(3)
      .stores({
        supplements: '++id, date, name, dosage',
        symptoms: '++id, date, type, severity',
        breakthroughs: '++id, date, description',
      })
      .upgrade((trans) => {
        return trans.db
          .table<ISupplement, number>('supplements')
          .toCollection()
          .modify((supplement) => {
            if ((supplement.date as Date | string) instanceof Date) {
              // @ts-ignore
              supplement.date = supplement.date.toISOString().split('T')[0]
            }
          })
      })

    this.version(5)
      .stores({
        symptoms: '++id, date, type, severity, custom',
      })
      .upgrade((trans) => {
        return trans.db
          .table<ISymptom, number>('symptoms')
          .toCollection()
          .modify((s) => {
            s.custom = 0
          })
      })

    /*
    // Version 3 setup with upgrade path from version 2
    this.version(3).stores({
        // ... (version 3 schema changes)
      }).upgrade(trans => {
        // ... (version 3 data migrations)
      });
      */

    // Define tables
    this.supplements = this.table('supplements')
    this.symptoms = this.table('symptoms')
    this.breakthroughs = this.table('breakthroughs')
  }

  // Function to add a supplement to the database
  addSupplement = async (supplement: Omit<ISupplement, 'id'>): Promise<number | void> => {
    const existing = await this.supplements.where({ date: supplement.date, name: supplement.name }).first()
    if (existing && existing.id) {
      return await this.supplements.delete(existing.id)
    }
    return await this.supplements.add(supplement)
  }
}

// Initialize the database
const db = new NACTrackDB()
export default db
