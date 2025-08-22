'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function XCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    if (hasProcessedRef.current) return
    hasProcessedRef.current = true

    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const state = searchParams.get('state')

      if (error) {
        console.error('X OAuth error:', error)
        toast.error(`X authentication failed: ${error}`)
        router.push('/auth')
        return
      }

      if (!code) {
        console.error('No authorization code received')
        toast.error('No authorization code received from X')
        router.push('/auth')
        return
      }

      try {
        console.log('🔄 Processing X OAuth callback...')
        
        // Call server-side API to exchange code for token
        const response = await fetch('/api/auth/x/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        })

        console.log('📡 X callback API response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to authenticate with X')
        }

        const data = await response.json()
        console.log('✅ X authentication successful')

        // Store tokens and user data
        localStorage.setItem('x_access_token', data.accessToken)
        localStorage.setItem('x_refresh_token', data.refreshToken)
        localStorage.setItem('x_user', JSON.stringify(data.profile))

        toast.success('Successfully connected to X!')
        router.push('/')
      } catch (error) {
        console.error('X callback error:', error)
        toast.error(`Failed to connect to X: ${error instanceof Error ? error.message : 'Unknown error'}`)
        router.push('/auth')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-500">
            <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Connecting to X</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we complete your X authentication...
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  )
}
