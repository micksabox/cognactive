import { differenceInCalendarDays, addMonths } from 'date-fns'
import { ArrowRight, Goal } from 'lucide-react'
import { Progress } from 'src/components/ui/progress'
import db from './db'
import { useLiveQuery } from 'dexie-react-hooks'

interface ProgressIndicatorProps {
  startDate: Date
  currentDate: Date
  completed: boolean
}

// TODO: Reread the maintenance protocol
// Phase 2 is not a thing

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ startDate, currentDate }) => {
  const dayNumber = differenceInCalendarDays(currentDate, startDate) + 1
  const twoMonthsLater = addMonths(startDate, 2)
  const daysUntilTwoMonths = differenceInCalendarDays(twoMonthsLater, currentDate)

  const latestDieOffSymptom = useLiveQuery(() => db.symptoms.orderBy('createdAt').reverse().first(), [])

  const daysSinceLastDieoff = latestDieOffSymptom
    ? differenceInCalendarDays(currentDate, new Date(latestDieOffSymptom.date))
    : null

  return (
    <div id="progress-indicator" className="mt-2 flex items-center gap-2">
      {daysUntilTwoMonths > 0 ? (
        <>
          <span className="inline-block w-16 flex-grow font-semibold">Phase 1</span>
          <Progress className="flex-grow" value={dayNumber} max={60} />
          <ArrowRight />
          <span className="text-xs">
            2 month
            <br />
            milestone
          </span>
        </>
      ) : (
        <>
          <span className="inline-block self-start font-semibold">Phase 2</span>
          <div className="flex-grow flex-col">
            <div className="flex items-center gap-2">
              <Progress className="flex-grow" value={daysSinceLastDieoff} max={21} />
              <Goal className="w-8" />
              <span className="text-xs">3 weeks of no die-off</span>
            </div>
            <p className="text-xs">Latest die-off symptom: {latestDieOffSymptom?.date ?? 'N/A'} </p>
            <div className="flex items-center gap-2">
              <Progress className="flex-grow" value={dayNumber} max={daysUntilTwoMonths + dayNumber} />
              <ArrowRight />
              <span className="text-xs">4 month marker</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProgressIndicator
