import { useState } from 'react'
import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk'

interface PrimusZKTLSConfig {
  appId: string
  templateId: string
  apiEndpoint?: string
}

interface PrimusZKTLSResult {
  isLoading: boolean
  error: Error | null
  verify: (userAddress: string) => Promise<boolean>
}

export function usePrimusZKTLS({ appId, templateId }: PrimusZKTLSConfig): PrimusZKTLSResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const verify = async (userAddress: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Initialize PrimusZKTLS
      const primusZKTLS = new PrimusZKTLS()
      const initResult = await primusZKTLS.init(appId)

      if (!initResult) {
        throw new Error('Failed to initialize PrimusZKTLS')
      }

      // Generate attestation request
      const request = primusZKTLS.generateRequestParams(templateId, userAddress)

      // Set additional parameters
      //   const additionalParams = JSON.stringify({
      //     timestamp: Date.now(),
      //     environment: process.env.NODE_ENV,
      //   })
      //   request.setAdditionParams(additionalParams)

      // Set TLS proxy mode
      request.setAttMode({
        algorithmType: 'mpctls',
      })

      // Convert request to JSON string
      const requestStr = request.toJsonString()

      // Get signed response from backend
      const response = await fetch(`/zktls/primus/sign?signParams=${requestStr}`)

      if (!response.ok) {
        throw new Error('Failed to get signed response')
      }

      const responseJson = await response.json()
      const signedRequestStr = JSON.stringify(responseJson)

      // Start attestation process
      const attestation = await primusZKTLS.startAttestation(signedRequestStr)

      // Verify signature
      const verifyResult = primusZKTLS.verifyAttestation(attestation)

      return verifyResult
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      console.error('PrimusZKTLS verification error:', error.message)
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack)
      }
      setError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    verify,
  }
}
