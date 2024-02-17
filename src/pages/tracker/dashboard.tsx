import { differenceInCalendarDays, addMonths, isSameDay, startOfDay } from 'date-fns'
import { BotIcon, CheckCircle, Circle, ListChecksIcon, Moon, Sun } from 'lucide-react'

import { Button } from 'src/components/ui/button'
import DieOffSymptoms from './die-off-symptoms'
import { useTrackSupplement } from './use-track-supplement'
import { RegimenActivities } from './db'
import { cn, formatDateKey } from 'src/lib/utils'
import { useState, useEffect } from 'react'
import { DatePicker } from 'src/components/date-picker'
import { toast } from 'react-hot-toast'
import { Link } from '@remix-run/react'
import ProgressIndicator from './progress-indicator'
import DailyNoteForm from './daily-note-form'

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

  const { activities, addSupplementActivity } = useTrackSupplement(dateKey)

  const saveActivityState = (activityName: keyof RegimenActivities, state: boolean) => {
    addSupplementActivity({
      date: dateKey,
      dosage: '', // TODO: Implement
      name: activityName,
    }).then((maybeId) => {
      console.log(activityName, state, maybeId)
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
      <ProgressIndicator completed={false} startDate={startDate} currentDate={currentDate} />
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

      <h3 className="my-4 flex text-2xl font-light">
        Daily Regimen{' '}
        {morningDone && nightDone && (
          <span>
            <ListChecksIcon className="inline-block text-green-700" />
          </span>
        )}
        <DailyNoteForm dateKey={dateKey} />
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => {
            saveActivityState('oreganoOil', true)
            saveActivityState('nac', true)
            saveActivityState('blackSeedOil', true)
          }}
          className={cn(morningDone && 'bg-gradient-to-r from-blue-300 to-green-800', 'flex justify-between')}
        >
          {morningDone ? <Sun className="w-4 text-yellow-300" /> : <Circle className="w-4" />}
          Morning
        </Button>
        <Button
          onClick={() => {
            saveActivityState('nightOreganoOil', true)
            saveActivityState('nightNac', true)
            saveActivityState('nightBlackSeedOil', true)
          }}
          className={cn(
            nightDone && 'bg-gradient-to-r from-indigo-950 to-blue-900',
            'flex justify-between transition-colors',
          )}
        >
          {nightDone ? <Moon className="w-4 text-blue-400" /> : <Circle className="w-4" />}
          Nightime
        </Button>
        <Button
          onClick={() => saveActivityState('oreganoOil', !todaysActivities.oreganoOil)}
          variant={'outline'}
          className="flex justify-between border p-2"
        >
          {todaysActivities.oreganoOil ? <CheckCircle className="w-4 text-green-600" /> : <Circle className="w-4" />}
          Oregano Oil
        </Button>
        <Button
          onClick={() => saveActivityState('nightOreganoOil', !todaysActivities.nightOreganoOil)}
          variant={'outline'}
          className="flex justify-between border p-2"
        >
          {todaysActivities.nightOreganoOil ? (
            <CheckCircle className="w-4 text-green-600" />
          ) : (
            <Circle className="w-4" />
          )}
          Oregano Oil
        </Button>
        <Button
          onClick={() => saveActivityState('nac', !todaysActivities.nac)}
          variant={'outline'}
          className="flex justify-between border p-2"
        >
          {todaysActivities.nac ? <CheckCircle className="w-4 text-green-600" /> : <Circle className="w-4" />}
          NAC
        </Button>
        <Button
          onClick={() => saveActivityState('nightNac', !todaysActivities.nightNac)}
          variant={'outline'}
          className="flex justify-between border p-2"
        >
          {todaysActivities.nightNac ? <CheckCircle className="w-4 text-green-600" /> : <Circle className="w-4" />}
          NAC
        </Button>
        <Button
          onClick={() => saveActivityState('blackSeedOil', !todaysActivities.blackSeedOil)}
          variant={'outline'}
          className="flex justify-between border p-2"
        >
          {todaysActivities.blackSeedOil ? <CheckCircle className="w-4 text-green-600" /> : <Circle className="w-4" />}
          Black Seed Oil
        </Button>
        <Button
          onClick={() => saveActivityState('nightBlackSeedOil', !todaysActivities.nightBlackSeedOil)}
          variant={'outline'}
          className="flex justify-between border p-2"
        >
          {todaysActivities.nightBlackSeedOil ? (
            <CheckCircle className="w-4 text-green-600" />
          ) : (
            <Circle className="w-4" />
          )}
          Black Seed Oil
        </Button>
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
