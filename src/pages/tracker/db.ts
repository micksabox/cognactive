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
  date: Date
  type: string
  severity: number
}

export interface IBreakthrough {
  id?: number
  date: Date
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
    this.version(2)
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
            if ((supplement.date as any) instanceof Date) {
              // @ts-ignore
              supplement.date = supplement.date.toISOString().split('T')[0]
            }
          })
      })

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
