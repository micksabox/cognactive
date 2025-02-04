import { differenceInCalendarDays, addMonths, parse, format } from 'date-fns'
import { ArrowRight, Goal, TimerIcon } from 'lucide-react'
import { Progress } from 'src/components/ui/progress'
import db from './db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { Button } from 'src/components/ui/button'
import { useProtocolTrackerState } from './use-protocol-tracker-state'
import { formatDateKey } from 'src/lib/utils'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { DatePicker } from 'src/components/date-picker'
import { useTranslation } from 'react-i18next'

interface ProgressIndicatorProps {
  startDate: Date
  currentDate: Date
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ startDate, currentDate }) => {
  const { t } = useTranslation()
  const dayNumber = differenceInCalendarDays(currentDate, startDate) + 1
  const twoMonthsLater = addMonths(startDate, 2)
  const daysUntilTwoMonths = differenceInCalendarDays(twoMonthsLater, currentDate)

  const latestDieOffSymptom = useLiveQuery(() => db.symptoms.orderBy('createdAt').reverse().first(), [])

  const daysSinceLastDieoff = latestDieOffSymptom
    ? differenceInCalendarDays(currentDate, new Date(latestDieOffSymptom.date))
    : null

  const protocolTrackerState = useProtocolTrackerState()
  const phase2CycleStart = protocolTrackerState.phase2CycleStart
    ? parse(protocolTrackerState.phase2CycleStart, 'yyyy-MM-dd', new Date())
    : null

  // Phase 2 won't be considered started until all of the elements are taken
  const daysSinceResumingPhase2 = phase2CycleStart ? differenceInCalendarDays(currentDate, phase2CycleStart) : 0
  const currentPhase = protocolTrackerState.currentPhase

  const fourWeeksInDays = 28
  const threeWeeksInDays = 21

  // After this amount of days, the phase 2 eligible timer is shown
  const phase2EligibleTimerDaysThreshold = 50

  const navigate = useNavigate()

  const [editingPhase2CycleDate, setEditingPhase2CycleDate] = useState<boolean>(false)

  return (
    <>
      <div id="progress-indicator" className="mt-2 flex-col">
        <hr className="my-2" />
        {currentPhase == '1' && (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-block w-20 flex-grow font-semibold">
                {t('tracker.progress_indicator.phase_1')}
              </span>
              <Progress className="flex-grow" value={(dayNumber / 60) * 100} max={60} />
              <ArrowRight />
              <span className="text-xs">{t('tracker.progress_indicator.two_month_milestone')}</span>
            </div>
            {dayNumber > phase2EligibleTimerDaysThreshold && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-20 self-start font-semibold">
                  {t('tracker.progress_indicator.phase_2_eligible')}
                </span>
                <div className="flex-grow flex-col">
                  <div className="flex items-center gap-2">
                    {daysSinceLastDieoff && (
                      <Progress
                        className="flex-grow"
                        value={(daysSinceLastDieoff / threeWeeksInDays) * 100}
                        max={threeWeeksInDays}
                      />
                    )}
                    <Goal className="w-8" />
                    <span className="text-xs">{t('tracker.progress_indicator.weeks_no_die_off')}</span>
                  </div>
                  <p className="text-xs">
                    {t('tracker.progress_indicator.latest_die_off', { date: latestDieOffSymptom?.date ?? '-' })}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        {currentPhase === '2' && (
          <div className="flex items-start gap-2">
            <p>
              <span className="inline-block w-20 self-start font-semibold">
                {t('tracker.progress_indicator.phase_2')}
              </span>
            </p>
            <div className="grid flex-grow grid-cols-3 gap-2">
              {phase2CycleStart && (
                <p className="col-span-2 text-xs">
                  {t('tracker.progress_indicator.phase_2_started', { date: formatDateKey(phase2CycleStart) })}{' '}
                  <a
                    role="button"
                    className="text-blue-500"
                    onClick={(e) => {
                      e.preventDefault()
                      setEditingPhase2CycleDate((prev) => !prev)
                    }}
                  >
                    {editingPhase2CycleDate
                      ? t('tracker.progress_indicator.cancel')
                      : t('tracker.progress_indicator.edit')}
                  </a>
                </p>
              )}
              <div className="col-span-2">
                <Progress
                  className="w-full"
                  value={((daysSinceResumingPhase2 % fourWeeksInDays) / threeWeeksInDays) * 100}
                />
                <p className="text-center text-xs">{t('tracker.progress_indicator.three_weeks_on')}</p>
              </div>
              <div className="col-span-1">
                <Progress
                  className="w-full"
                  value={(((daysSinceResumingPhase2 % fourWeeksInDays) - threeWeeksInDays) / 7) * 100}
                />
                <p className="text-center text-xs">{t('tracker.progress_indicator.one_week_off')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {editingPhase2CycleDate && phase2CycleStart && (
        <Alert>
          <TimerIcon className="w-6" />
          <AlertTitle>{t('tracker.progress_indicator.phase_2_cycle_date.title')}</AlertTitle>
          <AlertDescription className="mb-2">
            {t('tracker.progress_indicator.phase_2_cycle_date.description')}
          </AlertDescription>
          <DatePicker
            toDate={new Date()}
            onSetDate={(d) => {
              if (d) {
                protocolTrackerState.setPhase2CycleStart(formatDateKey(d))
                setEditingPhase2CycleDate(false)
              }
            }}
          />
        </Alert>
      )}
      {daysUntilTwoMonths <= 0 && (currentPhase == '1' || currentPhase == null) && (
        <Alert variant={'default'} className="my-2">
          <AlertTitle>
            {t('tracker.progress_indicator.phase_2_setup.title')}{' '}
            <span className="text-xs text-gray-500">{t('tracker.progress_indicator.phase_2_setup.optional')}</span>
          </AlertTitle>
          <AlertDescription>
            {t('tracker.progress_indicator.phase_2_setup.description')}
            <br />
            <Button
              onClick={() => {
                protocolTrackerState.setCurrentPhase('2')
                protocolTrackerState.setPhase2CycleStart(format(new Date(), 'yyyy-MM-dd'))

                db.setupPhase2().then(() => {
                  navigate('/tracker-regimen?startPhase2=true')
                })
              }}
              className="mt-2"
              variant={'cyan'}
              size={'sm'}
            >
              {t('tracker.progress_indicator.phase_2_setup.setup_button')}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {currentPhase == '2' && (daysSinceResumingPhase2 % fourWeeksInDays) - threeWeeksInDays > 0 && (
        <p className="my-4 text-xl font-bold text-purple-950">{t('tracker.progress_indicator.bso_only')}</p>
      )}
    </>
  )
}

export default ProgressIndicator
