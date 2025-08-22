import { NextRequest, NextResponse } from 'next/server'
import { RedditAPI } from '@/lib/api/reddit'

export async function POST(request: NextRequest) {
  try {
    const { subreddit, title, text, accessToken } = await request.json()

    if (!subreddit || !title || !text || !accessToken) {
      return NextResponse.json(
        { error: 'Subreddit, title, text, and access token are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Reddit posting request:')
    console.log('  - Subreddit:', subreddit)
    console.log('  - Title:', title.substring(0, 50) + '...')
    console.log('  - Text length:', text.length)

    // Validate the access token first
    const isValid = await RedditAPI.validateToken(accessToken)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      )
    }

    // Submit the post to Reddit (try without flair first, then with default flair if needed)
    let postId: string
    try {
      postId = await RedditAPI.submitTextPost(accessToken, subreddit, title, text)
    } catch (error) {
      // If flair is required, try with a default flair
      if (error instanceof Error && error.message.includes('flair')) {
        console.log('🔄 Retrying with default flair...')
        // For now, we'll skip flair-required subreddits
        return NextResponse.json(
          { error: 'This subreddit requires post flair. Please try a different subreddit like r/test or r/AskReddit.' },
          { status: 400 }
        )
      }
      throw error
    }
    
    console.log('✅ Reddit post submitted successfully:')
    console.log('  - Post ID:', postId)
    console.log('  - Subreddit:', subreddit)

    return NextResponse.json({
      success: true,
      postId,
      subreddit,
      url: `https://reddit.com/r/${subreddit}/comments/${postId.replace('t3_', '')}`
    })

  } catch (error) {
    console.error('❌ Reddit posting error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to post to Reddit',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
