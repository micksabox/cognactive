import React, { useState } from 'react'
import useLocalStorageState from '../../hooks/use-localstorage-state'
import { Button } from 'src/components/ui/button'
import { DatePicker } from 'src/components/date-picker'
import Dashboard from './dashboard'

const ProtocolTracker: React.FC = () => {
  const [startDate, setStartDate] = useLocalStorageState<string | null>('protocol_start_date', null)
  const [pickerDate, setPickerDate] = useState<Date | undefined>()

  const handleStartProtocol = () => {
    const currentDate = (pickerDate || new Date()).toISOString().split('T')[0]
    setStartDate(currentDate)
  }

  return (
    <div className="mx-auto max-w-xl p-2">
      <h3 className="text-3xl font-bold">NAC Protocol Tracker</h3>

      {startDate ? (
        <>
          <p>Tracking started on:</p>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-light"> {startDate}</h3>
            <Button
              variant={'secondary'}
              onClick={() => {
                const sure = confirm('Are you sure? Your progress will be reset. This action cannot be undone.')
                if (sure) {
                  setStartDate(null)
                }
              }}
            >
              Reset Tracker
            </Button>
          </div>
          <hr className="my-4" />
          <Dashboard startDate={new Date(startDate)} />
        </>
      ) : (
        <>
          <p className="text-xl">Set start date and track daily activities, die-off symptoms and breakthroughs.</p>

          <br />
          <p className="font-semibold text-slate-500">Protocol Start Date</p>
          <DatePicker onSetDate={(d) => setPickerDate(d)} />
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
