'use client'

import { useState } from 'react'
import { PlatformService } from '@/lib/api/platformService'
import { LinkedInAPI } from '@/lib/api/linkedin'
import { RedditAPI } from '@/lib/api/reddit'
import { ThreadsAPI } from '@/lib/api/threads'
import toast from 'react-hot-toast'

export default function APITester() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isTesting, setIsTesting] = useState(false)

  const testPlatformConnection = async (platform: string) => {
    setIsTesting(true)
    try {
      const connection = PlatformService.getConnection(platform)
      
      if (!connection) {
        setTestResults(prev => ({
          ...prev,
          [platform]: { status: 'error', message: 'Not connected' }
        }))
        setIsTesting(false)
        return
      }

      let isValid = false
      switch (platform) {
        case 'linkedin':
          isValid = await LinkedInAPI.validateToken(connection.accessToken)
          break
        case 'reddit':
          isValid = await RedditAPI.validateToken(connection.accessToken)
          break
        case 'threads':
          isValid = await ThreadsAPI.validateToken(connection.accessToken)
          break
      }

      setTestResults(prev => ({
        ...prev,
        [platform]: { 
          status: isValid ? 'success' : 'error', 
          message: isValid ? 'Connection valid' : 'Token expired or invalid',
          profile: connection.profile
        }
      }))

      if (isValid) {
        toast.success(`${platform} connection is valid!`)
      } else {
        toast.error(`${platform} connection failed`)
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [platform]: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
      toast.error(`${platform} test failed`)
    } finally {
      setIsTesting(false)
    }
  }

  const testAllConnections = async () => {
    setIsTesting(true)
    const platforms = ['linkedin', 'reddit', 'threads']
    
    for (const platform of platforms) {
      await testPlatformConnection(platform)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    setIsTesting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⏳'
    }
  }

  const handleConnect = (platform: 'linkedin' | 'reddit' | 'threads') => {
    try {
      const authUrl = PlatformService.getAuthUrl(platform)
      window.open(authUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes')
      
      // Listen for auth completion
      const checkAuth = setInterval(() => {
        const connection = PlatformService.getConnection(platform)
        if (connection) {
          clearInterval(checkAuth)
          testPlatformConnection(platform) // Test the connection after connecting
          toast.success(`${platform} connected successfully!`)
        }
      }, 1000)

      // Clear interval after 5 minutes
      setTimeout(() => clearInterval(checkAuth), 300000)
      
    } catch (error) {
      console.error(`Connection error for ${platform}:`, error)
      toast.error(`Failed to connect ${platform}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Connection Tester</h1>
        <p className="text-gray-600">Test your platform connections and verify API functionality</p>
      </div>

      <div className="card">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Connections</h2>
          <div className="flex space-x-4">
            <button
              onClick={testAllConnections}
              disabled={isTesting}
              className="btn-primary"
            >
              {isTesting ? 'Testing...' : 'Test All Connections'}
            </button>
            <button
              onClick={() => setTestResults({})}
              className="btn-secondary"
            >
              Clear Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['linkedin', 'reddit', 'threads'].map((platform) => {
            const connection = PlatformService.getConnection(platform)
            const isConnected = connection && connection.isValid
            
            return (
              <div key={platform} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 capitalize">{platform}</h3>
                  <div className="flex space-x-2">
                    {!isConnected ? (
                      <button
                        onClick={() => handleConnect(platform as 'linkedin' | 'reddit' | 'threads')}
                        disabled={isTesting}
                        className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                      >
                        Connect
                      </button>
                    ) : (
                      <button
                        onClick={() => testPlatformConnection(platform)}
                        disabled={isTesting}
                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        Test
                      </button>
                    )}
                  </div>
                </div>
              
              {testResults[platform] && (
                <div className="space-y-2">
                  <div className={`flex items-center ${getStatusColor(testResults[platform].status)}`}>
                    <span className="mr-2">{getStatusIcon(testResults[platform].status)}</span>
                    <span className="text-sm font-medium">
                      {testResults[platform].status === 'success' ? 'Connected' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {testResults[platform].message}
                  </p>
                  {testResults[platform].profile && (
                    <div className="text-sm text-gray-500">
                      <p>Name: {testResults[platform].profile.name}</p>
                      {testResults[platform].profile.username && (
                        <p>Username: {testResults[platform].profile.username}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )})}
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Information</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-900">LinkedIn API</h3>
            <ul className="mt-2 space-y-1">
              <li>• Character limit: 3,000 characters</li>
              <li>• Professional audience</li>
              <li>• Business-focused content</li>
              <li>• Requires Marketing Developer Platform access</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Reddit API</h3>
            <ul className="mt-2 space-y-1">
              <li>• Character limit: 40,000 characters</li>
              <li>• Community discussions</li>
              <li>• Markdown formatting supported</li>
              <li>• Rate limit: 60 requests/minute</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Threads API</h3>
            <ul className="mt-2 space-y-1">
              <li>• Character limit: 500 characters</li>
              <li>• Conversational content</li>
              <li>• Instagram integration</li>
              <li>• Requires business/creator account for posting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
