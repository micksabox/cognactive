import { differenceInCalendarDays, addMonths, isSameDay, startOfDay } from 'date-fns'
import { ArrowRight, BotIcon, CheckCircle2, Edit } from 'lucide-react'

import { Button } from 'src/components/ui/button'
import { Progress } from 'src/components/ui/progress'
import DieOffSymptoms from './die-off-symptoms'
import { useTrackSupplement } from './use-track-supplement'
import { IRegimen } from './db'
import { formatDateKey } from 'src/lib/utils'
import { useState, useEffect } from 'react'
import { DatePicker } from 'src/components/date-picker'
import { toast } from 'react-hot-toast'
import { Link } from '@remix-run/react'
import DailyNoteForm from './daily-note-form'
import { useRegimen } from './use-regimen'

interface DashboardProps {
  startDate: Date
}

const Dashboard: React.FC<DashboardProps> = ({ startDate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // On focus sets date to today
  useEffect(() => {
    const handleFocus = () => {
      setCurrentDate(new Date())
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const today = currentDate
  const start = startDate
  const dateKey = formatDateKey(today)
  const dayNumber = differenceInCalendarDays(today, start) + 1
  const twoMonthsLater = addMonths(start, 2)
  const daysUntilTwoMonths = differenceInCalendarDays(twoMonthsLater, today)

  const { supplements, activities, addSupplementActivity } = useTrackSupplement(dateKey)

  const { morningActivities, nightActivities } = useRegimen()

  const saveActivity = (regimenActivity: IRegimen) => {
    addSupplementActivity({
      date: dateKey,
      dosage: regimenActivity.activityAmount.toString(),
      dosageUnit: regimenActivity.unitOfMeasure,
      name: regimenActivity.activityName,
    }).then((maybeId) => {
      console.log(regimenActivity, maybeId)
    })
  }

  const todaysActivities = activities
  const morningDone =
    todaysActivities && todaysActivities.oreganoOil && todaysActivities.nac && todaysActivities.blackSeedOil
  const nightDone =
    todaysActivities &&
    todaysActivities.nightOreganoOil &&
    todaysActivities.nightNac &&
    todaysActivities.nightBlackSeedOil

  return (
    <div>
      {daysUntilTwoMonths > 0 ? (
        <div className="mt-2 flex items-center gap-1">
          <Progress value={(dayNumber / 60) * 100} />
          <ArrowRight />
          <span className="text-xs">
            2 month
            <br />
            milestone
          </span>
        </div>
      ) : (
        <p>2 months have passed since protocol started.</p>
      )}

      <div className="mt-2 flex items-center">
        <span className="w-32 text-2xl font-bold">Day {dayNumber} </span>
        <DatePicker
          currentDate={currentDate}
          fromDate={startDate}
          toDate={new Date()}
          onSetDate={(d) => {
            if (!d) {
              setCurrentDate(new Date())
              return
            }
            if (isSameDay(d, startDate)) {
              toast('Tracking started on this day', { position: 'bottom-center' })
              setCurrentDate(startDate)
              return
            }
            if (startOfDay(d) >= start && d <= new Date()) {
              setCurrentDate(d)
            } else {
              toast.error('Selected date cannot be before the start date or after today.', {
                position: 'bottom-center',
                duration: 1000,
              })
            }
          }}
        />
      </div>

      <h3 className="my-4 flex justify-between text-2xl font-light">
        <span>
          Daily Regimen{' '}
          <Button
            onClick={() => {
              toast.success('Custom regimen editing coming soon!')
            }}
            size={'icon'}
            variant={'outline'}
          >
            <Edit className="w-4" />
          </Button>
        </span>
        <DailyNoteForm dateKey={dateKey} />
      </h3>
      <div className="flex gap-2">
        <div className="w-full flex-1">
          <h3 className="text-right text-sm uppercase tracking-widest">Morning</h3>
          {morningActivities?.map((ma) => (
            <Button
              onClick={() => saveActivity(ma)}
              variant={'outline'}
              size={'sm'}
              className="mt-1 flex w-full justify-between text-xs"
              key={ma.id}
            >
              <span>
                {supplements
                  ?.filter((s) => s.name == ma.activityName)
                  .map((sa) => (
                    <CheckCircle2 className="inline-block w-4" key={sa.id} />
                  ))}
              </span>
              {ma.label}
            </Button>
          ))}
        </div>
        <div className="w-full flex-1">
          <h3 className="text-right text-sm uppercase tracking-widest">Night</h3>

          {nightActivities?.map((ma) => (
            <Button
              onClick={() => saveActivity(ma)}
              variant={'outline'}
              size={'sm'}
              className="mt-1 flex w-full justify-between text-xs"
              key={ma.id}
            >
              <span>
                {supplements
                  ?.filter((s) => s.name == ma.activityName)
                  .map((sa) => (
                    <CheckCircle2 className="inline-block w-4" key={sa.id} />
                  ))}
              </span>
              {ma.label}
            </Button>
          ))}
        </div>
      </div>
      <DieOffSymptoms date={currentDate} />
      <div className="h-8">{/* Padding for bottom */}</div>
      <div className="bottom-inset fixed bottom-3 right-3">
        <Button asChild variant={'cyan'}>
          <Link prefetch="intent" to="/blog/posts/food-guide">
            <BotIcon className="mr-2" /> Food Guide
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Dashboard
