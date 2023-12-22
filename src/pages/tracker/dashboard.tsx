import { differenceInCalendarDays, addMonths } from 'date-fns'
import { CheckCircle, Circle, Moon, Sun } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Progress } from 'src/components/ui/progress'
import DieOffSymptoms from './die-off-symptoms'
import useLocalStorageState from 'src/hooks/use-localstorage-state'

interface DashboardProps {
  startDate: Date
}

const Dashboard: React.FC<DashboardProps> = ({ startDate }) => {
  const today = new Date()
  const start = startDate
  const dateKey = today.toISOString().split('T')[0]
  const dayNumber = differenceInCalendarDays(today, start)
  const twoMonthsLater = addMonths(start, 2)
  const daysUntilTwoMonths = differenceInCalendarDays(twoMonthsLater, today)

  type RegimenActivities = {
    oreganoOil: boolean
    nac: boolean
    blackSeedOil: boolean
    nightOreganoOil: boolean
    nightNac: boolean
    nightBlackSeedOil: boolean
  }

  type ActivitiesState = Record<string, RegimenActivities>

  const [activities, setActivities] = useLocalStorageState<ActivitiesState>('nactivities', {})

  const saveActivityState = (activityName: keyof RegimenActivities, state: boolean) => {
    const currentDayActivities = activities[dateKey] || {
      morning: false,
      nighttime: false,
      oreganoOil: false,
      nac: false,
      blackSeedOil: false,
      nightOreganoOil: false,
      nightNac: false,
      nightBlackSeedOil: false,
    }

    const updatedActivities = {
      ...activities,
      [dateKey]: {
        ...currentDayActivities,
        [activityName]: state,
      },
    }

    setActivities(updatedActivities)
  }

  const todaysActivities = activities[dateKey] || {}

  return (
    <div>
      <p className="text-2xl font-bold">Today is day {dayNumber}</p>

      {daysUntilTwoMonths > 0 ? (
        <>
          <p className="mb-2">{daysUntilTwoMonths} days until 2 month milestone</p>
          <Progress value={dayNumber} max={daysUntilTwoMonths + dayNumber} />
        </>
      ) : (
        <p>2 months have passed since protocol started.</p>
      )}

      <h3 className="my-4 text-center text-2xl font-light">Your Daily Regimen</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button>
          Morning <Sun className="w-4 text-yellow-300" />{' '}
          {todaysActivities &&
            todaysActivities.oreganoOil &&
            todaysActivities.nac &&
            todaysActivities.blackSeedOil &&
            'Complete'}
        </Button>
        <Button>
          Nightime
          <Moon className="w-4 text-blue-400" />{' '}
          {todaysActivities &&
            todaysActivities.nightOreganoOil &&
            todaysActivities.nightNac &&
            todaysActivities.nightBlackSeedOil &&
            'Complete'}
        </Button>
        <Button
          onClick={() => saveActivityState('oreganoOil', !todaysActivities.oreganoOil)}
          variant={'outline'}
          className="border p-2"
        >
          {todaysActivities.oreganoOil ? <CheckCircle className="w-4 text-green-600" /> : <Circle className="w-4" />}
          Oregano Oil
        </Button>
        <Button variant={'outline'} className="border p-2">
          Oregano Oil
        </Button>
        <Button variant={'outline'} className="border p-2">
          NAC
        </Button>
        <Button variant={'outline'} className="border p-2">
          NAC
        </Button>
        <Button variant={'outline'} className="border p-2">
          Black Seed Oil
        </Button>
        <Button variant={'outline'} className="border p-2">
          Black Seed Oil
        </Button>
      </div>
      <h3 className="my-4 text-center text-2xl font-light">How do you feel?</h3>
      <DieOffSymptoms />
    </div>
  )
}

export default Dashboard
