export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  headline?: string
  profilePicture?: string
  vanityName?: string
}

export interface LinkedInPost {
  id: string
  text: string
  author: string
  publishedAt: Date
  visibility: 'PUBLIC' | 'CONNECTIONS'
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
}

export interface LinkedInAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

export class LinkedInAPI {
  private static readonly BASE_URL = 'https://api.linkedin.com/v2'
  private static readonly AUTH_URL = 'https://www.linkedin.com/oauth/v2'
  
  private static config: LinkedInAuthConfig = {
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_liteprofile', 'r_emailaddress']
  }

  // OAuth Authentication Flow
  static getAuthUrl(): string {
    console.log('LinkedIn Client ID being used:', this.config.clientId);
    console.log('Environment variable check:', process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID);
    
    if (!this.config.clientId) {
      throw new Error('LinkedIn Client ID is not configured. Please check your .env.local file.');
    }
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      state: Math.random().toString(36).substring(7) // CSRF protection
    })

    const authUrl = `${this.AUTH_URL}/authorization?${params.toString()}`
    console.log('LinkedIn Auth URL:', authUrl)
    return authUrl
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await fetch(`${this.AUTH_URL}/accessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri
        })
      })

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`)
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('LinkedIn token exchange error:', error)
      throw new Error('Failed to authenticate with LinkedIn')
    }
  }

  // Profile Information
  static async getProfile(accessToken: string): Promise<LinkedInProfile> {
    try {
      const response = await fetch(`${this.BASE_URL}/people/~:(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams))`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.id,
        firstName: data.firstName.localized.en_US,
        lastName: data.lastName.localized.en_US,
        headline: data.headline?.localized?.en_US,
        profilePicture: data.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier
      }
    } catch (error) {
      console.error('LinkedIn profile fetch error:', error)
      throw new Error('Failed to fetch LinkedIn profile')
    }
  }

  // Post Content
  static async createPost(accessToken: string, content: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC'): Promise<string> {
    try {
      const profile = await this.getProfile(accessToken)
      
      const postData = {
        author: `urn:li:person:${profile.id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
      }

      const response = await fetch(`${this.BASE_URL}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Post creation failed: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('LinkedIn post creation error:', error)
      throw new Error('Failed to create LinkedIn post')
    }
  }

  // Get Posts Analytics
  static async getPostAnalytics(accessToken: string, postId: string): Promise<LinkedInPost['engagement']> {
    try {
      // Note: LinkedIn analytics require additional permissions and may have limitations
      const response = await fetch(`${this.BASE_URL}/socialActions/${postId}/statistics`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        // Return default engagement if analytics not available
        return { likes: 0, comments: 0, shares: 0, views: 0 }
      }

      const data = await response.json()
      
      return {
        likes: data.numLikes || 0,
        comments: data.numComments || 0,
        shares: data.numShares || 0,
        views: data.numViews || 0
      }
    } catch (error) {
      console.error('LinkedIn analytics fetch error:', error)
      return { likes: 0, comments: 0, shares: 0, views: 0 }
    }
  }

  // Validate Access Token
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/people/~:(id)`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      return response.ok
    } catch (error) {
      return false
    }
  }

  // Helper: Format content for LinkedIn
  static formatContent(content: string, maxLength: number = 3000): string {
    if (content.length <= maxLength) {
      return content
    }

    // Truncate and add ellipsis
    return content.substring(0, maxLength - 3) + '...'
  }

  // Helper: Get optimal posting times for LinkedIn
  static getOptimalPostingTimes(): { day: string; hours: number[] }[] {
    return [
      { day: 'Monday', hours: [9, 10, 17, 18] },
      { day: 'Tuesday', hours: [9, 10, 11, 15, 16, 17] },
      { day: 'Wednesday', hours: [9, 10, 11, 15, 16, 17] },
      { day: 'Thursday', hours: [9, 10, 11, 15, 16, 17] },
      { day: 'Friday', hours: [9, 10, 11] },
      { day: 'Saturday', hours: [10, 11] },
      { day: 'Sunday', hours: [] }
    ]
  }
}
