import { Post, Analytics, Platform } from './types'
import { generateId } from './storage'

export const samplePosts: Post[] = [
  {
    id: generateId(),
    content: "🚀 Excited to announce our latest product launch! This revolutionary tool will transform how you manage social media content. #ProductLaunch #Innovation #SocialMedia",
    platforms: ['linkedin', 'twitter'],
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    hashtags: ['#ProductLaunch', '#Innovation', '#SocialMedia'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: generateId(),
    content: "Behind the scenes: Our team working late to perfect the user experience. The dedication and passion here is incredible! 👥 #TeamWork #BehindTheScenes #StartupLife",
    platforms: ['instagram', 'linkedin'],
    status: 'published',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    hashtags: ['#TeamWork', '#BehindTheScenes', '#StartupLife'],
    engagement: {
      views: 1250,
      likes: 89,
      comments: 12,
      shares: 5
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: generateId(),
    content: "💡 Pro Tip: The best time to post on LinkedIn is Tuesday-Thursday between 9-11 AM. Our data shows 40% higher engagement during these hours! #LinkedInTips #SocialMediaStrategy",
    platforms: ['linkedin'],
    status: 'published',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    hashtags: ['#LinkedInTips', '#SocialMediaStrategy'],
    engagement: {
      views: 2100,
      likes: 156,
      comments: 23,
      shares: 18
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: generateId(),
    content: "📊 Industry Insight: Social media engagement rates have increased by 25% this quarter. What's driving this growth? Let's discuss in the comments! #IndustryInsights #SocialMediaTrends",
    platforms: ['linkedin', 'twitter'],
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    hashtags: ['#IndustryInsights', '#SocialMediaTrends'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: generateId(),
    content: "🎥 New video tutorial: How to create engaging content that converts. Watch now and learn our proven strategies! #ContentCreation #VideoMarketing #Tutorial",
    platforms: ['youtube', 'linkedin'],
    status: 'published',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    hashtags: ['#ContentCreation', '#VideoMarketing', '#Tutorial'],
    engagement: {
      views: 3400,
      likes: 234,
      comments: 45,
      shares: 32
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
]

export const sampleAnalytics: Analytics = {
  totalFollowers: 15420,
  totalPosts: 47,
  avgEngagement: 8.5,
  totalReach: 125000,
  platformStats: [
    {
      platform: 'LinkedIn',
      followers: '8.2k',
      posts: 23,
      engagement: '12.3%',
      reach: '45.2k',
      change: '+15%',
      changeType: 'positive'
    },
    {
      platform: 'Instagram',
      followers: '4.1k',
      posts: 15,
      engagement: '6.8%',
      reach: '32.1k',
      change: '+8%',
      changeType: 'positive'
    },
    {
      platform: 'YouTube',
      followers: '2.3k',
      posts: 7,
      engagement: '4.2%',
      reach: '28.7k',
      change: '+22%',
      changeType: 'positive'
    },
    {
      platform: 'Reddit',
      followers: '800',
      posts: 2,
      engagement: '3.1%',
      reach: '19k',
      change: '+5%',
      changeType: 'positive'
    }
  ],
  topPosts: samplePosts.slice(0, 3)
}

export const samplePlatforms: Platform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'text-linkedin',
    connected: true,
    followers: '8.2k'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: 'text-instagram',
    connected: true,
    followers: '4.1k'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: 'text-youtube',
    connected: true,
    followers: '2.3k'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🤖',
    color: 'text-reddit',
    connected: false
  }
]

export const initializeSampleData = () => {
  if (typeof window === 'undefined') return

  // Check if sample data already exists
  const existingPosts = localStorage.getItem('postgenius_posts')
  const existingAnalytics = localStorage.getItem('postgenius_analytics')
  const existingPlatforms = localStorage.getItem('postgenius_platforms')

  // Only initialize if no data exists
  if (!existingPosts) {
    localStorage.setItem('postgenius_posts', JSON.stringify(samplePosts))
  }
  
  if (!existingAnalytics) {
    localStorage.setItem('postgenius_analytics', JSON.stringify(sampleAnalytics))
  }
  
  if (!existingPlatforms) {
    localStorage.setItem('postgenius_platforms', JSON.stringify(samplePlatforms))
  }
}
