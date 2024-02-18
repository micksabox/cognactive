import { differenceInCalendarDays, addMonths } from 'date-fns'
import { ArrowRight, Goal } from 'lucide-react'
import { Progress } from 'src/components/ui/progress'
import db from './db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { Button } from 'src/components/ui/button'

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

  return (
    <>
      <div id="progress-indicator" className="mt-2 flex items-center gap-2">
        {daysUntilTwoMonths > 0 ? (
          <>
            <span className="inline-block w-20 flex-grow font-semibold">Phase 1</span>
            <Progress className="flex-grow" value={(dayNumber / 60) * 100} max={60} />
            <ArrowRight />
            <span className="text-xs">
              2 month
              <br />
              milestone
            </span>
          </>
        ) : (
          <>
            <span className="inline-block w-20 self-start font-semibold">Phase 2 Eligible</span>
            <div className="flex-grow flex-col">
              <div className="flex items-center gap-2">
                <Progress className="flex-grow" value={daysSinceLastDieoff ?? (0 / 21) * 100} />
                <Goal className="w-8" />
                <span className="text-xs">3 weeks of no die-off</span>
              </div>
              <p className="text-xs">Latest die-off symptom: {latestDieOffSymptom?.date ?? 'N/A'} </p>
            </div>
          </>
        )}
      </div>
      {daysUntilTwoMonths <= 5 && (
        <Alert variant={'default'} className="my-2">
          <AlertTitle>Phase 1 to Phase 2</AlertTitle>
          <AlertDescription>
            Once past the 2 month milestone, choose to continue in phase 1 or proceed to phase 2 of the NAC protocol.
            <br />
            <Button className="mt-2" variant={'cyan'} size={'sm'}>
              Prepare for Phase 2
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default ProgressIndicator
