import { NextRequest, NextResponse } from 'next/server'
import { XAPI } from '@/lib/api/x'

export async function POST(request: NextRequest) {
  try {
    const { text, accessToken } = await request.json()

    if (!text || !accessToken) {
      return NextResponse.json(
        { error: 'Text and access token are required' },
        { status: 400 }
      )
    }

    console.log('🐦 Posting to X via server-side API...')

    // Validate the access token first
    const isValid = await XAPI.validateToken(accessToken)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      )
    }

    // Format content for X
    const formattedText = XAPI.formatContentForX(text)

    // Post the tweet
    const tweet = await XAPI.postTweet(accessToken, formattedText)

    console.log('✅ X tweet posted successfully:', tweet.id)

    return NextResponse.json({
      success: true,
      postId: tweet.id,
      text: tweet.text,
      url: `https://twitter.com/i/status/${tweet.id}`
    })

  } catch (error) {
    console.error('❌ X posting error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to post to X',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
