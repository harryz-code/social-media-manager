interface XProfile {
  id: string
  username: string
  name: string
  profile_image_url?: string
  verified?: boolean
  followers_count?: number
  following_count?: number
}

interface XPost {
  id: string
  text: string
  created_at: string
  public_metrics?: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
  }
}

interface XAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

export class XAPI {
  private static readonly API_BASE = 'https://api.twitter.com/2'
  private static readonly AUTH_BASE = 'https://twitter.com/i/oauth2/authorize'
  private static readonly TOKEN_URL = 'https://api.twitter.com/2/oauth2/token'

  private static getAuthConfig(): XAuthConfig {
    return {
      clientId: process.env.NEXT_PUBLIC_X_CLIENT_ID || '',
      clientSecret: process.env.X_CLIENT_SECRET || '',
      redirectUri: process.env.NEXT_PUBLIC_X_REDIRECT_URI || 'http://localhost:3000/auth/x/callback',
      scope: ['tweet.read', 'tweet.write', 'users.read']
    }
  }

  static getAuthUrl(): string {
    const config = this.getAuthConfig()
    const state = this.generateState()
    
    // Ensure redirect URI is properly encoded
    const redirectUri = encodeURIComponent(config.redirectUri)
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope.join(' '),
      state: state,
      code_challenge: this.generateCodeChallenge(),
      code_challenge_method: 'S256'
    })

    console.log('🔗 X OAuth URL generated (v2):', {
      clientId: config.clientId ? '✅ Set' : '❌ Missing',
      redirectUri: config.redirectUri,
      scope: config.scope,
      encodedRedirectUri: redirectUri
    })

    return `${this.AUTH_BASE}?${params.toString()}`
  }

  static async exchangeCodeForToken(code: string, codeVerifier: string): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
  }> {
    const config = this.getAuthConfig()
    
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      code_verifier: codeVerifier
    })

    console.log('🔄 Exchanging X authorization code for token...')

    const response = await fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: body.toString()
    })

    console.log('📡 X token exchange response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ X token exchange failed:', errorText)
      throw new Error(`X token exchange failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ X token exchange successful')

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    }
  }

  static async getProfile(accessToken: string): Promise<XProfile> {
    console.log('👤 Fetching X profile...')

    const response = await fetch(`${this.API_BASE}/users/me?user.fields=id,username,name,profile_image_url,verified,public_metrics`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ X profile fetch failed:', errorText)
      throw new Error(`Failed to fetch X profile: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ X profile fetched successfully')

    return {
      id: data.data.id,
      username: data.data.username,
      name: data.data.name,
      profile_image_url: data.data.profile_image_url,
      verified: data.data.verified,
      followers_count: data.data.public_metrics?.followers_count,
      following_count: data.data.public_metrics?.following_count
    }
  }

  static async postTweet(accessToken: string, text: string): Promise<XPost> {
    console.log('🐦 Posting tweet:', text.substring(0, 50) + '...')

    const response = await fetch(`${this.API_BASE}/tweets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    })

    console.log('📡 X tweet response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ X tweet failed:', errorData)
      throw new Error(`Failed to post tweet: ${errorData.errors?.[0]?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log('✅ Tweet posted successfully')

    return {
      id: data.data.id,
      text: data.data.text,
      created_at: data.data.created_at
    }
  }

  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      console.log('🔍 Validating X access token...')
      
      const response = await fetch(`${this.API_BASE}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const isValid = response.ok
      console.log('✅ X token validation result:', isValid)
      
      return isValid
    } catch (error) {
      console.error('❌ X token validation failed:', error)
      return false
    }
  }

  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
  }> {
    const config = this.getAuthConfig()
    
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId
    })

    const response = await fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: body.toString()
    })

    if (!response.ok) {
      throw new Error('Failed to refresh X access token')
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresIn: data.expires_in
    }
  }

  // Helper methods for OAuth PKCE
  private static generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private static generateCodeChallenge(): string {
    // For simplicity, using a static challenge. In production, generate dynamically
    return 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
  }

  // Content formatting for X
  static formatContentForX(content: string): string {
    return content
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive line breaks
      .replace(/#(\w+)/g, ' #$1') // Ensure hashtags have space before them
      .substring(0, 280) // X character limit
  }
}
