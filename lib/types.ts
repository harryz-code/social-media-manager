export interface Post {
  id: string
  content: string
  platforms: string[]
  scheduledFor?: Date
  publishedAt?: Date
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  engagement?: {
    views: number
    likes: number
    comments: number
    shares: number
  }
  media?: string[]
  hashtags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Platform {
  id: string
  name: string
  icon: string
  color: string
  connected: boolean
  followers?: string
  apiKey?: string
  accessToken?: string
}

export interface Analytics {
  totalFollowers: number
  totalPosts: number
  avgEngagement: number
  totalReach: number
  platformStats: PlatformStats[]
  topPosts: Post[]
}

export interface PlatformStats {
  platform: string
  followers: string
  posts: number
  engagement: string
  reach: string
  change: string
  changeType: 'positive' | 'negative'
}

export interface User {
  id: string
  name: string
  email: string
  company?: string
  avatar?: string
  preferences: {
    notifications: NotificationSettings
    timezone: string
    language: string
  }
}

export interface NotificationSettings {
  postPublished: boolean
  postScheduled: boolean
  highEngagement: boolean
  weeklyReport: boolean
}

export interface AISuggestion {
  id: string
  type: 'hashtag' | 'content' | 'timing' | 'engagement'
  suggestion: string
  confidence: number
  applied: boolean
}
