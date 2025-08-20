'use client'

import { useState } from 'react'
import { PlatformService } from '@/lib/api/platformService'
import { AuthService } from '@/lib/auth'
import toast from 'react-hot-toast'

interface APITesterProps {
  onConnectionSuccess?: (platform: string) => void
}

export default function APITester({ onConnectionSuccess }: APITesterProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [testContent, setTestContent] = useState('This is a test post from Post Genius! 🚀')
  const [isPosting, setIsPosting] = useState<string | null>(null)

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', color: 'text-linkedin' },
    { id: 'reddit', name: 'Reddit', color: 'text-reddit' },
    { id: 'threads', name: 'Threads', color: 'text-threads' }
  ]

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId)
    
    try {
      const authUrl = PlatformService.getAuthUrl(platformId as 'linkedin' | 'reddit' | 'threads')
      window.location.href = authUrl
    } catch (error: any) {
      toast.error(`Failed to connect to ${platformId}: ${error.message}`)
      setIsConnecting(null)
    }
  }

  const handleTestPost = async (platformId: string) => {
    setIsPosting(platformId)
    
    try {
      const connections = PlatformService.getConnections()
      const connection = connections.find(c => c.platform === platformId)
      
      if (!connection) {
        toast.error(`No connection found for ${platformId}`)
        return
      }

      const postId = await PlatformService.publishPost(platformId as 'linkedin' | 'reddit' | 'threads', {
        content: testContent,
        platforms: [platformId],
        scheduledFor: new Date(),
        status: 'published',
        hashtags: ['#test', '#postgenius'],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      toast.success(`Successfully posted to ${platformId}! Post ID: ${postId}`)
    } catch (error: any) {
      toast.error(`Failed to post to ${platformId}: ${error.message}`)
    } finally {
      setIsPosting(null)
    }
  }

  const getConnectionStatus = (platformId: string) => {
    const connections = PlatformService.getConnections()
    return connections.find(c => c.platform === platformId)
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">API Connection Tester</h2>
      <p className="text-gray-600 mb-6">Test real API connections and posting functionality</p>

      {/* Test Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Post Content
        </label>
        <textarea
          value={testContent}
          onChange={(e) => setTestContent(e.target.value)}
          className="input-field w-full"
          rows={3}
          placeholder="Enter content to test posting..."
        />
      </div>

      {/* Platform Connections */}
      <div className="space-y-4">
        {platforms.map((platform) => {
          const connection = getConnectionStatus(platform.id)
          
          return (
            <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className={`text-xl mr-3 ${platform.color}`}>
                    {platform.id === 'linkedin' && '💼'}
                    {platform.id === 'reddit' && '🤖'}
                    {platform.id === 'threads' && '🧵'}
                  </span>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {connection ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      <span className="text-sm">Not Connected</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {!connection ? (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting === platform.id}
                    className="btn-primary flex-1"
                  >
                    {isConnecting === platform.id ? 'Connecting...' : 'Connect'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleTestPost(platform.id)}
                      disabled={isPosting === platform.id}
                      className="btn-primary flex-1"
                    >
                      {isPosting === platform.id ? 'Posting...' : 'Test Post'}
                    </button>
                    <button
                      onClick={() => {
                        PlatformService.deleteConnection(platform.id)
                        toast.success(`Disconnected from ${platform.name}`)
                      }}
                      className="btn-secondary"
                    >
                      Disconnect
                    </button>
                  </>
                )}
              </div>

              {connection && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Connected as: {connection.profile?.name || 'Unknown'}</p>
                  <p>Connected at: {new Date(connection.connectedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Environment Variables Check */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Environment Variables Status</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span>LinkedIn Client ID: {process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID ? '✅ Set' : '❌ Missing'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span>Reddit Client ID: {process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ? '✅ Set' : '❌ Missing'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span>Threads Client ID: {process.env.NEXT_PUBLIC_THREADS_CLIENT_ID ? '✅ Set' : '❌ Missing'}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Setup Instructions</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Set up your environment variables in <code>.env.local</code></li>
          <li>2. Create OAuth apps for each platform</li>
          <li>3. Configure redirect URIs in your OAuth apps</li>
          <li>4. Click "Connect" to test the OAuth flow</li>
          <li>5. Use "Test Post" to verify real posting functionality</li>
        </ol>
      </div>
    </div>
  )
}
