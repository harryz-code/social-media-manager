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
  
  private static config: RedditAuthConfig = {
    clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID || '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI || 'http://localhost:3001/auth/reddit/callback',
    userAgent: 'PostGenius/1.0.0 by PostGenius'
  }

  // OAuth Authentication Flow
  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      state: Math.random().toString(36).substring(7),
      redirect_uri: this.config.redirectUri,
      duration: 'permanent',
      scope: 'identity read submit edit history'
    })

    return `${this.BASE_URL}/authorize?${params.toString()}`
  }

  static async exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const auth = btoa(`${this.config.clientId}:${this.config.clientSecret}`)
      
      const response = await fetch(`${this.BASE_URL}/access_token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.userAgent
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUri
        })
      })

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`)
      }

      const data = await response.json()
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
      const response = await fetch(`${this.OAUTH_URL}/api/v1/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': this.config.userAgent
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
    text: string
  ): Promise<string> {
    try {
      const response = await fetch(`${this.OAUTH_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.userAgent
        },
        body: new URLSearchParams({
          sr: subreddit,
          kind: 'self',
          title,
          text,
          api_type: 'json'
        })
      })

      if (!response.ok) {
        throw new Error(`Post submission failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.json.errors && data.json.errors.length > 0) {
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
      const response = await fetch(`${this.OAUTH_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.userAgent
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
      const response = await fetch(`${this.OAUTH_URL}/user/${username}/submitted?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': this.config.userAgent
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
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`, {
        headers: {
          'User-Agent': this.config.userAgent
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
      const response = await fetch(`${this.OAUTH_URL}/api/v1/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': this.config.userAgent
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
