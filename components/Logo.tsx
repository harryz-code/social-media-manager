import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const Icon = () => (
    <svg 
      viewBox="0 0 40 40" 
      className={`${iconSizes[size]} flex-shrink-0`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background square with rounded corners */}
      <rect 
        x="2" 
        y="2" 
        width="36" 
        height="36" 
        rx="8" 
        fill="#374151" 
        className="dark:fill-gray-600"
      />
      
      {/* Arrow body (horizontal rectangle) */}
      <rect 
        x="8" 
        y="16" 
        width="16" 
        height="8" 
        rx="2" 
        fill="white"
      />
      
      {/* Arrow head (triangle) */}
      <path 
        d="M24 16 L32 20 L24 24 Z" 
        fill="white"
      />
      
      {/* Dot at the tip */}
      <circle 
        cx="32" 
        cy="20" 
        r="2" 
        fill="white"
      />
    </svg>
  )

  const Text = () => (
    <div className={`font-bold text-gray-900 dark:text-white ${textSizes[size]} tracking-tight`}>
      <span className="text-gray-900 dark:text-white">POST</span>
      <span className="text-gray-900 dark:text-white ml-1">GENIUS</span>
    </div>
  )

  if (variant === 'icon') {
    return <Icon />
  }

  if (variant === 'text') {
    return <Text />
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Icon />
      <Text />
    </div>
  )
}
