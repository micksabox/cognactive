import React from 'react'
import useLocalStorageState from '../../hooks/use-localstorage-state'
import { Button } from 'src/components/ui/button'
import { DatePicker } from 'src/components/date-picker'

const ProtocolTracker: React.FC = () => {
  const [startDate, setStartDate] = useLocalStorageState<string | null>('protocol_start_date', null)

  const handleStartProtocol = () => {
    const currentDate = new Date().toISOString().split('T')[0]
    setStartDate(currentDate)
  }

  return (
    <div className="p-2">
      <h3 className="text-3xl font-bold">NAC Protocol Tracker</h3>

      {startDate ? (
        <>
          <p>NAC Protocol tracking started on:</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold"> {startDate}</h3>
            <Button
              variant={'secondary'}
              onClick={() => {
                const sure = confirm('Are you sure? Your progress will be reset. This action cannot be undone.')
                if (sure) {
                  setStartDate(null)
                }
              }}
            >
              Reset Tracking
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-xl">Set start date and track daily activities, die-off symptoms and breakthroughs.</p>

          <br />
          <p className="font-semibold text-slate-500">Protocol Start Date</p>
          <DatePicker />
          <br />
          <Button size={'lg'} className="mt-4 w-full" onClick={handleStartProtocol}>
            Start Tracking NAC Protocol
          </Button>
          <p className="mt-2 text-center">All data is saved locally in web browser and not sent to any server.</p>
        </>
      )}
    </div>
  )
}

export default ProtocolTracker
