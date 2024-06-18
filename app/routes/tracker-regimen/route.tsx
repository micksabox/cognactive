import db from 'src/pages/tracker/db'
import { ClientLoaderFunctionArgs, json, useLoaderData } from '@remix-run/react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { useLiveQuery } from 'dexie-react-hooks'
import ContentHeader from 'src/components/content-header.tsx'

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const startedPhase2 = url.searchParams.get('startPhase2') === 'true'

  return json({ startedPhase2 })
}

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  const [serverData, clientData] = await Promise.all([args.serverLoader(), db.regimen.toArray()])

  return {
    // @ts-ignore
    ...serverData,
    regimenActivities: clientData,
  }
}

clientLoader.hydrate = true

export function HydrateFallback() {
  return <p>Loading Regimen...</p>
}

const Regimen: React.FC = () => {
  const loaderData = useLoaderData<typeof clientLoader>()

  const regimenActivities = useLiveQuery(() => db.regimen.orderBy('id').toArray(), [])

  return (
    <div className="max-w-md p-2 md:container">
      <ContentHeader title="Regimen List" linkTo="/tracker" linkText="Tracker" />
      {loaderData.startedPhase2 && (
        <Alert className="mt-2">
          <AlertTitle>Phase 2</AlertTitle>
          <AlertDescription>
            The supplements Niacin, Pomegranate Seed Extract and Pterostilbene have been added to the regimen according
            to the NAC protocol phase 2. Some phase 1 and phase 2 supplements have been hidden, but you can choose to
            make them visible as needed. To make the transition to phase 2 smoother, only pomegranate extract is visible
            by default. Customize your regimen by changing visibility.
          </AlertDescription>
        </Alert>
      )}
      <div className="my-2">
        <DataTable data={regimenActivities || loaderData.regimenActivities} columns={columns} />
      </div>
    </div>
  )
}

export default Regimen
