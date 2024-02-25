import db from 'src/pages/tracker/db'
import { Link, useLoaderData } from '@remix-run/react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { ChevronLeft } from 'lucide-react'

export const clientLoader = async () => {
  const regimenActivities = await db.regimen.toArray()

  return {
    regimenActivities,
  }
}

export function HydrateFallback() {
  return <p>Loading Regimen...</p>
}

const Regimen: React.FC = () => {
  const clientData = useLoaderData<typeof clientLoader>()

  return (
    <div className="max-w-md p-2 md:container">
      <p>
        <Link className="text-gray-400" to={'/tracker'}>
          <ChevronLeft className="inline-block w-4" /> Return to Tracker
        </Link>
      </p>
      <h1 className="text-2xl">Customize Regimen</h1>
      <div className="my-2">
        <DataTable data={clientData.regimenActivities} columns={columns} />
      </div>
    </div>
  )
}

export default Regimen
