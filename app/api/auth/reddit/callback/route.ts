import { NextRequest, NextResponse } from 'next/server'
import { RedditAPI } from '@/lib/api/reddit'

export async function POST(request: NextRequest) {
  console.log('🔍 Reddit callback API route called')
  console.log('🔍 Environment check at start:')
  console.log('  - NEXT_PUBLIC_REDDIT_CLIENT_ID:', process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ? 'Set' : 'Missing')
  console.log('  - REDDIT_CLIENT_SECRET:', process.env.REDDIT_CLIENT_SECRET ? 'Set' : 'Missing')
  console.log('  - NEXT_PUBLIC_REDDIT_REDIRECT_URI:', process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI)
  
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
    console.log('🔄 About to call RedditAPI.exchangeCodeForToken...')
    console.log('🔄 Code received:', code ? code.substring(0, 10) + '...' : 'No code')
    
    if (!code) {
      throw new Error('No authorization code received')
    }
    
    console.log('🔄 About to call RedditAPI.exchangeCodeForToken...')
    
    // Test if RedditAPI is working
    try {
      const tokens = await RedditAPI.exchangeCodeForToken(code)
      console.log('✅ RedditAPI.exchangeCodeForToken succeeded')
    } catch (redditError) {
      console.error('❌ RedditAPI.exchangeCodeForToken failed:', redditError)
      console.error('❌ Error message:', redditError instanceof Error ? redditError.message : 'Unknown error')
      console.error('❌ Error stack:', redditError instanceof Error ? redditError.stack : 'No stack')
      throw redditError
    }
    
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
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('🔍 Detailed error info:', {
      message: errorMessage,
      stack: errorStack,
      config: {
        clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ? 'Set' : 'Missing',
        clientSecret: process.env.REDDIT_CLIENT_SECRET ? 'Set' : 'Missing',
        redirectUri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI
      }
    })
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorStack,
        debug: {
          clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ? 'Set' : 'Missing',
          clientSecret: process.env.REDDIT_CLIENT_SECRET ? 'Set' : 'Missing',
          redirectUri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI
        }
      },
      { status: 500 }
    )
  }
}
