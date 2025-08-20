'use client'

import { useEffect } from 'react'
import { SchedulerService } from '@/lib/scheduler'

export default function SchedulerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Start the scheduler when the app loads
    SchedulerService.start()

    // Cleanup when component unmounts
    return () => {
      SchedulerService.stop()
    }
  }, [])

  return <>{children}</>
}
