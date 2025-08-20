import { Post, Platform, User, Analytics } from './types'

// Local Storage Keys
const STORAGE_KEYS = {
  POSTS: 'postgenius_posts',
  PLATFORMS: 'postgenius_platforms',
  USER: 'postgenius_user',
  ANALYTICS: 'postgenius_analytics',
  SETTINGS: 'postgenius_settings'
} as const

// Generic storage functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
  }
}

// Posts storage
export const getPosts = (): Post[] => {
  return getFromStorage(STORAGE_KEYS.POSTS, [])
}

export const savePost = (post: Post): void => {
  const posts = getPosts()
  const existingIndex = posts.findIndex(p => p.id === post.id)
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post
  } else {
    posts.push(post)
  }
  
  setToStorage(STORAGE_KEYS.POSTS, posts)
}

export const deletePost = (postId: string): void => {
  const posts = getPosts()
  const filteredPosts = posts.filter(p => p.id !== postId)
  setToStorage(STORAGE_KEYS.POSTS, filteredPosts)
}

export const getPostById = (postId: string): Post | undefined => {
  const posts = getPosts()
  return posts.find(p => p.id === postId)
}

// Platforms storage - Full Social Media Manager
export const getPlatforms = (): Platform[] => {
  return getFromStorage(STORAGE_KEYS.PLATFORMS, [
    // Text-Based Platforms
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '/icons/linkedin.png',
      color: 'text-linkedin',
      connected: false,
      type: 'text'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '/icons/reddit.png',
      color: 'text-reddit',
      connected: false,
      type: 'text'
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: '/icons/threads.png',
      color: 'text-threads',
      connected: false,
      type: 'text'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '/icons/facebook.png',
      color: 'text-facebook',
      connected: false,
      type: 'text'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: '/icons/x.png',
      color: 'text-twitter',
      connected: false,
      type: 'text'
    },
    {
      id: 'weibo',
      name: 'Weibo',
      icon: '/icons/weibo.png',
      color: 'text-weibo',
      connected: false,
      type: 'text'
    },
    // Visual/Video Platforms
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '/icons/instagram.png',
      color: 'text-instagram',
      connected: false,
      type: 'visual'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '/icons/tiktok.png',
      color: 'text-tiktok',
      connected: false,
      type: 'visual'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '/icons/youtube.png',
      color: 'text-youtube',
      connected: false,
      type: 'video'
    }
  ])
}

export const updatePlatform = (platformId: string, updates: Partial<Platform>): void => {
  const platforms = getPlatforms()
  const platformIndex = platforms.findIndex(p => p.id === platformId)
  
  if (platformIndex >= 0) {
    platforms[platformIndex] = { ...platforms[platformIndex], ...updates }
    setToStorage(STORAGE_KEYS.PLATFORMS, platforms)
  }
}

// User storage
export const getUser = (): User | null => {
  return getFromStorage(STORAGE_KEYS.USER, null)
}

export const saveUser = (user: User): void => {
  setToStorage(STORAGE_KEYS.USER, user)
}

// Analytics storage
export const getAnalytics = (): Analytics => {
  return getFromStorage(STORAGE_KEYS.ANALYTICS, {
    totalFollowers: 0,
    totalPosts: 0,
    avgEngagement: 0,
    totalReach: 0,
    platformStats: [],
    topPosts: []
  })
}

export const saveAnalytics = (analytics: Analytics): void => {
  setToStorage(STORAGE_KEYS.ANALYTICS, analytics)
}

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}
