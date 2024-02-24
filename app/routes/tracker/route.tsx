import { useLoaderData } from '@remix-run/react'
import { PROTOCOL_PHASE, PROTOCOL_PHASE_2_CYCLE_START, PROTOCOL_START_DATE } from 'src/constants'
import ProtocolTracker from 'src/pages/tracker/index'

import { meta as RootMeta } from '../_index'
import React, { useEffect, useState } from 'react'
import { ProtocolTrackerStateContext } from 'src/pages/tracker/use-protocol-tracker-state'

export const meta = RootMeta

export const clientLoader = async () => {
  const startDate = localStorage.getItem(PROTOCOL_START_DATE)
  const currentPhase = localStorage.getItem(PROTOCOL_PHASE)
  const phase2CycleStart = localStorage.getItem(PROTOCOL_PHASE_2_CYCLE_START)

  return {
    startDate: startDate ? startDate.replace(/"/g, '') : null,
    currentPhase: currentPhase ?? '1',
    phase2CycleStart: phase2CycleStart,
  }
}

const TrackerComponent: React.FC = () => {
  const clientData = useLoaderData<typeof clientLoader>()

  const [currentPhase, setCurrentPhase] = useState<string | null>(clientData.currentPhase)
  const [phase2CycleStart, setPhase2CycleStart] = useState<string | null>(clientData.phase2CycleStart)

  useEffect(function handleStorageChange() {
    const handleStorageChange = (event: StorageEvent) => {
      console.log('handleStorageChange', event)
      if (event.key === PROTOCOL_PHASE) {
        setCurrentPhase(event.newValue)
      }
      if (event.key === PROTOCOL_PHASE_2_CYCLE_START) {
        setPhase2CycleStart(event.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <ProtocolTrackerStateContext.Provider value={{ ...clientData, currentPhase, phase2CycleStart }}>
      <ProtocolTracker clientCachedStartDate={clientData.startDate} />
    </ProtocolTrackerStateContext.Provider>
  )
}

export default TrackerComponent
