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
    <img 
      src="/logo.png" 
      alt="POST GENIUS" 
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}
