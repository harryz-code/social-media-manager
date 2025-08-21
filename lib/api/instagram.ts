export interface InstagramProfile {
  id: string
  username: string
  displayName?: string
  profilePicture?: string
  followersCount?: number
  followingCount?: number
  postsCount?: number
  accountType: 'PERSONAL' | 'BUSINESS' | 'CREATOR'
}

export interface InstagramPost {
  id: string
  caption: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl: string
  thumbnailUrl?: string
  publishedAt: Date
  engagement: {
    likes: number
    comments: number
    saves: number
    reach: number
  }
}

export interface InstagramAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

export class InstagramAPI {
  private static readonly BASE_URL = 'https://graph.instagram.com/v18.0'
  private static readonly AUTH_URL = 'https://api.instagram.com/oauth'
  
  private static config: InstagramAuthConfig = {
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || 'http://localhost:3001/auth/instagram/callback',
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
      console.error('Instagram token exchange error:', error)
      throw new Error('Failed to authenticate with Instagram')
    }
  }

  // Profile Information
  static async getProfile(accessToken: string): Promise<InstagramProfile> {
    try {
      const response = await fetch(`${this.BASE_URL}/me?fields=id,username,account_type&access_token=${accessToken}`)

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.id,
        username: data.username,
        displayName: data.username, // Instagram Basic Display API doesn't provide display name
        accountType: data.account_type || 'PERSONAL'
      }
    } catch (error) {
      console.error('Instagram profile fetch error:', error)
      throw new Error('Failed to fetch Instagram profile')
    }
  }

  // Get Media
  static async getMedia(accessToken: string, limit: number = 10): Promise<InstagramPost[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=${limit}&access_token=${accessToken}`
      )

      if (!response.ok) {
        throw new Error(`Media fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return data.data.map((post: any) => ({
        id: post.id,
        caption: post.caption || '',
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        publishedAt: new Date(post.timestamp),
        engagement: {
          likes: post.like_count || 0,
          comments: post.comments_count || 0,
          saves: 0, // Instagram Basic Display API doesn't provide saves count
          reach: 0
        }
      }))
    } catch (error) {
      console.error('Instagram media fetch error:', error)
      throw new Error('Failed to fetch Instagram media')
    }
  }

  // Create Post (Note: Instagram Basic Display API doesn't support posting)
  // This would require Instagram Graph API with business/creator accounts
  static async createPost(accessToken: string, caption: string, mediaUrl?: string): Promise<string> {
    try {
      // For Instagram Basic Display API, we can't create posts
      // This would require Instagram Graph API with proper permissions
      throw new Error('Posting to Instagram requires Instagram Graph API with business/creator account')
    } catch (error) {
      console.error('Instagram post creation error:', error)
      throw new Error('Failed to create Instagram post - requires business account')
    }
  }

  // Get Post Analytics (Limited with Basic Display API)
  static async getPostAnalytics(accessToken: string, postId: string): Promise<any> {
    try {
      // Instagram Basic Display API has limited analytics
      const response = await fetch(
        `${this.BASE_URL}/${postId}?fields=like_count,comments_count&access_token=${accessToken}`
      )

      if (!response.ok) {
        throw new Error(`Analytics fetch failed: ${response.status}`)
      }

      const data = await response.json()
      return {
        likes: data.like_count || 0,
        comments: data.comments_count || 0
      }
    } catch (error) {
      console.error('Instagram analytics fetch error:', error)
      return null
    }
  }

  // Validate Token
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/me?access_token=${accessToken}`)
      return response.ok
    } catch (error) {
      console.error('Instagram token validation error:', error)
      return false
    }
  }

  // Format content for Instagram
  static formatContent(content: string): string {
    // Instagram captions have a 2,200 character limit
    if (content.length > 2200) {
      return content.substring(0, 2200) + '...'
    }
    return content
  }

  // Get hashtag suggestions (mock implementation)
  static getHashtagSuggestions(content: string): string[] {
    const commonHashtags = [
      '#instagram', '#photooftheday', '#love', '#fashion', '#beautiful', 
      '#happy', '#cute', '#tbt', '#followme', '#picoftheday', '#me', 
      '#selfie', '#summer', '#instadaily', '#friends', '#fun', '#style', 
      '#instalike', '#swag', '#igers', '#bestoftheday', '#instamood', 
      '#amazing', '#nofilter', '#follow', '#like4like', '#photography', 
      '#life', '#pretty', '#smile', '#food', '#instapic', '#fitness', 
      '#hair', '#girls', '#party', '#cool', '#lol', '#instahub', 
      '#instacool', '#nice', '#webstagram', '#colorful', '#swag', 
      '#all_shots', '#eyes', '#instagramhub', '#iphoneonly', '#makeup', 
      '#miami', '#dogsofinstagram', '#catsofinstagram', '#travel', 
      '#nature', '#architecture', '#art', '#music', '#sports'
    ]
    
    // Simple hashtag extraction and suggestion
    const words = content.toLowerCase().split(/\s+/)
    const existingHashtags = words.filter(word => word.startsWith('#'))
    
    // Return some relevant hashtags (in a real app, this would be more sophisticated)
    return commonHashtags.slice(0, 10).filter(tag => 
      !existingHashtags.includes(tag.toLowerCase())
    )
  }
}

