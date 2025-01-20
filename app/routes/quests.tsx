import type { Route } from './+types/quests'
import { usePrimusZKTLS } from 'src/hooks/use-primus-zltls'
import { useState } from 'react'

export async function loader() {
  return {
    appId: process.env.PRIMUS_APP_ID,
  }
}

export default function QuestsRoute(props: Route.ComponentProps) {
  const [address, setAddress] = useState('')
  const { verify, isLoading, error } = usePrimusZKTLS({
    appId: props.loaderData.appId,
    templateId: '2e3160ae-8b1e-45e3-8c59-426366278b9d',
  })

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    await verify(address)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="mb-6 text-2xl font-semibold text-gray-900">ZK-TLS Verification Demo</h1>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500">
                  This demo showcases ZK-TLS verification using the Primus Labs SDK. Enter an Ethereum address and click
                  verify to start the verification process.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Ethereum Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    pattern="^0x[a-fA-F0-9]{40}$"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={isLoading || !address}
                    className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm 
                      ${
                        isLoading || !address
                          ? 'cursor-not-allowed bg-gray-400'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      }`}
                  >
                    {isLoading ? 'Verifying...' : 'Start Verification'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="text-sm text-red-700">{error.message}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
