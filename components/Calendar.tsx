'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const scheduledPosts = [
  {
    id: 1,
    title: "Product Launch Announcement",
    content: "Excited to announce our new product launch! 🚀",
    platform: 'LinkedIn',
    scheduledFor: new Date(2024, 0, 15, 10, 0),
    status: 'scheduled'
  },
  {
    id: 2,
    title: "Behind the Scenes",
    content: "A day in the life of our development team...",
    platform: 'Instagram',
    scheduledFor: new Date(2024, 0, 16, 14, 30),
    status: 'scheduled'
  },
  {
    id: 3,
    title: "Industry Insights",
    content: "5 trends that will shape our industry in 2024",
    platform: 'LinkedIn',
    scheduledFor: new Date(2024, 0, 18, 9, 0),
    status: 'scheduled'
  },
  {
    id: 4,
    title: "Team Spotlight",
    content: "Meet our amazing team members! 👥",
    platform: 'Instagram',
    scheduledFor: new Date(2024, 0, 20, 16, 0),
    status: 'scheduled'
  }
]

const platformColors = {
  'LinkedIn': 'bg-linkedin',
  'Instagram': 'bg-instagram',
  'YouTube': 'bg-youtube',
  'Reddit': 'bg-reddit'
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => isSameDay(post.scheduledFor, date))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600">Plan and visualize your content schedule</p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Schedule Post
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day, index) => {
            const postsForDay = getPostsForDate(day)
            const isCurrentDay = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer transition-colors ${
                  isCurrentDay ? 'bg-primary-50 border-primary-200' : ''
                } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-primary-700' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                
                {/* Posts for this day */}
                <div className="space-y-1">
                  {postsForDay.slice(0, 2).map(post => (
                    <div
                      key={post.id}
                      className={`text-xs p-1 rounded truncate ${platformColors[post.platform as keyof typeof platformColors]} text-white`}
                      title={post.title}
                    >
                      {post.title}
                    </div>
                  ))}
                  {postsForDay.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{postsForDay.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {getPostsForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getPostsForDate(selectedDate).map(post => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        platformColors[post.platform as keyof typeof platformColors]
                      } text-white`}>
                        {post.platform}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {format(post.scheduledFor, 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <TrashIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                  <p className="text-sm text-gray-600">{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No posts scheduled for this date</p>
              <button className="mt-2 text-primary-600 hover:text-primary-700 font-medium">
                Schedule a post
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Posts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Posts</h3>
        <div className="space-y-3">
          {scheduledPosts
            .filter(post => post.scheduledFor > new Date())
            .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())
            .slice(0, 5)
            .map(post => (
              <div key={post.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${platformColors[post.platform as keyof typeof platformColors]}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{post.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(post.scheduledFor, 'MMM d, h:mm a')} • {post.platform}
                    </p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Edit
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
