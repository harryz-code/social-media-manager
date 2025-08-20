'use client'

import { useState } from 'react'
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

const stats = [
  { name: 'Scheduled Posts', value: '12', change: '+2', changeType: 'positive' },
  { name: 'Published This Week', value: '8', change: '+3', changeType: 'positive' },
  { name: 'Total Engagement', value: '2.4k', change: '+12%', changeType: 'positive' },
  { name: 'Avg. Reach', value: '15.2k', change: '+8%', changeType: 'positive' },
]

const recentPosts = [
  {
    id: 1,
    content: "Just launched our new product! 🚀 Excited to share how we're revolutionizing the industry...",
    platform: 'LinkedIn',
    scheduledFor: '2024-01-15T10:00:00',
    status: 'scheduled',
    engagement: { views: 1200, likes: 89, comments: 12, shares: 5 }
  },
  {
    id: 2,
    content: "Behind the scenes: Our team working late to perfect the user experience. Dedication pays off! 💪",
    platform: 'Instagram',
    publishedAt: '2024-01-14T15:30:00',
    status: 'published',
    engagement: { views: 3400, likes: 234, comments: 18, shares: 8 }
  },
  {
    id: 3,
    content: "5 tips for better productivity that actually work. Thread 🧵",
    platform: 'LinkedIn',
    scheduledFor: '2024-01-16T09:00:00',
    status: 'scheduled',
    engagement: { views: 0, likes: 0, comments: 0, shares: 0 }
  },
]

const quickActions = [
  { name: 'Create Post', icon: PlusIcon, color: 'bg-primary-500' },
  { name: 'Schedule Content', icon: CalendarIcon, color: 'bg-green-500' },
  { name: 'View Analytics', icon: ChartBarIcon, color: 'bg-purple-500' },
]

export default function Dashboard() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

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
        {stats.map((stat) => (
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
          {recentPosts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.platform === 'LinkedIn' ? 'bg-linkedin text-white' :
                    post.platform === 'Instagram' ? 'bg-instagram text-white' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.platform}
                  </span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {post.status === 'scheduled' 
                    ? `Scheduled for ${format(new Date(post.scheduledFor), 'MMM d, h:mm a')}`
                    : `Published ${format(new Date(post.publishedAt!), 'MMM d, h:mm a')}`
                  }
                </span>
              </div>
              
              <p className="text-gray-900 mb-3 line-clamp-2">{post.content}</p>
              
              {post.status === 'published' && (
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
          ))}
        </div>
      </div>
    </div>
  )
}
