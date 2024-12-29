import Dexie, { Table } from 'dexie'
import { formatDateKey } from 'src/lib/utils'

export type RegimenActivities = {
  oreganoOil: boolean
  nac: boolean
  blackSeedOil: boolean
  nightOreganoOil: boolean
  nightNac: boolean
  nightBlackSeedOil: boolean
  [key: string]: any
}

// Represents a supplement activity
export interface ISupplement {
  id?: number
  date: string // format: yyyy-mm-dd
  name: string
  dosage: string
  dosageUnit: string
}

// Used in the database
export interface ISymptom {
  id?: number
  date: string // format: yyyy-mm-dd
  type: string
  severity: number
  custom: number
  createdAt: Date
}

export interface DieOffSymptom extends Omit<ISymptom, 'createdAt'> {
  createdAt: string
}

export interface IBreakthrough {
  id?: number
  date: string
  description: string
}

export interface INote {
  id?: number
  content: string
  date: string // format: yyyy-mm-dd
  createdAt: Date
}

export interface IRegimen {
  id?: number
  // Name of supplement or activity
  activityName: string
  // Absolute value of dose / amount for activity
  activityAmount: number
  // Unit of measure (tbsp, grams, etc)
  unitOfMeasure: string
  label: string
  // Long description of regimen activity as needed
  description?: string
  // Where in the day "morning", "night"
  timeslot: 'morning' | 'night'
  // Whether to hide the activity in the tracker
  hidden?: boolean
}

// Define the database
class NACTrackDB extends Dexie {
  supplements: Dexie.Table<ISupplement, number>
  symptoms: Dexie.Table<ISymptom, number>
  breakthroughs: Dexie.Table<IBreakthrough, number>
  notes: Dexie.Table<INote, number>
  regimen: Dexie.Table<IRegimen, number>

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
              supplement.date = formatDateKey(supplement.date)
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

    // Index the createdAt field
    this.version(7).stores({
      symptoms: '++id, date, type, custom, createdAt',
    })

    this.version(9).stores({
      symptomCounts: null,
    })

    this.version(10).stores({
      notes: '++id, date, createdAt',
    })

    this.version(11)
      .stores({
        regimen: '++id, &activityName',
      })
      .upgrade(async (trans) => {
        const regimenTable = trans.table<IRegimen, number>('regimen')
        this.loadPhase1Activities(regimenTable)
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
    this.notes = this.table('notes')
    this.regimen = this.table('regimen')
  }

  // Function to add a supplement to the database
  addSupplement = async (supplement: Omit<ISupplement, 'id'>): Promise<number | void> => {
    const existing = this.supplements.where({ date: supplement.date, name: supplement.name })

    let limit = 1 // global limit

    switch (supplement.name) {
      case 'oreganoOil':
      case 'nightOreganoOil':
        limit = 3
        break
      case 'nac':
        limit = 2
        break
      case 'nightNac':
        limit = 1
        break
      case 'blackSeedOil':
      case 'nightBlackSeedOil':
        limit = 2
        break
    }

    if (existing && (await existing.count()) >= limit) {
      return await this.supplements.bulkDelete((await existing.toArray()).map((s) => s.id!))
    }
    return await this.supplements.add(supplement)
  }

  addNote = async (note: Omit<INote, 'id'>): Promise<number | void> => {
    return await this.notes.add(note)
  }

  // Function to reset all data in all tables
  resetAllData = async (): Promise<void> => {
    await this.supplements.clear()
    await this.symptoms.clear()
    await this.breakthroughs.clear()
    await this.notes.clear()
    await this.regimen.clear()
  }

  loadPhase1Activities = async (regimenTable: Table<IRegimen, number>) => {
    await regimenTable.bulkAdd([
      {
        label: 'Oregano Oil',
        timeslot: 'morning',
        activityName: 'oreganoOil',
        activityAmount: 40,
        unitOfMeasure: 'mg',
        description: '40mg Carvacrol',
      },
      { label: 'NAC', timeslot: 'morning', activityName: 'nac', activityAmount: 600, unitOfMeasure: 'mg' },
      {
        label: 'Black Seed Oil',
        timeslot: 'morning',
        activityName: 'blackSeedOil',
        activityAmount: 1,
        unitOfMeasure: 'teaspoon',
      },
      {
        label: 'Oregano Oil',
        timeslot: 'night',
        activityName: 'nightOreganoOil',
        activityAmount: 40,
        unitOfMeasure: 'mg',
        description: '40mg Carvacrol',
      },
      { label: 'NAC', timeslot: 'night', activityName: 'nightNac', activityAmount: 600, unitOfMeasure: 'mg' },
      {
        label: 'Black Seed Oil',
        timeslot: 'night',
        activityName: 'nightBlackSeedOil',
        activityAmount: 1,
        unitOfMeasure: 'teaspoon',
      },
    ])
  }

  loadPhase2Activities = async () => {
    return this.regimen.bulkAdd([
      {
        label: 'Niacin',
        timeslot: 'morning',
        activityName: 'morningNiacin',
        description: 'nicotinic acid',
        activityAmount: 500,
        unitOfMeasure: 'mg',
        hidden: true, // Default to hidden
      },
      {
        label: 'Pom Seed Extract',
        timeslot: 'morning',
        activityName: 'morningPomegranate',
        description: '40% Ellagic Acid',
        activityAmount: 250,
        unitOfMeasure: 'mg',
      },
      {
        label: 'Pterostilbene',
        timeslot: 'morning',
        activityName: 'morningPterostilbene',
        activityAmount: 100,
        unitOfMeasure: 'mg',
        hidden: true, // Default to hidden
      },
      {
        label: 'Niacin',
        timeslot: 'night',
        activityName: 'nightNiacin',
        description: 'nicotinic acid',
        activityAmount: 500,
        unitOfMeasure: 'mg',
        hidden: true, // Default to hidden
      },
      {
        label: 'Pom Seed Extract',
        timeslot: 'night',
        activityName: 'nightPomegranate',
        description: '40% Ellagic Acid',
        activityAmount: 250,
        unitOfMeasure: 'mg',
      },
      {
        label: 'Pterostilbene',
        timeslot: 'night',
        activityName: 'nightPterostilbene',
        activityAmount: 100,
        unitOfMeasure: 'mg',
        hidden: true, // Default to hidden
      },
    ])
  }

  setupPhase2 = async () => {
    const phase1Activities = this.regimen.where('activityName').anyOf(['oreganoOil', 'nightOreganoOil', 'nightNac'])

    await phase1Activities.modify({ hidden: true })

    try {
      await this.loadPhase2Activities()
    } catch (e) {
      // Empty. They may have already been added
      const phase2Activities = this.regimen
        .where('activityName')
        .anyOf([
          'nightPterostilbene',
          'nightPomegranate',
          'nightNiacin',
          'morningPterostilbene',
          'morningPomegranate',
          'morningNiacin',
        ])
      await phase2Activities.modify({ hidden: false })
    }
  }

  rollbackToPhase1 = async () => {
    const phase1Activities = this.regimen.where('activityName').anyOf(['oreganoOil', 'nightOreganoOil', 'nightNac'])

    await phase1Activities.modify({ hidden: false })

    const phase2Activities = this.regimen
      .where('activityName')
      .anyOf([
        'nightPterostilbene',
        'nightPomegranate',
        'nightNiacin',
        'morningPterostilbene',
        'morningPomegranate',
        'morningNiacin',
      ])

    await phase2Activities.modify({ hidden: true })
  }
}

// Initialize the database
const db = new NACTrackDB()
export default db
