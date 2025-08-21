export interface FacebookProfile {
  id: string
  name: string
  username?: string
  profilePicture?: string
  pageId?: string
  pageName?: string
  pageAccessToken?: string
}

export interface FacebookPost {
  id: string
  message: string
  author: string
  publishedAt: Date
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  type: 'status' | 'photo' | 'video' | 'link'
}

export interface FacebookAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

export class FacebookAPI {
  private static readonly BASE_URL = 'https://graph.facebook.com/v18.0'
  private static readonly AUTH_URL = 'https://www.facebook.com/v18.0/dialog/oauth'
  
  private static config: FacebookAuthConfig = {
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || 'http://localhost:3001/auth/facebook/callback',
    scope: ['public_profile', 'email', 'pages_manage_posts', 'pages_read_engagement']
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

    return `${this.AUTH_URL}?${params.toString()}`
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
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
      console.error('Facebook token exchange error:', error)
      throw new Error('Failed to authenticate with Facebook')
    }
  }

  // Profile Information
  static async getProfile(accessToken: string): Promise<FacebookProfile> {
    try {
      const response = await fetch(`${this.BASE_URL}/me?fields=id,name,username,picture&access_token=${accessToken}`)

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.id,
        name: data.name,
        username: data.username,
        profilePicture: data.picture?.data?.url
      }
    } catch (error) {
      console.error('Facebook profile fetch error:', error)
      throw new Error('Failed to fetch Facebook profile')
    }
  }

  // Get user's pages (for business accounts)
  static async getPages(accessToken: string): Promise<FacebookProfile[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/me/accounts?access_token=${accessToken}`)

      if (!response.ok) {
        throw new Error(`Pages fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return data.data.map((page: any) => ({
        id: page.id,
        name: page.name,
        username: page.username,
        pageId: page.id,
        pageName: page.name,
        pageAccessToken: page.access_token
      }))
    } catch (error) {
      console.error('Facebook pages fetch error:', error)
      return []
    }
  }

  // Create Post
  static async createPost(accessToken: string, message: string, pageId?: string): Promise<string> {
    try {
      const targetId = pageId || 'me'
      const response = await fetch(`${this.BASE_URL}/${targetId}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          message,
          access_token: accessToken
        })
      })

      if (!response.ok) {
        throw new Error(`Post creation failed: ${response.status}`)
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Facebook post creation error:', error)
      throw new Error('Failed to create Facebook post')
    }
  }

  // Get Posts
  static async getPosts(accessToken: string, pageId?: string, limit: number = 10): Promise<FacebookPost[]> {
    try {
      const targetId = pageId || 'me'
      const response = await fetch(
        `${this.BASE_URL}/${targetId}/posts?fields=id,message,created_time,type,insights.metric(post_impressions,post_engagements)&limit=${limit}&access_token=${accessToken}`
      )

      if (!response.ok) {
        throw new Error(`Posts fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return data.data.map((post: any) => ({
        id: post.id,
        message: post.message || '',
        author: targetId,
        publishedAt: new Date(post.created_time),
        engagement: {
          likes: 0, // Facebook doesn't provide likes count in basic API
          comments: 0,
          shares: 0,
          views: post.insights?.data?.[0]?.values?.[0]?.value || 0
        },
        type: post.type || 'status'
      }))
    } catch (error) {
      console.error('Facebook posts fetch error:', error)
      throw new Error('Failed to fetch Facebook posts')
    }
  }

  // Get Post Analytics
  static async getPostAnalytics(accessToken: string, postId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/${postId}/insights?metric=post_impressions,post_engagements,post_reactions_by_type_total&access_token=${accessToken}`
      )

      if (!response.ok) {
        throw new Error(`Analytics fetch failed: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Facebook analytics fetch error:', error)
      return null
    }
  }

  // Validate Token
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/me?access_token=${accessToken}`)
      return response.ok
    } catch (error) {
      console.error('Facebook token validation error:', error)
      return false
    }
  }

  // Format content for Facebook
  static formatContent(content: string): string {
    // Facebook has a 63,206 character limit for posts
    if (content.length > 63000) {
      return content.substring(0, 63000) + '...'
    }
    return content
  }
}

