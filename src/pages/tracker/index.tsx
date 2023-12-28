import React, { useState } from 'react'
import useLocalStorageState from '../../hooks/use-localstorage-state'
import { Button } from 'src/components/ui/button'
import { DatePicker } from 'src/components/date-picker'
import Dashboard from './dashboard'
import { formatDateKey } from 'src/lib/utils'
import db from './db'
import { toast } from 'react-hot-toast'
import useIsAppInstalled from './use-is-app-installed'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { LayoutGrid } from 'lucide-react'

const ProtocolTracker: React.FC = () => {
  const [startDate, setStartDate] = useLocalStorageState<string | null>('protocol_start_date', null)
  const [pickerDate, setPickerDate] = useState<Date | undefined>()
  const isAppInstalled = useIsAppInstalled()

  const handleStartProtocol = () => {
    if (isAppInstalled) {
      const currentDate = formatDateKey(pickerDate || new Date())
      setStartDate(currentDate)
    } else {
      const alertElement = document.getElementById('app-install-alert')
      if (alertElement) {
        alertElement.animate(
          [
            { transform: 'scale(1)', opacity: 1, offset: 0 },
            { transform: 'scale(1.05)', opacity: 1, offset: 0.3 },
            { transform: 'scale(1)', opacity: 1, offset: 1 },
          ],
          {
            duration: 500,
            easing: 'ease-in-out',
            fill: 'both',
          },
        )
      }
    }
  }

  return (
    <div className="mx-auto max-w-xl p-2">
      {startDate ? (
        <>
          <p className="font-bold">Tracking started on:</p>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-light"> {startDate}</h3>
            <Button
              variant={'secondary'}
              onClick={() => {
                const sure = confirm('Are you sure? Your progress will be reset. This action cannot be undone.')
                if (sure) {
                  db.resetAllData().then(
                    () => {
                      setStartDate(null)
                    },
                    (err) => {
                      console.log(err)
                      toast.error('Something went wrong while resetting tracker data')
                    },
                  )
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
          <p className="text-xl">Track daily activities, die-off symptoms and breakthroughs for the NAC protocol.</p>

          <br />
          <p className="font-semibold text-slate-500">Protocol Start Date</p>
          <DatePicker onSetDate={(d) => setPickerDate(d)} />
          <br />
          <Button size={'lg'} className="mt-4 w-full" onClick={handleStartProtocol}>
            Start Tracking NAC Protocol
          </Button>
          {!isAppInstalled && (
            <Alert id="app-install-alert" className="mt-2">
              <LayoutGrid className="w-4" />
              <AlertTitle>Install cognactive to mobile device</AlertTitle>
              <AlertDescription>
                cognactive is designed to be used as a mobile app during the protocol. Open this webpage from your
                mobile device. Then open the Share menu and select Add to Home Screen.
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-2 text-sm">
            By proceeding you agree to:
            <p className="font-semibold">Privacy Policy</p>
            All personal event activity data (symptoms, supplements, breakthroughs) is stored locally in web browser and
            not shared with any third-party.
            <p className="font-semibold">Legal Disclaimer</p>
            The cognactive app helps track activities and events and is for personal use only. cognactive is not a
            medical app. Use this app at your own risk and liability.
          </div>
        </>
      )}
    </div>
  )
}

export default ProtocolTracker
