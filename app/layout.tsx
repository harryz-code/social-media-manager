import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SchedulerProvider from '@/components/SchedulerProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Post Genius - AI-Powered Social Media Manager',
  description: 'Create, schedule, and optimize your social media posts with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SchedulerProvider>
          {children}
          <Toaster position="top-right" />
        </SchedulerProvider>
      </body>
    </html>
  )
}
