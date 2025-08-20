'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Post, Platform } from '@/lib/types'
import { getPosts, savePost, getPlatforms } from '@/lib/storage'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import toast from 'react-hot-toast'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  platforms: string[]
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  color: string
  post: Post
}

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const posts = getPosts()
    const platformData = getPlatforms()
    setPlatforms(platformData)

    // Convert posts to calendar events
    const calendarEvents: CalendarEvent[] = posts.map(post => ({
      id: post.id,
      title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
      date: post.scheduledFor || post.createdAt,
      platforms: post.platforms,
      status: post.status,
      color: getPlatformColor(post.platforms[0]),
      post
    }))

    setEvents(calendarEvents)
  }

  const getPlatformColor = (platformId: string): string => {
    const platform = platforms.find(p => p.id === platformId)
    if (!platform) return 'bg-gray-500'
    
    switch (platform.id) {
      case 'linkedin': return 'bg-linkedin'
      case 'instagram': return 'bg-instagram'
      case 'youtube': return 'bg-youtube'
      case 'reddit': return 'bg-reddit'
      default: return 'bg-gray-500'
    }
  }

  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate))
    const end = endOfWeek(endOfMonth(currentDate))
    return eachDayOfInterval({ start, end })
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const handleDragStart = (event: React.DragEvent, calendarEvent: CalendarEvent) => {
    setDraggedEvent(calendarEvent)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (event: React.DragEvent, targetDate: Date) => {
    event.preventDefault()
    
    if (!draggedEvent) return

    // Update the event date
    const updatedEvent = { ...draggedEvent, date: targetDate }
    const updatedEvents = events.map(e => e.id === draggedEvent.id ? updatedEvent : e)
    setEvents(updatedEvents)

    // Update the post in storage
    const updatedPost = { ...draggedEvent.post, scheduledFor: targetDate }
    savePost(updatedPost)

    setDraggedEvent(null)
    toast.success('Post rescheduled successfully!')
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedEvents = events.filter(e => e.id !== eventId)
      setEvents(updatedEvents)
      setShowEventModal(false)
      setSelectedEvent(null)
      toast.success('Post deleted successfully!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return '✅'
      case 'scheduled': return '⏰'
      case 'draft': return '📝'
      case 'failed': return '❌'
      default: return '📝'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
        <p className="text-gray-600">Drag and drop to reschedule your posts</p>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === 'month' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === 'week' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {getCalendarDays().map((day, index) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${isToday ? 'bg-blue-50' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                {/* Day Number */}
                <div className={`text-sm font-medium mb-2 ${
                  !isCurrentMonth ? 'text-gray-400' : 
                  isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onClick={() => handleEventClick(event)}
                      className={`p-2 rounded text-xs cursor-pointer transition-all hover:shadow-md ${
                        event.color
                      } text-white truncate`}
                      title={event.title}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{event.title}</span>
                        <span>{getStatusIcon(event.status)}</span>
                      </div>
                      <div className="flex items-center mt-1 space-x-1">
                        {event.platforms.slice(0, 2).map(platformId => {
                          const platform = platforms.find(p => p.id === platformId)
                          return (
                            <span key={platformId} className="text-xs opacity-75">
                              {platform?.icon || '📱'}
                            </span>
                          )
                        })}
                        {event.platforms.length > 2 && (
                          <span className="text-xs opacity-75">+{event.platforms.length - 2}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Post Details</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <p className="text-gray-900 text-sm">{selectedEvent.post.content}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.platforms.map(platformId => {
                      const platform = platforms.find(p => p.id === platformId)
                      return (
                        <span key={platformId} className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {platform?.name || platformId}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`text-sm px-2 py-1 rounded ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled For</label>
                  <p className="text-gray-900 text-sm">
                    {format(selectedEvent.date, 'PPP p')}
                  </p>
                </div>

                {selectedEvent.post.hashtags && selectedEvent.post.hashtags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.post.hashtags.map((hashtag, index) => (
                        <span key={index} className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
