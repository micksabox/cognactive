import { useLoaderData } from '@remix-run/react'
import { PROTOCOL_PHASE, PROTOCOL_PHASE_2_CYCLE_START, PROTOCOL_START_DATE } from 'src/constants'
import ProtocolTracker from 'src/pages/tracker/index'
import { useLocalStorage } from '@uidotdev/usehooks'

import { meta as RootMeta } from '../_index'
import React from 'react'
import { ProtocolTrackerStateContext } from 'src/pages/tracker/use-protocol-tracker-state'

export const meta = RootMeta

export const clientLoader = async () => {
  const startDate = localStorage.getItem(PROTOCOL_START_DATE)
  const currentPhase = localStorage.getItem(PROTOCOL_PHASE)
  const phase2CycleStart = localStorage.getItem(PROTOCOL_PHASE_2_CYCLE_START)

  return {
    startDate: startDate,
    currentPhase: currentPhase ?? '1',
    phase2CycleStart: phase2CycleStart,
  }
}

const TrackerComponent: React.FC = () => {
  const clientData = useLoaderData<typeof clientLoader>()

  const [currentPhase, setCurrentPhase] = useLocalStorage<string | null>(PROTOCOL_PHASE, clientData.currentPhase)
  const [phase2CycleStart, setPhase2CycleStart] = useLocalStorage<string | null>(
    PROTOCOL_PHASE_2_CYCLE_START,
    clientData.phase2CycleStart,
  )

  return (
    <ProtocolTrackerStateContext.Provider
      value={{
        startDate: clientData.startDate ? clientData.startDate.replace(/"/g, '') : null,
        currentPhase: currentPhase ? currentPhase.replace(/"/g, '') : '1',
        phase2CycleStart: phase2CycleStart ? phase2CycleStart.replace(/"/g, '') : null,
        setCurrentPhase,
        setPhase2CycleStart,
      }}
    >
      <ProtocolTracker clientCachedStartDate={clientData.startDate} />
    </ProtocolTrackerStateContext.Provider>
  )
}

export default TrackerComponent
