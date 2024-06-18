import { differenceInCalendarDays, addMonths, parse, format } from 'date-fns'
import { ArrowRight, Goal, TimerIcon } from 'lucide-react'
import { Progress } from 'src/components/ui/progress'
import db from './db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { Button } from 'src/components/ui/button'
import { useProtocolTrackerState } from './use-protocol-tracker-state'
import { formatDateKey } from 'src/lib/utils'
import { useNavigate } from '@remix-run/react'
import { useState } from 'react'
import { DatePicker } from 'src/components/date-picker'

interface ProgressIndicatorProps {
  startDate: Date
  currentDate: Date
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ startDate, currentDate }) => {
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
              <span className="inline-block w-20 flex-grow font-semibold">Phase 1</span>
              <Progress className="flex-grow" value={(dayNumber / 60) * 100} max={60} />
              <ArrowRight />
              <span className="text-xs">
                2 month
                <br />
                milestone
              </span>
            </div>
            {dayNumber > phase2EligibleTimerDaysThreshold && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-20 self-start font-semibold">Phase 2 Eligible</span>
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
                    <span className="text-xs">3 weeks of no die-off</span>
                  </div>
                  <p className="text-xs">Latest die-off symptom: {latestDieOffSymptom?.date ?? 'N/A'} </p>
                </div>
              </div>
            )}
          </>
        )}
        {currentPhase === '2' && (
          <div className="flex items-start gap-2">
            <p>
              <span className="inline-block w-20 self-start font-semibold">Phase 2</span>
            </p>
            <div className="grid flex-grow grid-cols-3 gap-2">
              {phase2CycleStart && (
                <p className="col-span-2 text-xs">
                  started on {formatDateKey(phase2CycleStart)}{' '}
                  <a
                    role="button"
                    className="text-blue-500"
                    onClick={(e) => {
                      e.preventDefault()
                      setEditingPhase2CycleDate((prev) => !prev)
                    }}
                  >
                    {editingPhase2CycleDate ? 'Cancel' : 'Edit'}
                  </a>
                </p>
              )}
              <div className="col-span-2">
                {/* Handle multiple cycles by modulo calc days by 28 and stop at 3 weeks (21 days) */}
                <Progress
                  className="w-full"
                  value={((daysSinceResumingPhase2 % fourWeeksInDays) / threeWeeksInDays) * 100}
                />
                <p className="text-center text-xs">3 weeks on</p>
              </div>
              <div className="col-span-1">
                {/* Show the final week by modulo calc by 28 and subtract 3 weeks */}
                <Progress
                  className="w-full"
                  value={(((daysSinceResumingPhase2 % fourWeeksInDays) - threeWeeksInDays) / 7) * 100}
                />
                <p className="text-center text-xs">1 week off</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {editingPhase2CycleDate && phase2CycleStart && (
        <Alert>
          <TimerIcon className="w-6" />
          <AlertTitle>Phase 2 Cycle Start / Resume Date</AlertTitle>
          <AlertDescription className="mb-2">
            When did you start or resume phase 2? Setting this date will reset the timer.
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
            Phase 2 <span className="text-xs text-gray-500">Optional</span>
          </AlertTitle>
          <AlertDescription>
            Once past the 2 month milestone, continue phase 1 as needed or prepare for phase 2 of the NAC protocol.
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
              Setup Phase 2
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {currentPhase == '2' && (daysSinceResumingPhase2 % fourWeeksInDays) - threeWeeksInDays > 0 && (
        <p className="my-4 text-xl font-bold text-purple-950">BSO only on week off.</p>
      )}
    </>
  )
}

export default ProgressIndicator
