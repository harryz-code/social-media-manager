'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PlatformIconProps {
  platform: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const platformEmojis: Record<string, string> = {
  linkedin: '💼',
  reddit: '🤖',
  threads: '🧵',
  facebook: '📘',
  twitter: '🐦',
  x: '🐦',
  weibo: '📱',
  rednote: '📖',
  instagram: '📷',
  tiktok: '🎵',
  youtube: '📺'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
}

export default function PlatformIcon({ platform, size = 'md', className = '' }: PlatformIconProps) {
  const [imageError, setImageError] = useState(false)
  const emoji = platformEmojis[platform] || '📱'

  if (imageError) {
    return (
      <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <span className="text-lg">{emoji}</span>
      </div>
    )
  }

  return (
    <Image
      src={`/icons/${platform}.png`}
      alt={`${platform} logo`}
      width={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
      height={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
      className={`${sizeClasses[size]} ${className}`}
      onError={() => setImageError(true)}
    />
  )
}
