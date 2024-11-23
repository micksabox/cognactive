import { differenceInCalendarDays, isSameDay, startOfDay } from 'date-fns'
import { BookIcon, BotIcon, CheckCircle2, Moon, Sun } from 'lucide-react'

import { Button } from 'src/components/ui/button'
import DieOffSymptoms from './die-off-symptoms'
import { useTrackSupplement } from './use-track-supplement'
import db, { IRegimen } from './db'
import { cn, formatDateKey } from 'src/lib/utils'
import { useState, useEffect } from 'react'
import { DatePicker } from 'src/components/date-picker'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router'
import ProgressIndicator from './progress-indicator'
import DailyNoteForm from './daily-note-form'
import { useRegimen } from './use-regimen'

interface DashboardProps {
  startDate: Date
}

interface TrackerToolProps {
  title?: string
  children?: React.ReactNode
  toolbarClassName?: string
  toolbarItems?: React.ReactNode
}

export const TrackerTool: React.FC<TrackerToolProps> = ({ title, children, toolbarItems, toolbarClassName }) => {
  return (
    <div className="">
      {title && (
        <h3 className="flex items-center justify-between text-2xl font-light text-gray-700">
          {title}
          <div className={cn('flex items-center py-2', toolbarClassName || 'justify-between')}>{toolbarItems}</div>
        </h3>
      )}
      {children && <div className="p-2">{children}</div>}
    </div>
  )
}

const Dashboard: React.FC<DashboardProps> = ({ startDate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // On focus sets date to today
  useEffect(function resetToToday() {
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

  const { supplements, addSupplementActivity } = useTrackSupplement(dateKey)

  const { morningActivities, nightActivities } = useRegimen()

  useEffect(
    function loadPhase1Activities() {
      // Phase 1 activities may not be loaded for new installations
      if (morningActivities?.length == 0 && nightActivities?.length == 0) {
        db.loadPhase1Activities(db.regimen).then(() => {
          // Phase 1 activities loaded
        })
      }
    },
    [morningActivities, nightActivities],
  )

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

  return (
    <div>
      <TrackerTool>
        <ProgressIndicator startDate={startDate} currentDate={currentDate} />
      </TrackerTool>
      <TrackerTool>
        <div className="flex items-center">
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
      </TrackerTool>

      <TrackerTool
        toolbarItems={
          <Button asChild size={'sm'} variant={'secondary'}>
            <Link to={'/tracker-regimen'}>Customize</Link>
          </Button>
        }
        title="Daily Regimen"
      >
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              morningActivities?.forEach((ma) => saveActivity(ma))
            }}
            className="flex justify-between bg-gradient-to-r from-blue-300 to-green-800"
          >
            <Sun className="w-4 text-yellow-300" />
            Morning
          </Button>
          <Button
            onClick={() => {
              nightActivities?.forEach((ma) => saveActivity(ma))
            }}
            className="flex justify-between bg-gradient-to-r from-slate-900 to-blue-900"
          >
            <Moon className="w-4 text-blue-400" />
            Night
          </Button>
        </div>

        <div id="regimen" className="flex gap-2">
          <div className="w-full flex-1">
            {morningActivities?.map((ma) => (
              <Button
                onClick={() => saveActivity(ma)}
                variant={'outline'}
                className="mt-2 flex w-full justify-between text-xs"
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
            {nightActivities?.map((ma) => (
              <Button
                onClick={() => saveActivity(ma)}
                variant={'outline'}
                className="mt-2 flex w-full justify-between text-xs"
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
      </TrackerTool>
      <TrackerTool
        title="Note Journal"
        toolbarItems={
          <Button asChild size={'sm'} variant={'secondary'}>
            <Link to={'/tracker-journal'}>
              <BookIcon className="mr-2 w-4" /> Read All Notes
            </Link>
          </Button>
        }
      >
        <DailyNoteForm dateKey={dateKey} />
      </TrackerTool>
      <DieOffSymptoms date={currentDate} />
      <div className="h-8">{/* Padding for bottom */}</div>
      <div className="bottom-inset fixed bottom-3 right-3">
        <Button asChild variant={'cyan'}>
          <Link prefetch="render" to="/blog/posts/food-guide">
            <BotIcon className="mr-2" /> Food Guide
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Dashboard
