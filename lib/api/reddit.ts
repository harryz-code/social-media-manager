export interface RedditProfile {
  id: string
  name: string
  karma: number
  created: Date
  verified: boolean
  avatar?: string
}

export interface RedditPost {
  id: string
  title: string
  text?: string
  url?: string
  subreddit: string
  author: string
  score: number
  upvotes: number
  downvotes: number
  comments: number
  created: Date
  permalink: string
}

export interface RedditSubreddit {
  name: string
  displayName: string
  description: string
  subscribers: number
  rules: string[]
  allowedPostTypes: ('text' | 'link' | 'image' | 'video')[]
}

export interface RedditAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  userAgent: string
}

export class RedditAPI {
  private static readonly BASE_URL = 'https://www.reddit.com/api/v1'
  private static readonly OAUTH_URL = 'https://oauth.reddit.com'
  
  private static getConfig(): RedditAuthConfig {
    return {
      clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID || '',
      clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
      redirectUri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI || 'http://localhost:3000/auth/reddit/callback',
      userAgent: 'PostGenius/1.0.0 (by /u/Careful-Tonight5560)'
    }
  }

  // OAuth Authentication Flow
  static getAuthUrl(): string {
    const config = this.getConfig()
    console.log('🔍 Reddit OAuth Debug:')
    console.log('  - Client ID:', config.clientId)
    console.log('  - Redirect URI:', config.redirectUri)
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      state: Math.random().toString(36).substring(7),
      redirect_uri: config.redirectUri,
      duration: 'permanent',
      scope: 'identity'
    })

    const authUrl = `${this.BASE_URL}/authorize?${params.toString()}`
    console.log('  - Generated Auth URL:', authUrl)
    
    return authUrl
  }

  static async exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const config = this.getConfig()
      console.log('🔍 Reddit token exchange debug:')
      console.log('  - Client ID:', config.clientId)
      console.log('  - Client Secret:', config.clientSecret ? config.clientSecret.substring(0, 10) + '...' : 'Missing')
      console.log('  - Redirect URI:', config.redirectUri)
      console.log('  - Code length:', code.length)
      
      if (!config.clientId || !config.clientSecret) {
        throw new Error('Missing Reddit client ID or secret')
      }
      
      const auth = btoa(`${config.clientId}:${config.clientSecret}`)
      console.log('  - Auth header:', `Basic ${auth.substring(0, 20)}...`)
      console.log('  - Full auth string (for debugging):', `${config.clientId}:${config.clientSecret}`)
      console.log('  - Client ID length:', config.clientId.length)
      console.log('  - Client Secret length:', config.clientSecret.length)
      
      const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      })
      
      console.log('🔍 Reddit token exchange request:')
      console.log('  - URL:', `${this.BASE_URL}/access_token`)
      console.log('  - Body:', requestBody.toString())
      console.log('  - Redirect URI being sent:', config.redirectUri)
      
      console.log('  - Request body:', requestBody.toString())
      
      const response = await fetch(`${this.BASE_URL}/access_token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': config.userAgent
        },
        body: requestBody
      })

      console.log('  - Response status:', response.status)
      console.log('  - Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Reddit token exchange failed:')
        console.error('  - Status:', response.status)
        console.error('  - Status Text:', response.statusText)
        console.error('  - Response:', errorText)
        console.error('  - Headers:', Object.fromEntries(response.headers.entries()))
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('  - Success response:', { 
        access_token: data.access_token ? data.access_token.substring(0, 20) + '...' : 'missing',
        refresh_token: data.refresh_token ? data.refresh_token.substring(0, 20) + '...' : 'missing',
        token_type: data.token_type,
        expires_in: data.expires_in
      })
      
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token
      }
    } catch (error) {
      console.error('Reddit token exchange error:', error)
      throw new Error('Failed to authenticate with Reddit')
    }
  }

  // Profile Information
  static async getProfile(accessToken: string): Promise<RedditProfile> {
    try {
      const config = this.getConfig()
      const response = await fetch(`${this.OAUTH_URL}/api/v1/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': config.userAgent
        }
      })

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.id,
        name: data.name,
        karma: data.total_karma || 0,
        created: new Date(data.created_utc * 1000),
        verified: data.verified || false,
        avatar: data.icon_img
      }
    } catch (error) {
      console.error('Reddit profile fetch error:', error)
      throw new Error('Failed to fetch Reddit profile')
    }
  }

  // Submit a Text Post
  static async submitTextPost(
    accessToken: string, 
    subreddit: string, 
    title: string, 
    text: string,
    flair?: string
  ): Promise<string> {
    try {
      const config = this.getConfig()
      console.log('🔍 Reddit post submission debug:')
      console.log('  - Subreddit:', subreddit)
      console.log('  - Title length:', title.length)
      console.log('  - Text length:', text.length)
      console.log('  - Access token:', accessToken.substring(0, 20) + '...')
      
      const requestBody = new URLSearchParams({
        sr: subreddit,
        kind: 'self',
        title,
        text,
        api_type: 'json',
        ...(flair && { flair_id: flair })
      })
      
      console.log('  - Request body:', requestBody.toString())
      
      const response = await fetch(`${this.OAUTH_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': config.userAgent
        },
        body: requestBody
      })

      console.log('  - Response status:', response.status)
      console.log('  - Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('  - Error response body:', errorText)
        throw new Error(`Post submission failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('  - Success response:', data)
      
      if (data.json.errors && data.json.errors.length > 0) {
        console.error('  - Reddit API errors:', data.json.errors)
        throw new Error(`Reddit API Error: ${data.json.errors[0][1]}`)
      }

      return data.json.data.name // Returns the post ID
    } catch (error) {
      console.error('Reddit post submission error:', error)
      throw new Error('Failed to submit Reddit post')
    }
  }

  // Submit a Link Post
  static async submitLinkPost(
    accessToken: string, 
    subreddit: string, 
    title: string, 
    url: string
  ): Promise<string> {
    try {
      const config = this.getConfig()
      const response = await fetch(`${this.OAUTH_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': config.userAgent
        },
        body: new URLSearchParams({
          sr: subreddit,
          kind: 'link',
          title,
          url,
          api_type: 'json'
        })
      })

      if (!response.ok) {
        throw new Error(`Link post submission failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.json.errors && data.json.errors.length > 0) {
        throw new Error(`Reddit API Error: ${data.json.errors[0][1]}`)
      }

      return data.json.data.name
    } catch (error) {
      console.error('Reddit link post submission error:', error)
      throw new Error('Failed to submit Reddit link post')
    }
  }

  // Get User's Posts
  static async getUserPosts(accessToken: string, username: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const config = this.getConfig()
      const response = await fetch(`${this.OAUTH_URL}/user/${username}/submitted?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': config.userAgent
        }
      })

      if (!response.ok) {
        throw new Error(`Posts fetch failed: ${response.status}`)
      }

      const data = await response.json()
      
      return data.data.children.map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        text: child.data.selftext,
        url: child.data.url,
        subreddit: child.data.subreddit,
        author: child.data.author,
        score: child.data.score,
        upvotes: child.data.ups,
        downvotes: child.data.downs,
        comments: child.data.num_comments,
        created: new Date(child.data.created_utc * 1000),
        permalink: child.data.permalink
      }))
    } catch (error) {
      console.error('Reddit posts fetch error:', error)
      return []
    }
  }

  // Get Subreddit Information
  static async getSubredditInfo(subreddit: string): Promise<RedditSubreddit | null> {
    try {
      const config = this.getConfig()
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`, {
        headers: {
          'User-Agent': config.userAgent
        }
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      const sub = data.data
      
      return {
        name: sub.name,
        displayName: sub.display_name,
        description: sub.description,
        subscribers: sub.subscribers,
        rules: sub.rules?.map((rule: any) => rule.description) || [],
        allowedPostTypes: this.parseAllowedPostTypes(sub)
      }
    } catch (error) {
      console.error('Subreddit info fetch error:', error)
      return null
    }
  }

  // Validate Access Token
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      const config = this.getConfig()
      const response = await fetch(`${this.OAUTH_URL}/api/v1/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': config.userAgent
        }
      })

      return response.ok
    } catch (error) {
      return false
    }
  }

  // Helper: Parse allowed post types from subreddit data
  private static parseAllowedPostTypes(subredditData: any): ('text' | 'link' | 'image' | 'video')[] {
    const types: ('text' | 'link' | 'image' | 'video')[] = []
    
    if (subredditData.submission_type === 'any' || subredditData.submission_type === 'self') {
      types.push('text')
    }
    if (subredditData.submission_type === 'any' || subredditData.submission_type === 'link') {
      types.push('link')
    }
    if (subredditData.allow_images) {
      types.push('image')
    }
    if (subredditData.allow_videos) {
      types.push('video')
    }
    
    return types
  }

  // Helper: Format content for Reddit
  static formatContent(title: string, content: string): { title: string; text: string } {
    // Reddit titles have a 300 character limit
    const formattedTitle = title.length > 300 ? title.substring(0, 297) + '...' : title
    
    // Reddit text posts can be quite long (40,000 characters)
    const formattedText = content.length > 40000 ? content.substring(0, 39997) + '...' : content
    
    return {
      title: formattedTitle,
      text: formattedText
    }
  }

  // Helper: Get popular subreddits for different categories
  static getPopularSubreddits(): Record<string, string[]> {
    return {
      business: ['entrepreneur', 'business', 'startups', 'smallbusiness', 'marketing'],
      technology: ['technology', 'programming', 'webdev', 'MachineLearning', 'artificial'],
      social: ['socialmedia', 'marketing', 'digital_marketing', 'content_marketing'],
      general: ['AskReddit', 'todayilearned', 'LifeProTips', 'explainlikeimfive'],
      creative: ['writing', 'design', 'creativity', 'graphic_design', 'web_design']
    }
  }

  // Helper: Get optimal posting times for Reddit (UTC)
  static getOptimalPostingTimes(): { day: string; hours: number[] }[] {
    return [
      { day: 'Monday', hours: [14, 15, 16, 20, 21] },
      { day: 'Tuesday', hours: [14, 15, 16, 20, 21] },
      { day: 'Wednesday', hours: [14, 15, 16, 20, 21] },
      { day: 'Thursday', hours: [14, 15, 16, 20, 21] },
      { day: 'Friday', hours: [14, 15, 16] },
      { day: 'Saturday', hours: [13, 14, 15, 16] },
      { day: 'Sunday', hours: [13, 14, 15, 16, 20, 21] }
    ]
  }
}
