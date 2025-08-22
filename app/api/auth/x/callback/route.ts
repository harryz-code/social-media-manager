import { NextRequest, NextResponse } from 'next/server'
import { XAPI } from '@/lib/api/x'

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    console.log('🔄 Processing X OAuth callback on server side...')

    // For now, using a static code verifier. In production, this should be stored securely
    const codeVerifier = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'

    // Exchange code for token
    const { accessToken, refreshToken, expiresIn } = await XAPI.exchangeCodeForToken(code, codeVerifier)

    // Get user profile
    const profile = await XAPI.getProfile(accessToken)

    console.log('✅ X OAuth completed successfully for user:', profile.username)

    return NextResponse.json({
      accessToken,
      refreshToken,
      expiresIn,
      profile
    })

  } catch (error) {
    console.error('❌ X OAuth callback error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to authenticate with X',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
