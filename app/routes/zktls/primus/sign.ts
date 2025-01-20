import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk'
import type { Route } from './+types/sign'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const signParams = url.searchParams.get('signParams')

  if (!signParams) {
    throw new Response('Missing signParams parameter', { status: 400 })
  }

  try {
    const appId = process.env.PRIMUS_APP_ID
    const appSecret = process.env.PRIMUS_APP_SECRET

    if (!appId || !appSecret) {
      throw new Error('Missing required environment variables')
    }

    // Create a PrimusZKTLS object
    const primusZKTLS = new PrimusZKTLS()

    // Initialize with appId and appSecret
    await primusZKTLS.init(appId, appSecret)

    // Sign the attestation request
    console.log('signParams=', signParams)
    const signResult = await primusZKTLS.sign(signParams)
    console.log('signResult=', signResult)

    return new Response(signResult, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error signing request:', error)
    throw new Response('Error processing request', { status: 500 })
  }
}
