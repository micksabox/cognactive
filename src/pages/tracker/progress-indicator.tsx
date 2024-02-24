import { differenceInCalendarDays, addMonths, parse, format } from 'date-fns'
import { ArrowRight, Goal } from 'lucide-react'
import { Progress } from 'src/components/ui/progress'
import db from './db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { Button } from 'src/components/ui/button'
import { useProtocolTrackerState } from './use-protocol-tracker-state'
import { PROTOCOL_PHASE, PROTOCOL_PHASE_2_CYCLE_START } from 'src/constants'
import { toast } from 'react-hot-toast'

interface ProgressIndicatorProps {
  startDate: Date
  currentDate: Date
  completed: boolean
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
  const daysSinceResumingPhase2 = phase2CycleStart ? differenceInCalendarDays(phase2CycleStart, currentDate) : 0
  // Find the day that the user first took only black seed oil, after starting phase 2
  const daysSincePhase2Break = 7 // todo

  console.log(protocolTrackerState, daysSinceResumingPhase2)

  const currentPhase = protocolTrackerState.currentPhase

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
            {dayNumber > 50 && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-20 self-start font-semibold">Phase 2 Eligible</span>
                <div className="flex-grow flex-col">
                  <div className="flex items-center gap-2">
                    <Progress className="flex-grow" value={daysSinceLastDieoff} max={21} />
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
          <div className="flex items-center gap-2">
            <span className="inline-block w-20 self-start font-semibold">Phase 2</span>
            <div className="grid flex-grow grid-cols-3 gap-2">
              <div className="col-span-2">
                <Progress className="w-full" value={daysSinceResumingPhase2} max={21} />
                <p className="text-center text-xs">3 weeks on</p>
              </div>
              <div className="col-span-1">
                <Progress className="w-full" value={daysSincePhase2Break - 21} max={7} />
                <p className="text-center text-xs">1 week off</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {daysUntilTwoMonths <= 5 && (
        <Alert variant={'default'} className="my-2">
          <AlertTitle>Phase 2 (Optional)</AlertTitle>
          <AlertDescription>
            Once past the 2 month milestone, choose to continue in phase 1 or proceed to phase 2 of the NAC protocol.
            You can rollback to phase 1 if needed.
            <br />
            <Button
              disabled={currentPhase == '1'}
              onClick={() => {
                localStorage.setItem(PROTOCOL_PHASE, '1')
                localStorage.removeItem(PROTOCOL_PHASE_2_CYCLE_START)

                db.rollbackToPhase1().then(() => {
                  toast.success('Back to Phase 1')
                })
              }}
              className="m-2"
              variant={'outline'}
              size={'sm'}
            >
              Rollback to Phase 1
            </Button>
            <Button
              disabled={currentPhase == '2'}
              onClick={() => {
                localStorage.setItem(PROTOCOL_PHASE, '2')
                localStorage.setItem(PROTOCOL_PHASE_2_CYCLE_START, format(new Date(), 'yyyy-MM-dd'))

                db.setupPhase2().then(() => {
                  toast.success('Setup Phase 2')
                })
              }}
              className="mt-2"
              variant={'cyan'}
              size={'sm'}
            >
              Activate Phase 2
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default ProgressIndicator
