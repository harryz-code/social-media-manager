import { Post, Platform, User, Analytics } from './types'

// Local Storage Keys
const STORAGE_KEYS = {
  POSTS: 'socialflow_posts',
  PLATFORMS: 'socialflow_platforms',
  USER: 'socialflow_user',
  ANALYTICS: 'socialflow_analytics',
  SETTINGS: 'socialflow_settings'
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

// Platforms storage
export const getPlatforms = (): Platform[] => {
  return getFromStorage(STORAGE_KEYS.PLATFORMS, [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: 'text-linkedin',
      connected: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'text-instagram',
      connected: false
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺',
      color: 'text-youtube',
      connected: false
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '🤖',
      color: 'text-reddit',
      connected: false
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
