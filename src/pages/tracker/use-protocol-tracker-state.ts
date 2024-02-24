import React from 'react'

interface ProtocolTrackerState {
  startDate: string | null
  currentPhase: string | null
  phase2CycleStart: string | null
}

export const ProtocolTrackerStateContext = React.createContext<ProtocolTrackerState | undefined>(undefined)

export const useProtocolTrackerState = () => {
  const context = React.useContext(ProtocolTrackerStateContext)
  if (context === undefined) {
    throw new Error('useProtocolTrackerState must be used within a ProtocolTrackerStateProvider')
  }
  return context
}
