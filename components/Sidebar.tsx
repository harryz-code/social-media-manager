'use client'

import { 
  HomeIcon, 
  PencilSquareIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  PencilSquareIcon as PencilSquareIconSolid, 
  CalendarIcon as CalendarIconSolid, 
  ChartBarIcon as ChartBarIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid 
} from '@heroicons/react/24/solid'

type ActiveTab = 'dashboard' | 'compose' | 'calendar' | 'analytics' | 'settings'

interface SidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

const navigation = [
  { name: 'Dashboard', tab: 'dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: 'Compose', tab: 'compose', icon: PencilSquareIcon, activeIcon: PencilSquareIconSolid },
  { name: 'Calendar', tab: 'calendar', icon: CalendarIcon, activeIcon: CalendarIconSolid },
  { name: 'Analytics', tab: 'analytics', icon: ChartBarIcon, activeIcon: ChartBarIconSolid },
  { name: 'Settings', tab: 'settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid },
]

const platforms = [
  { name: 'LinkedIn', icon: '💼', color: 'text-linkedin' },
  { name: 'Instagram', icon: '📷', color: 'text-instagram' },
  { name: 'YouTube', icon: '📺', color: 'text-youtube' },
  { name: 'Reddit', icon: '🤖', color: 'text-reddit' },
]

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">SocialFlow</h1>
        <p className="text-sm text-gray-500">Manage your social presence</p>
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
