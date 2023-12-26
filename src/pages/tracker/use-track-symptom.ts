import { useLiveQuery } from 'dexie-react-hooks'
import db, { ISymptom } from './db'

export const useTrackSymptom = (dateKey: string) => {
  const symptoms = useLiveQuery(() => db.symptoms.where({ date: dateKey }).toArray(), [dateKey])
  const customSymptoms = useLiveQuery(() => db.symptoms.where({ custom: 1 }).toArray(), [])

  const addSymptom = async (symptom: Omit<ISymptom, 'id'>): Promise<number | void> => {
    const existingSymptom = await db.symptoms.where({ date: symptom.date, type: symptom.type }).first()

    if (existingSymptom && existingSymptom.id) {
      return await db.symptoms.delete(existingSymptom.id)
    }

    return await db.symptoms.add(symptom)
  }

  return { symptoms, customSymptoms, addSymptom }
}
