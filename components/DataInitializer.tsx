'use client'

import { useEffect } from 'react'
import { initializeSampleData } from '@/lib/sampleData'

export default function DataInitializer() {
  useEffect(() => {
    initializeSampleData()
  }, [])

  return null
}
