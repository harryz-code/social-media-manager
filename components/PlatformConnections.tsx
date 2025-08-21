'use client'

import { useState, useEffect } from 'react'
import { 
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { PlatformService, PlatformConnection } from '@/lib/api/platformService'
import toast from 'react-hot-toast'

export default function PlatformConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConnections()
    validateConnections()
  }, [])

  const loadConnections = () => {
    const platformConnections = PlatformService.getConnections()
    setConnections(platformConnections)
    setIsLoading(false)
  }

  const validateConnections = async () => {
    try {
      await PlatformService.validateConnections()
      loadConnections() // Reload to get updated validation status
    } catch (error) {
      console.error('Connection validation error:', error)
    }
  }

  const handleConnect = (platform: 'linkedin' | 'reddit') => {
    try {
      const authUrl = PlatformService.getAuthUrl(platform)
      window.open(authUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes')
      
      // Listen for auth completion
      const checkAuth = setInterval(() => {
        const connection = PlatformService.getConnection(platform)
        if (connection) {
          clearInterval(checkAuth)
          loadConnections()
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

  const handleDisconnect = (platform: string) => {
    if (confirm(`Are you sure you want to disconnect ${platform}?`)) {
      PlatformService.removeConnection(platform)
      loadConnections()
      toast.success(`${platform} disconnected`)
    }
  }

  const getStatusColor = (connection: PlatformConnection) => {
    if (!connection.isValid) return 'text-red-600'
    return 'text-green-600'
  }

  const getStatusIcon = (connection: PlatformConnection) => {
    if (!connection.isValid) return <XCircleIcon className="w-5 h-5 text-red-600" />
    return <CheckCircleIcon className="w-5 h-5 text-green-600" />
  }

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      description: 'Professional networking and business content',
      features: ['Text posts', 'Professional audience', 'Business analytics', 'Free API'],
      color: 'border-blue-200 hover:border-blue-300',
      status: 'active'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '🤖',
      description: 'Community discussions and content sharing',
      features: ['Text & link posts', 'Subreddit targeting', 'Community engagement', 'Free API'],
      color: 'border-orange-200 hover:border-orange-300',
      status: 'active'
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: '🧵',
      description: 'Instagram\'s text-focused social platform',
      features: ['Text posts', 'Conversational content', 'Instagram integration', 'Free API'],
      color: 'border-purple-200 hover:border-purple-300',
      status: 'active'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      description: 'Social networking and community building',
      features: ['Text posts', 'Community engagement', 'Personal & business pages'],
      color: 'border-blue-200 hover:border-blue-300',
      status: 'coming-soon'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '🐦',
      description: 'Real-time social networking',
      features: ['Short-form content', 'Real-time engagement', 'Trending topics'],
      color: 'border-gray-200 hover:border-gray-300',
      status: 'coming-soon'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading platform connections...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Connections</h1>
        <p className="text-gray-600">Connect your social media accounts to start publishing</p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const connection = connections.find(c => c.platform === platform.id)
          const isConnected = connection && connection.isValid

          return (
            <div key={platform.id} className={`card border-2 ${platform.color} transition-all duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                    {connection && (
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(connection)}
                        <span className={`text-sm ${getStatusColor(connection)}`}>
                          {connection.isValid ? 'Connected' : 'Connection Error'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {platform.status === 'coming-soon' && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    Coming Soon
                  </span>
                )}
                {platform.status === 'active' && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    Available
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4">{platform.description}</p>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {platform.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connection Info */}
              {connection && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{connection.profile.name}</div>
                    {connection.profile.username && (
                      <div className="text-gray-600">@{connection.profile.username}</div>
                    )}
                    <div className="text-gray-500 text-xs mt-1">
                      Connected {new Date(connection.connectedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {platform.status === 'coming-soon' ? (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : isConnected ? (
                  <>
                    <button
                      onClick={() => validateConnections()}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Refresh connection"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="flex-1 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id as 'linkedin' | 'reddit' | 'threads')}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Connect</span>
                  </button>
                )}
              </div>

              {/* Warning for invalid connections */}
              {connection && !connection.isValid && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Connection expired. Please reconnect.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Setup Instructions */}
      <div className="mt-12 card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Instructions for Text-Focused Platforms</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-900">LinkedIn (Free API):</h3>
            <p>Create a LinkedIn app at <a href="https://developer.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">developer.linkedin.com</a>. Request access to Marketing Developer Platform for posting capabilities.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Reddit (Free API):</h3>
            <p>Create a Reddit app at <a href="https://reddit.com/prefs/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">reddit.com/prefs/apps</a>. Choose "web app" type and set redirect URI to <code className="bg-gray-100 px-1 rounded">http://localhost:3000/auth/reddit/callback</code>.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Threads (Free API):</h3>
            <p>Create an Instagram app at <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">developers.facebook.com/apps</a>. Configure Instagram Basic Display API for Threads integration.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Environment Variables:</h3>
            <p>Add your API credentials to <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root. See <code className="bg-gray-100 px-1 rounded">env.example</code> for the required variables.</p>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Why These Platforms?</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• <strong>Text-focused:</strong> All three platforms excel at text content</li>
              <li>• <strong>Free APIs:</strong> No paid subscriptions required</li>
              <li>• <strong>Active communities:</strong> High engagement potential</li>
              <li>• <strong>Professional & casual:</strong> Cover different audience types</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
