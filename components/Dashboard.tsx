'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { Post, Analytics } from '@/lib/types'
import { getPosts, getAnalytics } from '@/lib/storage'

// Remove static data since we're using real data now

const quickActions = [
  { name: 'Create Post', icon: PlusIcon, color: 'bg-primary-500' },
  { name: 'Schedule Content', icon: CalendarIcon, color: 'bg-green-500' },
  { name: 'View Analytics', icon: ChartBarIcon, color: 'bg-purple-500' },
]

export default function Dashboard() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      const storedPosts = getPosts()
      const storedAnalytics = getAnalytics()
      
      setPosts(storedPosts)
      setAnalytics(storedAnalytics)
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  // Calculate real stats
  const scheduledPosts = posts.filter(post => post.status === 'scheduled').length
  const publishedThisWeek = posts.filter(post => 
    post.status === 'published' && 
    post.publishedAt && 
    new Date(post.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const realStats = [
    { name: 'Scheduled Posts', value: scheduledPosts.toString(), change: '+2', changeType: 'positive' as const },
    { name: 'Published This Week', value: publishedThisWeek.toString(), change: '+3', changeType: 'positive' as const },
    { name: 'Total Engagement', value: analytics?.totalFollowers ? `${(analytics.totalFollowers / 1000).toFixed(1)}k` : '0', change: '+12%', changeType: 'positive' as const },
    { name: 'Avg. Reach', value: analytics?.totalReach ? `${(analytics.totalReach / 1000).toFixed(1)}k` : '0', change: '+8%', changeType: 'positive' as const },
  ]

  // Get recent posts
  const recentPosts = posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your social media.</p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Post
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {realStats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={() => setSelectedAction(action.name)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentPosts.length > 0 ? recentPosts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.platforms.includes('linkedin') ? 'bg-linkedin text-white' :
                    post.platforms.includes('instagram') ? 'bg-instagram text-white' :
                    post.platforms.includes('youtube') ? 'bg-youtube text-white' :
                    post.platforms.includes('reddit') ? 'bg-reddit text-white' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.platforms[0]?.charAt(0).toUpperCase() + post.platforms[0]?.slice(1) || 'Multiple'}
                  </span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {post.status === 'scheduled' && post.scheduledFor
                    ? `Scheduled for ${format(new Date(post.scheduledFor), 'MMM d, h:mm a')}`
                    : post.status === 'published' && post.publishedAt
                    ? `Published ${format(new Date(post.publishedAt), 'MMM d, h:mm a')}`
                    : `Created ${format(new Date(post.createdAt), 'MMM d, h:mm a')}`
                  }
                </span>
              </div>
              
              <p className="text-gray-900 mb-3 line-clamp-2">{post.content}</p>
              
              {post.engagement && (
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {post.engagement.views.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <HeartIcon className="w-4 h-4 mr-1" />
                    {post.engagement.likes}
                  </div>
                  <div className="flex items-center">
                    <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                    {post.engagement.comments}
                  </div>
                  <div className="flex items-center">
                    <ShareIcon className="w-4 h-4 mr-1" />
                    {post.engagement.shares}
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p>No posts yet. Create your first post to get started!</p>
            </div>
          )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
