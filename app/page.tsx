'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import PostEditor from '@/components/PostEditor'
import ContentCalendar from '@/components/ContentCalendar'
import BulkOperations from '@/components/BulkOperations'
import Analytics from '@/components/Analytics'
import Settings from '@/components/Settings'
import TodoManager from '@/components/TodoManager'

type ActiveTab = 'dashboard' | 'compose' | 'calendar' | 'bulk' | 'analytics' | 'settings' | 'todos'

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />
      case 'compose':
        return <PostEditor />
      case 'calendar':
        return <ContentCalendar />
      case 'bulk':
        return <BulkOperations />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      case 'todos':
        return <TodoManager />
      default:
        return <Dashboard onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
