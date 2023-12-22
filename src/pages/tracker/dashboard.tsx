import { differenceInCalendarDays, addMonths } from 'date-fns'
import { Button } from 'src/components/ui/button'
import { Progress } from 'src/components/ui/progress'

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

      <h3 className="my-4 text-center text-2xl font-light">Daily Regimen</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="border p-2">Oregano Oil</button>
        <button className="border p-2">Oregano Oil</button>
        <button className="border p-2">NAC</button>
        <button className="border p-2">NAC</button>
        <button className="border p-2">Black Seed Oil</button>
        <button className="border p-2">Black Seed Oil</button>
        <Button>Morning</Button>
        <Button>Nightime</Button>
      </div>
    </div>
  )
}

export default Dashboard
