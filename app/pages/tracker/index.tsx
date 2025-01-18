import React, { useCallback, useState } from 'react'
import { Button } from 'src/components/ui/button'
import { DatePicker } from 'src/components/date-picker'
import Dashboard from './dashboard'
import { formatDateKey } from 'src/lib/utils'
import db from 'src/pages/tracker/db'
import { toast } from 'react-hot-toast'
import useIsAppInstalled from 'src/pages/tracker/use-is-app-installed'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { LayoutGrid, ShareIcon } from 'lucide-react'
import { parse } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { PROTOCOL_PHASE, PROTOCOL_PHASE_2_CYCLE_START, PROTOCOL_START_DATE } from 'src/constants'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

interface ProtocolTrackerProps {
  clientCachedStartDate: string | null
}

const ProtocolTracker: React.FC<ProtocolTrackerProps> = ({ clientCachedStartDate }) => {
  const [startDate, setStartDate] = useState<string | null>(clientCachedStartDate)
  const [pickerDate, setPickerDate] = useState<Date | undefined>()
  const isAppInstalled = useIsAppInstalled()
  const { t } = useTranslation()

  const handleStartProtocol = useCallback(() => {
    if (isAppInstalled || ENV.MODE === 'development') {
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
    <div className="bottom-inset mx-auto min-h-full max-w-xl p-2">
      {startDate ? (
        <>
          <div className="flex items-center">
            <span>{t('tracker.started_on')}</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} size={'sm'} className="text-md ml-2 font-light">
                  {' '}
                  {startDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-xl font-bold">{t('tracker.reset_tracking')}</p>
                <p>{t('tracker.reset_description')}</p>
                <Button
                  className="mt-2"
                  variant={'destructive'}
                  onClick={() => {
                    const sure = confirm(t('tracker.reset_confirm'))
                    if (sure) {
                      db.resetAllData().then(
                        () => {
                          localStorage.removeItem(PROTOCOL_START_DATE)
                          localStorage.removeItem(PROTOCOL_PHASE)
                          localStorage.removeItem(PROTOCOL_PHASE_2_CYCLE_START)
                          setStartDate(null)
                        },
                        (err) => {
                          console.log(err)
                          toast.error(t('tracker.reset_error'))
                        },
                      )
                    }
                  }}
                >
                  {t('tracker.reset_button')}
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          <Dashboard startDate={pickerDate || parse(startDate, 'yyyy-MM-dd', new Date())} />
        </>
      ) : (
        <div className="pb-8">
          <p className="text-xl">{t('tracker.start_tracking')}</p>

          <br />
          <p className="font-semibold text-slate-500">{t('tracker.start_date')}</p>
          <DatePicker onSetDate={(d) => setPickerDate(d)} />
          <br />
          <Button size={'lg'} className="mt-4 w-full" onClick={handleStartProtocol}>
            {t('tracker.start_button')}
          </Button>
          {!isAppInstalled && (
            <Alert id="app-install-alert" className="mt-2">
              <LayoutGrid className="w-4" />
              <AlertTitle>{t('tracker.install_title')}</AlertTitle>
              <AlertDescription>
                {t('tracker.install_description')} <ShareIcon className="inline-block w-4" />
              </AlertDescription>
            </Alert>
          )}
          {isAppInstalled && (
            <div className="mt-2 p-2 text-sm">
              By proceeding you agree to:
              <p className="font-semibold">{t('tracker.privacy_title')}</p>
              {t('tracker.privacy_text')}{' '}
              <Link className="underline underline-offset-auto" to={'/privacy'}>
                {t('tracker.privacy_link')}
              </Link>
              .<p className="font-semibold">{t('tracker.legal_title')}</p>
              {t('tracker.legal_text')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProtocolTracker
