import { LinkedInAPI } from './linkedin'
import { RedditAPI } from './reddit'
import { ThreadsAPI } from './threads'
import { XAPI } from './x'
import { Post } from '../types'

export interface PlatformConnection {
  platform: 'linkedin' | 'reddit' | 'threads' | 'x'
  accessToken: string
  refreshToken?: string
  profile: {
    id: string
    name: string
    username?: string
    avatar?: string
  }
  connectedAt: Date
  isValid: boolean
}

export interface PostingResult {
  platform: string
  success: boolean
  postId?: string
  error?: string
}

export class PlatformService {
  private static readonly STORAGE_KEY = 'postgenius_platform_connections'

  // Connection Management
  static saveConnection(connection: PlatformConnection): void {
    const connections = this.getConnections()
    const existingIndex = connections.findIndex(c => c.platform === connection.platform)
    
    if (existingIndex >= 0) {
      connections[existingIndex] = connection
    } else {
      connections.push(connection)
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections))
  }

  static getConnections(): PlatformConnection[] {
    if (typeof window === 'undefined') return []
    
    const connections: PlatformConnection[] = []
    
    // Check for Reddit connection
    const redditAccessToken = localStorage.getItem('reddit_access_token')
    const redditUser = localStorage.getItem('reddit_user')
    
    if (redditAccessToken && redditUser) {
      try {
        const userData = JSON.parse(redditUser)
        connections.push({
          platform: 'reddit',
          accessToken: redditAccessToken,
          refreshToken: localStorage.getItem('reddit_refresh_token') || undefined,
          profile: {
            id: userData.id,
            name: userData.username,
            username: userData.username,
            avatar: userData.avatar
          },
          connectedAt: new Date(),
          isValid: true // We'll validate this separately
        })
      } catch (error) {
        console.error('Error parsing Reddit user data:', error)
        // Clear invalid data
        localStorage.removeItem('reddit_access_token')
        localStorage.removeItem('reddit_refresh_token')
        localStorage.removeItem('reddit_user')
      }
    }
    
    // Check for LinkedIn connection (if we implement it)
    const linkedinAccessToken = localStorage.getItem('linkedin_access_token')
    if (linkedinAccessToken) {
      // TODO: Add LinkedIn connection logic
    }
    
    // Check for X connection
    const xAccessToken = localStorage.getItem('x_access_token')
    const xUser = localStorage.getItem('x_user')
    
    if (xAccessToken && xUser) {
      try {
        const userData = JSON.parse(xUser)
        connections.push({
          platform: 'x',
          accessToken: xAccessToken,
          refreshToken: localStorage.getItem('x_refresh_token') || undefined,
          profile: {
            id: userData.id,
            name: userData.name,
            username: userData.username,
            avatar: userData.profile_image_url
          },
          connectedAt: new Date(),
          isValid: true // We'll validate this separately
        })
      } catch (error) {
        console.error('Error parsing X user data:', error)
        // Clear invalid data
        localStorage.removeItem('x_access_token')
        localStorage.removeItem('x_refresh_token')
        localStorage.removeItem('x_user')
      }
    }
    
    // Also check for any stored connections from the old system
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      const storedConnections = stored ? JSON.parse(stored) : []
      
      // Merge with real connections, preferring real ones
      for (const storedConn of storedConnections) {
        const existingReal = connections.find(c => c.platform === storedConn.platform)
        if (!existingReal) {
          connections.push(storedConn)
        }
      }
    } catch (error) {
      console.error('Error loading stored platform connections:', error)
    }
    
    return connections
  }

  static getConnection(platform: string): PlatformConnection | null {
    const connections = this.getConnections()
    return connections.find(c => c.platform === platform) || null
  }

  static removeConnection(platform: string): void {
    const connections = this.getConnections().filter(c => c.platform !== platform)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections))
  }

  // Authentication
  static getAuthUrl(platform: 'linkedin' | 'reddit' | 'threads' | 'x'): string {
    console.log(`PlatformService.getAuthUrl called for: ${platform}`);
    
    switch (platform) {
      case 'linkedin':
        console.log('Calling LinkedInAPI.getAuthUrl()');
        const linkedInUrl = LinkedInAPI.getAuthUrl();
        console.log('LinkedIn URL returned:', linkedInUrl);
        return linkedInUrl;
      case 'reddit':
        return RedditAPI.getAuthUrl()
      case 'threads':
        return ThreadsAPI.getAuthUrl()
      case 'x':
        return XAPI.getAuthUrl()
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  static async handleAuthCallback(platform: 'linkedin' | 'reddit' | 'threads' | 'x', code: string): Promise<PlatformConnection> {
    try {
      switch (platform) {
        case 'linkedin': {
          const accessToken = await LinkedInAPI.exchangeCodeForToken(code)
          const profile = await LinkedInAPI.getProfile(accessToken)
          
          const connection: PlatformConnection = {
            platform: 'linkedin',
            accessToken,
            profile: {
              id: profile.id,
              name: `${profile.firstName} ${profile.lastName}`,
              username: profile.vanityName,
              avatar: profile.profilePicture
            },
            connectedAt: new Date(),
            isValid: true
          }
          
          this.saveConnection(connection)
          return connection
        }

        case 'reddit': {
          const { accessToken, refreshToken } = await RedditAPI.exchangeCodeForToken(code)
          const profile = await RedditAPI.getProfile(accessToken)
          
          const connection: PlatformConnection = {
            platform: 'reddit',
            accessToken,
            refreshToken,
            profile: {
              id: profile.id,
              name: profile.name,
              username: profile.name,
              avatar: profile.avatar
            },
            connectedAt: new Date(),
            isValid: true
          }
          
          this.saveConnection(connection)
          return connection
        }

        case 'threads': {
          const accessToken = await ThreadsAPI.exchangeCodeForToken(code)
          const profile = await ThreadsAPI.getProfile(accessToken)
          
          const connection: PlatformConnection = {
            platform: 'threads',
            accessToken,
            profile: {
              id: profile.id,
              name: profile.displayName,
              username: profile.username,
              avatar: profile.profilePicture
            },
            connectedAt: new Date(),
            isValid: true
          }
          
          this.saveConnection(connection)
          return connection
        }

        case 'x': {
          // For X, we need to handle PKCE code verifier
          const codeVerifier = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM' // In production, store this securely
          const { accessToken, refreshToken } = await XAPI.exchangeCodeForToken(code, codeVerifier)
          const profile = await XAPI.getProfile(accessToken)
          
          const connection: PlatformConnection = {
            platform: 'x',
            accessToken,
            refreshToken,
            profile: {
              id: profile.id,
              name: profile.name,
              username: profile.username,
              avatar: profile.profile_image_url
            },
            connectedAt: new Date(),
            isValid: true
          }
          
          this.saveConnection(connection)
          return connection
        }

        default:
          throw new Error(`Unsupported platform: ${platform}`)
      }
    } catch (error) {
      console.error(`Auth callback error for ${platform}:`, error)
      throw error
    }
  }

  // Posting
  static async publishPost(post: Post): Promise<PostingResult[]> {
    const results: PostingResult[] = []

    for (const platformId of post.platforms) {
      const connection = this.getConnection(platformId)
      
      if (!connection || !connection.isValid) {
        results.push({
          platform: platformId,
          success: false,
          error: 'Platform not connected or invalid token'
        })
        continue
      }

      try {
        let postId: string | undefined

        switch (platformId) {
          case 'linkedin': {
            const formattedContent = LinkedInAPI.formatContent(post.content)
            postId = await LinkedInAPI.createPost(connection.accessToken, formattedContent)
            break
          }

          case 'reddit': {
            // For Reddit, we need a title and content
            const lines = post.content.split('\n')
            const title = lines[0] || 'Post from Post Genius'
            const text = lines.slice(1).join('\n') || post.content
            
            // Default to a general subreddit (in real app, user would choose)
            postId = await RedditAPI.submitTextPost(
              connection.accessToken,
              'test', // This should be user-selectable
              title,
              text
            )
            break
          }

          case 'threads': {
            const formattedContent = ThreadsAPI.formatContent(post.content)
            postId = await ThreadsAPI.createPost(connection.accessToken, formattedContent)
            break
          }

          case 'x': {
            const formattedContent = XAPI.formatContentForX(post.content)
            const tweet = await XAPI.postTweet(connection.accessToken, formattedContent)
            postId = tweet.id
            break
          }

          default:
            results.push({
              platform: platformId,
              success: false,
              error: `Unsupported platform: ${platformId}`
            })
            continue
        }

        results.push({
          platform: platformId,
          success: true,
          postId
        })

      } catch (error) {
        console.error(`Error posting to ${platformId}:`, error)
        results.push({
          platform: platformId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  // Validation
  static async validateConnections(): Promise<void> {
    const connections = this.getConnections()
    let hasChanges = false

    for (const connection of connections) {
      let isValid = false

      try {
        // Use server-side validation to avoid CORS issues
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: connection.platform,
            accessToken: connection.accessToken
          }),
        })

        if (response.ok) {
          const data = await response.json()
          isValid = data.isValid
        } else {
          console.error(`Validation failed for ${connection.platform}:`, response.status)
          isValid = false
        }
      } catch (error) {
        console.error(`Validation error for ${connection.platform}:`, error)
        isValid = false
      }

      if (connection.isValid !== isValid) {
        connection.isValid = isValid
        hasChanges = true
        
        // Clear expired tokens
        if (!isValid && connection.platform === 'reddit') {
          console.log('🔍 Clearing expired Reddit tokens')
          localStorage.removeItem('reddit_access_token')
          localStorage.removeItem('reddit_refresh_token')
          localStorage.removeItem('reddit_user')
        }
        if (!isValid && connection.platform === 'x') {
          console.log('🔍 Clearing expired X tokens')
          localStorage.removeItem('x_access_token')
          localStorage.removeItem('x_refresh_token')
          localStorage.removeItem('x_user')
        }
      }
    }

    if (hasChanges) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections))
    }
  }

  // Analytics
  static async getPostAnalytics(platform: string, postId: string): Promise<any> {
    const connection = this.getConnection(platform)
    
    if (!connection || !connection.isValid) {
      throw new Error('Platform not connected or invalid token')
    }

          switch (platform) {
        case 'linkedin':
          return await LinkedInAPI.getPostAnalytics(connection.accessToken, postId)
        case 'reddit':
          // Reddit doesn't provide detailed analytics via API
          return null
        case 'threads':
          // Threads analytics not available via API yet
          return null
        case 'x':
          // X analytics not available via API yet
          return null
        default:
          throw new Error(`Analytics not supported for platform: ${platform}`)
      }
  }

  // Helper: Get connected platforms
  static getConnectedPlatforms(): string[] {
    return this.getConnections()
      .filter(c => c.isValid)
      .map(c => c.platform)
  }

  // Helper: Check if platform is connected
  static isPlatformConnected(platform: string): boolean {
    const connection = this.getConnection(platform)
    return connection?.isValid || false
  }

  // Helper: Get platform display info
  static getPlatformInfo(platform: string): { name: string; icon: string; color: string } {
    const platformInfo = {
      linkedin: { name: 'LinkedIn', icon: '💼', color: 'bg-linkedin' },
      reddit: { name: 'Reddit', icon: '🤖', color: 'bg-reddit' },
      threads: { name: 'Threads', icon: '🧵', color: 'bg-threads' },
      twitter: { name: 'Twitter', icon: '🐦', color: 'bg-twitter' }
    }

    return platformInfo[platform as keyof typeof platformInfo] || { name: platform, icon: '📱', color: 'bg-gray-500' }
  }
}
