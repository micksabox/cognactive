import { useLoaderData } from '@remix-run/react'
import { PROTOCOL_START_DATE } from 'src/constants'
import ProtocolTracker from 'src/pages/tracker/index'

import { meta as RootMeta } from '../_index'

export const meta = RootMeta

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

  const trimmedString = clientData ? clientData.replace(/"/g, '') : null

  return <ProtocolTracker clientCachedStartDate={clientData ? trimmedString : null} />
}

export default TrackerComponent
