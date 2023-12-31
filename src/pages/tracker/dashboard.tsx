import { differenceInCalendarDays, addMonths, isSameDay, startOfDay } from 'date-fns'
import { CheckCircle, Circle, Moon, Sun } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Progress } from 'src/components/ui/progress'
import DieOffSymptoms from './die-off-symptoms'
import { useTrackSupplement } from './use-track-supplement'
import { RegimenActivities } from './db'
import { formatDateKey } from 'src/lib/utils'
import { useState, useEffect } from 'react'
import { DatePicker } from 'src/components/date-picker'
import { toast } from 'react-hot-toast'

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

  return (
    <div>
      <p className="text-2xl font-bold">Day {dayNumber} </p>
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

      {daysUntilTwoMonths > 0 ? (
        <>
          <p className="mt-2 text-center text-xs">{daysUntilTwoMonths} days until 2 month milestone</p>
          <Progress value={dayNumber} max={daysUntilTwoMonths + dayNumber} />
        </>
      ) : (
        <p>2 months have passed since protocol started.</p>
      )}

      <h3 className="my-4 text-center text-2xl font-light">Daily Regimen</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => {
            saveActivityState('oreganoOil', true)
            saveActivityState('nac', true)
            saveActivityState('blackSeedOil', true)
          }}
          className="flex justify-between"
        >
          {todaysActivities && todaysActivities.oreganoOil && todaysActivities.nac && todaysActivities.blackSeedOil ? (
            <Sun className="w-4 text-yellow-300" />
          ) : (
            <Circle className="w-4" />
          )}
          Morning
        </Button>
        <Button
          onClick={() => {
            saveActivityState('nightOreganoOil', true)
            saveActivityState('nightNac', true)
            saveActivityState('nightBlackSeedOil', true)
          }}
          className="flex justify-between"
        >
          {todaysActivities &&
          todaysActivities.nightOreganoOil &&
          todaysActivities.nightNac &&
          todaysActivities.nightBlackSeedOil ? (
            <Moon className="w-4 text-blue-400" />
          ) : (
            <Circle className="w-4" />
          )}
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
    </div>
  )
}

export default Dashboard
