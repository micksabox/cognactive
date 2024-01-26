import React, { useCallback, useState } from 'react'
import { Button } from 'src/components/ui/button'
import { DatePicker } from 'src/components/date-picker'
import Dashboard from './dashboard'
import { formatDateKey } from 'src/lib/utils'
import db from './db'
import { toast } from 'react-hot-toast'
import useIsAppInstalled from './use-is-app-installed'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { LayoutGrid, ShareIcon } from 'lucide-react'
import { getEnv } from 'src/lib/env'
import { parse } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { PROTOCOL_START_DATE } from 'src/constants'
interface ProtocolTrackerProps {
  clientCachedStartDate: string | null
}

const ProtocolTracker: React.FC<ProtocolTrackerProps> = ({ clientCachedStartDate }) => {
  const [startDate, setStartDate] = useState<string | null>(clientCachedStartDate)
  const [pickerDate, setPickerDate] = useState<Date | undefined>()
  const isAppInstalled = useIsAppInstalled()

  const handleStartProtocol = useCallback(() => {
    if (isAppInstalled || getEnv() === 'development') {
      const currentDate = formatDateKey(pickerDate || new Date())
      localStorage.setItem(PROTOCOL_START_DATE, currentDate)
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
  }, [isAppInstalled, pickerDate])

  return (
    <div className="bottom-inset mx-auto max-w-xl p-2">
      {startDate ? (
        <>
          <div className="flex items-center">
            <span>Started NAC protocol on</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} size={'sm'} className="text-md ml-2 font-light">
                  {' '}
                  {startDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-xl font-bold">Reset Tracking</p>
                <p>Reset the tracking start date and delete all data.</p>
                <Button
                  className="mt-2"
                  variant={'destructive'}
                  onClick={() => {
                    const sure = confirm(
                      'Are you sure? Your progress will be reset. All activity data will be erased. This action cannot be undone.',
                    )
                    if (sure) {
                      db.resetAllData().then(
                        () => {
                          localStorage.removeItem(PROTOCOL_START_DATE)
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
              </PopoverContent>
            </Popover>
          </div>
          <Dashboard startDate={pickerDate || parse(startDate, 'yyyy-MM-dd', new Date())} />
        </>
      ) : (
        <>
          <p className="text-xl">Track daily activities and die-off symptoms for the NAC protocol.</p>

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
                To continue, open this webpage from your mobile device. Then open the Share menu{' '}
                <ShareIcon className="inline-block w-4" /> and select &apos;Add to Home Screen&apos;.
              </AlertDescription>
            </Alert>
          )}
          {isAppInstalled && (
            <div className="mt-2 p-2 text-sm">
              By proceeding you agree to:
              <p className="font-semibold">Privacy Policy</p>
              All personal event activity data (symptoms, supplements, breakthroughs) is stored locally in web browser
              and not shared with any third-party.
              <p className="font-semibold">Legal Disclaimer</p>
              The cognactive app helps track activities and events and is for personal use only. cognactive is not a
              medical app. Use this app at your own risk and liability.
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProtocolTracker
