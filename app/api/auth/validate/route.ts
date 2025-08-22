import { NextRequest, NextResponse } from 'next/server'
import { RedditAPI } from '@/lib/api/reddit'
import { XAPI } from '@/lib/api/x'

export async function POST(request: NextRequest) {
  try {
    const { platform, accessToken } = await request.json()

    if (!platform || !accessToken) {
      return NextResponse.json(
        { error: 'Platform and access token are required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Validating ${platform} token...`)

    let isValid = false

    switch (platform) {
      case 'reddit':
        isValid = await RedditAPI.validateToken(accessToken)
        break
      case 'x':
        isValid = await XAPI.validateToken(accessToken)
        break
      // Add other platforms as needed
      default:
        return NextResponse.json(
          { error: `Platform ${platform} not supported for validation` },
          { status: 400 }
        )
    }

    console.log(`✅ ${platform} token validation result:`, isValid)

    return NextResponse.json({
      platform,
      isValid
    })

  } catch (error) {
    console.error('❌ Token validation error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to validate token',
        isValid: false
      },
      { status: 500 }
    )
  }
}
