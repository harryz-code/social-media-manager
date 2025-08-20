'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PlatformService } from '@/lib/api/platformService'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function ThreadsCallback() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const state = searchParams.get('state')

      if (error) {
        setStatus('error')
        setMessage(`Authentication failed: ${error}`)
        return
      }

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received')
        return
      }

      try {
        const connection = await PlatformService.handleAuthCallback('threads', code)
        setStatus('success')
        setMessage(`Successfully connected to Threads as @${connection.profile.username}`)
        
        // Close the popup window after a delay
        setTimeout(() => {
          window.close()
        }, 2000)
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Connection failed')
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Threads...</h1>
              <p className="text-gray-600">Please wait while we complete the connection.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Connection Successful!</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">This window will close automatically.</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => window.close()}
                className="btn-primary"
              >
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
