'use client'

import { useState, useEffect } from 'react'
import { 
  HomeIcon, 
  PencilSquareIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  BellIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  PencilSquareIcon as PencilSquareIconSolid, 
  CalendarIcon as CalendarIconSolid, 
  ChartBarIcon as ChartBarIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid,
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid'

type ActiveTab = 'dashboard' | 'compose' | 'calendar' | 'analytics' | 'settings' | 'todos'

interface SidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

const navigation = [
  { name: 'Dashboard', tab: 'dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: 'Compose', tab: 'compose', icon: PencilSquareIcon, activeIcon: PencilSquareIconSolid },
  { name: 'Calendar', tab: 'calendar', icon: CalendarIcon, activeIcon: CalendarIconSolid },
  { name: 'Analytics', tab: 'analytics', icon: ChartBarIcon, activeIcon: ChartBarIconSolid },
  { name: 'To-Dos', tab: 'todos', icon: CheckCircleIcon, activeIcon: CheckCircleIconSolid },
  { name: 'Settings', tab: 'settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid },
]

const platforms = [
  { name: 'LinkedIn', icon: '💼', color: 'text-linkedin' },
  { name: 'Instagram', icon: '📷', color: 'text-instagram' },
  { name: 'YouTube', icon: '📺', color: 'text-youtube' },
  { name: 'Reddit', icon: '🤖', color: 'text-reddit' },
]

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Load notifications
    const loadNotifications = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('postgenius_notifications')
        if (stored) {
          setNotifications(JSON.parse(stored))
        }
      }
    }
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Post Genius</h1>
            <p className="text-sm text-gray-500">AI-powered social media management</p>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = activeTab === item.tab
            const Icon = isActive ? item.activeIcon : item.icon
            
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.tab as ActiveTab)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            )
          })}
        </div>

        {/* Connected Platforms */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Connected Platforms
          </h3>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <span className={`text-lg mr-3 ${platform.color}`}>{platform.icon}</span>
                {platform.name}
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="border-t border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Notifications
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded-lg text-xs ${
                    notification.read ? 'bg-gray-50 text-gray-600' : 'bg-blue-50 text-blue-900'
                  }`}
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-gray-500 mt-1">{notification.message}</div>
                  <div className="text-gray-400 mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 text-center py-4">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">User</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
