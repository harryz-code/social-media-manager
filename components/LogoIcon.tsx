import React from 'react'

interface LogoIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function LogoIcon({ size = 'md', className = '' }: LogoIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <svg 
      viewBox="0 0 40 40" 
      className={`${sizeClasses[size]} ${className}`}
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
}
