import { useLoaderData } from '@remix-run/react'
import { PROTOCOL_START_DATE } from 'src/constants'
import ProtocolTracker from 'src/pages/tracker/index'

export const clientLoader = async () => {
  const data = localStorage.getItem(PROTOCOL_START_DATE)

  if (!data) {
    // Remix loaders cannot return nulls as strings, so return here
    return null
  }

  return data
}

const TrackerComponent: React.FC = () => {
  const clientData = useLoaderData<typeof clientLoader>()

  return <ProtocolTracker clientCachedStartDate={clientData} />
}

export default TrackerComponent
