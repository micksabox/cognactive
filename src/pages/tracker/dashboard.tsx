import { differenceInCalendarDays, addMonths } from 'date-fns'
import { Moon, Sun } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Progress } from 'src/components/ui/progress'
import DieOffSymptoms from './die-off-symptoms'

interface DashboardProps {
  startDate: Date
}

const Dashboard: React.FC<DashboardProps> = ({ startDate }) => {
  const today = new Date()
  const start = startDate
  const dayNumber = differenceInCalendarDays(today, start)
  const twoMonthsLater = addMonths(start, 2)
  const daysUntilTwoMonths = differenceInCalendarDays(twoMonthsLater, today)

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
          Morning <Sun className="w-4 text-yellow-300" />
        </Button>
        <Button>
          Nightime
          <Moon className="w-4 text-blue-400" />
        </Button>
        <button className="border p-2">Oregano Oil</button>
        <button className="border p-2">Oregano Oil</button>
        <button className="border p-2">NAC</button>
        <button className="border p-2">NAC</button>
        <button className="border p-2">Black Seed Oil</button>
        <button className="border p-2">Black Seed Oil</button>
      </div>
      <h3 className="my-4 text-center text-2xl font-light">How do you feel?</h3>
      <DieOffSymptoms />
    </div>
  )
}

export default Dashboard
