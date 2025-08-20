'use client'

import { useState } from 'react'
import { 
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const timeRanges = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' },
]

const platformStats = [
  {
    platform: 'LinkedIn',
    followers: '12.5k',
    posts: 24,
    engagement: '4.2%',
    reach: '45.2k',
    change: '+12%',
    changeType: 'positive'
  },
  {
    platform: 'Reddit',
    followers: '1.8k',
    posts: 12,
    engagement: '8.5%',
    reach: '8.9k',
    change: '+15%',
    changeType: 'positive'
  },
  {
    platform: 'Threads',
    followers: '5.2k',
    posts: 15,
    engagement: '6.1%',
    reach: '18.3k',
    change: '+22%',
    changeType: 'positive'
  },
  {
    platform: 'Facebook',
    followers: '9.7k',
    posts: 20,
    engagement: '5.3%',
    reach: '28.1k',
    change: '+7%',
    changeType: 'positive'
  },
  {
    platform: 'X (Twitter)',
    followers: '6.8k',
    posts: 16,
    engagement: '7.2%',
    reach: '22.4k',
    change: '+18%',
    changeType: 'positive'
  },
  {
    platform: 'Weibo',
    followers: '2.1k',
    posts: 8,
    engagement: '9.1%',
    reach: '12.7k',
    change: '+25%',
    changeType: 'positive'
  },
  {
    platform: 'Instagram',
    followers: '8.9k',
    posts: 18,
    engagement: '6.8%',
    reach: '32.1k',
    change: '+8%',
    changeType: 'positive'
  },
  {
    platform: 'TikTok',
    followers: '4.3k',
    posts: 10,
    engagement: '11.2%',
    reach: '19.8k',
    change: '+31%',
    changeType: 'positive'
  },
  {
    platform: 'YouTube',
    followers: '3.2k',
    posts: 6,
    engagement: '2.1%',
    reach: '15.8k',
    change: '-3%',
    changeType: 'negative'
  }
]

const topPosts = [
  {
    id: 1,
    content: "Just launched our new product! 🚀 Excited to share how we're revolutionizing the industry...",
    platform: 'LinkedIn',
    publishedAt: '2024-01-10',
    engagement: {
      views: 15420,
      likes: 892,
      comments: 156,
      shares: 89
    },
    engagementRate: '8.2%'
  },
  {
    id: 2,
    content: "Behind the scenes: Our team working late to perfect the user experience. Dedication pays off! 💪",
    platform: 'Instagram',
    publishedAt: '2024-01-08',
    engagement: {
      views: 12340,
      likes: 1234,
      comments: 89,
      shares: 45
    },
    engagementRate: '12.1%'
  },
  {
    id: 3,
    content: "5 tips for better productivity that actually work. Thread 🧵",
    platform: 'LinkedIn',
    publishedAt: '2024-01-05',
    engagement: {
      views: 9876,
      likes: 567,
      comments: 78,
      shares: 34
    },
    engagementRate: '6.9%'
  }
]

export default function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your social media performance and engagement</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedTimeRange(range.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedTimeRange === range.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Followers</p>
              <p className="text-2xl font-bold text-gray-900">26.4k</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+8.2%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">60</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12</span>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
              <p className="text-2xl font-bold text-gray-900">5.4%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+1.2%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900">102k</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+15.3%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Followers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Posts</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Engagement</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Reach</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Growth</th>
              </tr>
            </thead>
            <tbody>
              {platformStats.map((stat) => (
                <tr key={stat.platform} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        stat.platform === 'LinkedIn' ? 'bg-linkedin' :
                        stat.platform === 'Instagram' ? 'bg-instagram' :
                        stat.platform === 'YouTube' ? 'bg-youtube' :
                        'bg-reddit'
                      }`}></div>
                      <span className="ml-2 font-medium text-gray-900">{stat.platform}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{stat.followers}</td>
                  <td className="py-3 px-4 text-gray-900">{stat.posts}</td>
                  <td className="py-3 px-4 text-gray-900">{stat.engagement}</td>
                  <td className="py-3 px-4 text-gray-900">{stat.reach}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className={`mr-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.changeType === 'positive' ? '📈' : '📉'}
                      </span>
                      <span className={`font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Posts</h2>
        <div className="space-y-4">
          {topPosts.map((post) => (
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
                  <span className="ml-2 text-sm text-gray-500">
                    {post.publishedAt}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{post.engagementRate}</p>
                  <p className="text-xs text-gray-500">Engagement Rate</p>
                </div>
              </div>
              
              <p className="text-gray-900 mb-3 line-clamp-2">{post.content}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
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
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement by Platform</h3>
          <div className="space-y-4">
            {platformStats.map((stat) => (
              <div key={stat.platform} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    stat.platform === 'LinkedIn' ? 'bg-linkedin' :
                    stat.platform === 'Instagram' ? 'bg-instagram' :
                    stat.platform === 'YouTube' ? 'bg-youtube' :
                    'bg-reddit'
                  }`}></div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{stat.platform}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${parseFloat(stat.engagement)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stat.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Posts Published</span>
              <span className="text-sm text-gray-500">60</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Scheduled Posts</span>
              <span className="text-sm text-gray-500">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Draft Posts</span>
              <span className="text-sm text-gray-500">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Best Posting Time</span>
              <span className="text-sm text-gray-500">9:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Best Day</span>
              <span className="text-sm text-gray-500">Tuesday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
