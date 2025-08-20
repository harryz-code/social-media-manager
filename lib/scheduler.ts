import { Post } from './types'
import { getPosts, savePost } from './storage'
import { NotificationService } from './notifications'

export class SchedulerService {
  private static checkInterval: NodeJS.Timeout | null = null
  private static isRunning = false

  static start() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.checkInterval = setInterval(() => {
      this.checkScheduledPosts()
    }, 60000) // Check every minute
    
    console.log('Scheduler started')
  }

  static stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isRunning = false
    console.log('Scheduler stopped')
  }

  private static async checkScheduledPosts() {
    try {
      const posts = getPosts()
      const now = new Date()
      
      const postsToPublish = posts.filter(post => 
        post.status === 'scheduled' && 
        post.scheduledFor && 
        new Date(post.scheduledFor) <= now
      )

      for (const post of postsToPublish) {
        await this.publishPost(post)
      }
    } catch (error) {
      console.error('Error checking scheduled posts:', error)
    }
  }

  private static async publishPost(post: Post) {
    try {
      // Simulate publishing to platforms
      console.log(`Publishing post: ${post.content.substring(0, 50)}...`)
      
      // Update post status
      const updatedPost: Post = {
        ...post,
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date()
      }

      // Simulate platform publishing
      for (const platform of post.platforms) {
        await this.publishToPlatform(platform, post)
      }

      // Save updated post
      savePost(updatedPost)
      
      // Show notification
      NotificationService.notifyPostPublished(post)
      
    } catch (error) {
      console.error('Error publishing post:', error)
      
      // Mark as failed
      const failedPost: Post = {
        ...post,
        status: 'failed',
        updatedAt: new Date()
      }
      savePost(failedPost)
      
      // Show error notification
      NotificationService.notifyPostFailed(post, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  private static async publishToPlatform(platform: string, post: Post): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Simulate success/failure
    const success = Math.random() > 0.1 // 90% success rate
    
    if (!success) {
      throw new Error(`Failed to publish to ${platform}`)
    }
    
    console.log(`Successfully published to ${platform}`)
  }

  // Remove the old notification method since we're using NotificationService now

  static getNextScheduledPost(): Post | null {
    const posts = getPosts()
    const scheduledPosts = posts.filter(post => 
      post.status === 'scheduled' && post.scheduledFor
    )
    
    if (scheduledPosts.length === 0) return null
    
    return scheduledPosts.sort((a, b) => 
      new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime()
    )[0]
  }

  static getScheduledPostsCount(): number {
    const posts = getPosts()
    return posts.filter(post => post.status === 'scheduled').length
  }

  static getUpcomingPosts(limit: number = 5): Post[] {
    const posts = getPosts()
    const scheduledPosts = posts.filter(post => 
      post.status === 'scheduled' && post.scheduledFor
    )
    
    return scheduledPosts
      .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime())
      .slice(0, limit)
  }
}
