export interface ThreadsProfile {
  id: string
  username: string
  displayName: string
  bio?: string
  profilePicture?: string
  followersCount: number
  followingCount: number
  postsCount: number
}

export interface ThreadsPost {
  id: string
  text: string
  author: string
  username: string
  publishedAt: Date
  likes: number
  replies: number
  reposts: number
  isRepost: boolean
  replyTo?: string
}

export interface ThreadsAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

export class ThreadsAPI {
  private static readonly BASE_URL = 'https://graph.instagram.com/v12.0'
  private static readonly AUTH_URL = 'https://api.instagram.com/oauth'
  
  private static config: ThreadsAuthConfig = {
    clientId: process.env.NEXT_PUBLIC_THREADS_CLIENT_ID || '',
    clientSecret: process.env.THREADS_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_THREADS_REDIRECT_URI || 'http://localhost:3001/auth/threads/callback',
    scope: ['user_profile', 'user_media', 'instagram_basic', 'instagram_content_publish']
  }

  // OAuth Authentication Flow
  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(','),
      response_type: 'code',
      state: Math.random().toString(36).substring(7) // CSRF protection
    })

    return `${this.AUTH_URL}/authorize?${params.toString()}`
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await fetch(`${this.AUTH_URL}/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
          code
        })
      })

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`)
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Threads token exchange error:', error)
      throw new Error('Failed to authenticate with Threads')
    }
  }

  // Profile Information
  static async getProfile(accessToken: string): Promise<ThreadsProfile> {
    try {
      const response = await fetch(`${this.BASE_URL}/me?fields=id,username,account_type&access_token=${accessToken}`)

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Note: Threads API is still limited, so we'll use Instagram profile data
      return {
        id: data.id,
        username: data.username,
        displayName: data.username, // Threads doesn't provide separate display name yet
        bio: undefined,
        profilePicture: undefined,
        followersCount: 0, // Not available via API yet
        followingCount: 0, // Not available via API yet
        postsCount: 0 // Not available via API yet
      }
    } catch (error) {
      console.error('Threads profile fetch error:', error)
      throw new Error('Failed to fetch Threads profile')
    }
  }

  // Post Content (Note: Threads API is very limited)
  static async createPost(accessToken: string, content: string): Promise<string> {
    try {
      // Threads API is still in development and very limited
      // For now, we'll simulate the API call
      // In the future, this will use the actual Threads API
      
      const postData = {
        message: content,
        access_token: accessToken
      }

      // Simulate API call - replace with actual Threads API when available
      console.log('Threads post data:', postData)
      
      // For now, return a mock post ID
      const mockPostId = `threads_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      // In the future, this would be:
      // const response = await fetch(`${this.BASE_URL}/me/media`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   body: new URLSearchParams({
      //     message: content,
      //     access_token: accessToken
      //   })
      // })
      
      return mockPostId
    } catch (error) {
      console.error('Threads post creation error:', error)
      throw new Error('Failed to create Threads post')
    }
  }

  // Get User's Posts
  static async getUserPosts(accessToken: string, limit: number = 10): Promise<ThreadsPost[]> {
    try {
      // Threads API is still limited, so we'll return mock data for now
      // In the future, this will fetch actual Threads posts
      
      const mockPosts: ThreadsPost[] = []
      
      for (let i = 0; i < Math.min(limit, 5); i++) {
        mockPosts.push({
          id: `threads_post_${i}`,
          text: `This is a mock Threads post #${i + 1}. The actual API integration will be available when Threads opens their API.`,
          author: 'Mock User',
          username: 'mockuser',
          publishedAt: new Date(Date.now() - i * 86400000), // Each post 1 day apart
          likes: Math.floor(Math.random() * 100),
          replies: Math.floor(Math.random() * 20),
          reposts: Math.floor(Math.random() * 10),
          isRepost: false
        })
      }
      
      return mockPosts
    } catch (error) {
      console.error('Threads posts fetch error:', error)
      return []
    }
  }

  // Validate Access Token
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/me?access_token=${accessToken}`)
      return response.ok
    } catch (error) {
      return false
    }
  }

  // Helper: Format content for Threads
  static formatContent(content: string, maxLength: number = 500): string {
    if (content.length <= maxLength) {
      return content
    }

    // Truncate and add ellipsis
    return content.substring(0, maxLength - 3) + '...'
  }

  // Helper: Extract hashtags from content
  static extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w]+/g
    return content.match(hashtagRegex) || []
  }

  // Helper: Get optimal posting times for Threads
  static getOptimalPostingTimes(): { day: string; hours: number[] }[] {
    return [
      { day: 'Monday', hours: [9, 10, 17, 18, 19] },
      { day: 'Tuesday', hours: [9, 10, 11, 15, 16, 17, 18] },
      { day: 'Wednesday', hours: [9, 10, 11, 15, 16, 17, 18] },
      { day: 'Thursday', hours: [9, 10, 11, 15, 16, 17, 18] },
      { day: 'Friday', hours: [9, 10, 11, 15, 16, 17] },
      { day: 'Saturday', hours: [10, 11, 12, 13, 14, 15] },
      { day: 'Sunday', hours: [10, 11, 12, 13, 14, 15, 16] }
    ]
  }

  // Helper: Check if content is appropriate for Threads
  static validateContent(content: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (content.length > 500) {
      errors.push('Content exceeds 500 character limit')
    }
    
    if (content.length < 1) {
      errors.push('Content cannot be empty')
    }
    
    // Check for excessive hashtags (Threads is more conservative than Instagram)
    const hashtags = this.extractHashtags(content)
    if (hashtags.length > 5) {
      errors.push('Too many hashtags (max 5 recommended)')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Helper: Get Threads-specific content suggestions
  static getContentSuggestions(): string[] {
    return [
      "Share your thoughts on current trends",
      "Ask your followers a question",
      "Share a behind-the-scenes moment",
      "Post about your latest project or achievement",
      "Share a quote that resonates with you",
      "Start a conversation about your industry",
      "Share a tip or piece of advice",
      "Post about something you're excited about"
    ]
  }
}
