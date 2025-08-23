'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

function RedditCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    // Only run once when component mounts
    if (hasProcessedRef.current) {
      return
    }
    
    hasProcessedRef.current = true
    console.log('🔄 Starting Reddit callback processing...')
    
    const handleCallback = async () => {
      
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          console.error('Reddit OAuth error:', error)
          toast.error(`Reddit authorization failed: ${error}`)
          setStatus('error')
          setTimeout(() => router.push('/'), 2000)
          return
        }

        if (!code) {
          console.error('No authorization code received')
          toast.error('No authorization code received from Reddit')
          setStatus('error')
          setTimeout(() => router.push('/'), 2000)
          return
        }

        console.log('🔍 Reddit callback received:')
        console.log('  - Code:', code)
        console.log('  - State:', state)

        // Exchange code for token via server-side API
        console.log('🔄 Making API request to /api/auth/reddit/callback...')
        console.log('🔄 Request payload:', { code: code.substring(0, 10) + '...', state })
        
        const response = await fetch('/api/auth/reddit/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        })

        console.log('📡 API Response status:', response.status)
        console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ API Error response:', errorData)
          console.error('🔍 Debug info from server:', errorData.debug)
          throw new Error(errorData.error || `Failed to exchange code for token (${response.status})`)
        }

        const data = await response.json()
        console.log('✅ Reddit authentication successful:', data)

        // Store the tokens (in a real app, you'd store these securely)
        localStorage.setItem('reddit_access_token', data.accessToken)
        localStorage.setItem('reddit_refresh_token', data.refreshToken)
        localStorage.setItem('reddit_user', JSON.stringify(data.user))

        toast.success('Successfully connected to Reddit!')
        setStatus('success')
        
        // Redirect back to the main app
        setTimeout(() => router.push('/'), 1500)

      } catch (error) {
        console.error('Reddit callback error:', error)
        toast.error(`Failed to authenticate with Reddit: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setStatus('error')
        setTimeout(() => router.push('/'), 2000)
      }
    }

    handleCallback()
  }, []) // Empty dependency array - only run once

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Reddit...</h2>
              <p className="text-gray-600">Please wait while we complete your authentication.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Successfully Connected!</h2>
              <p className="text-gray-600">Redirecting you back to the app...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h2>
              <p className="text-gray-600">There was an error connecting to Reddit. Redirecting you back...</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RedditCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    }>
      <RedditCallbackContent />
    </Suspense>
  )
}
