import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  }

  return (
    <img 
      src="/logo.png" 
      alt="POST GENIUS" 
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}
