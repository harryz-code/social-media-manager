import { NextRequest, NextResponse } from 'next/server'
import { RedditAPI } from '@/lib/api/reddit'

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Server-side Reddit token exchange:')
    console.log('  - Code:', code.substring(0, 10) + '...')
    console.log('  - State:', state)
    console.log('  - Environment variables:')
    console.log('    - Client ID:', process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ? '✅ Set' : '❌ Missing')
    console.log('    - Client Secret:', process.env.REDDIT_CLIENT_SECRET ? '✅ Set' : '❌ Missing')
    console.log('    - Redirect URI:', process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI)

    // Exchange the authorization code for access token
    const tokens = await RedditAPI.exchangeCodeForToken(code)
    
    console.log('✅ Token exchange successful:')
    console.log('  - Access Token:', tokens.accessToken.substring(0, 20) + '...')
    console.log('  - Refresh Token:', tokens.refreshToken.substring(0, 20) + '...')

    // Get user profile information
    const profile = await RedditAPI.getProfile(tokens.accessToken)
    
    console.log('✅ Profile fetched:')
    console.log('  - Username:', profile.name)
    console.log('  - Karma:', profile.karma)

    return NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: profile.id,
        username: profile.name,
        karma: profile.karma,
        verified: profile.verified,
        avatar: profile.avatar
      }
    })

  } catch (error) {
    console.error('❌ Server-side Reddit callback error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to authenticate with Reddit',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
