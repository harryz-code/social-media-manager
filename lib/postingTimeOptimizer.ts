export interface OptimalTime {
  day: string
  hour: number
  score: number
  reason: string
}

export interface EngagementPattern {
  day: string
  hour: number
  engagement: number
  posts: number
}

export interface PlatformOptimalTimes {
  platform: string
  times: OptimalTime[]
  timezone: string
}

export class PostingTimeOptimizer {
  private static readonly PLATFORM_TIMES = {
    linkedin: [
      { day: 'Monday', hours: [9, 10, 17, 18], score: 85 },
      { day: 'Tuesday', hours: [9, 10, 11, 15, 16, 17], score: 90 },
      { day: 'Wednesday', hours: [9, 10, 11, 15, 16, 17], score: 95 },
      { day: 'Thursday', hours: [9, 10, 11, 15, 16, 17], score: 90 },
      { day: 'Friday', hours: [9, 10, 11], score: 75 },
      { day: 'Saturday', hours: [10, 11], score: 60 },
      { day: 'Sunday', hours: [], score: 40 }
    ],
    reddit: [
      { day: 'Monday', hours: [14, 15, 16, 20, 21], score: 80 },
      { day: 'Tuesday', hours: [14, 15, 16, 20, 21], score: 85 },
      { day: 'Wednesday', hours: [14, 15, 16, 20, 21], score: 90 },
      { day: 'Thursday', hours: [14, 15, 16, 20, 21], score: 85 },
      { day: 'Friday', hours: [14, 15, 16], score: 75 },
      { day: 'Saturday', hours: [13, 14, 15, 16], score: 70 },
      { day: 'Sunday', hours: [13, 14, 15, 16, 20, 21], score: 75 }
    ],
    threads: [
      { day: 'Monday', hours: [9, 10, 17, 18, 19], score: 80 },
      { day: 'Tuesday', hours: [9, 10, 11, 15, 16, 17, 18], score: 85 },
      { day: 'Wednesday', hours: [9, 10, 11, 15, 16, 17, 18], score: 90 },
      { day: 'Thursday', hours: [9, 10, 11, 15, 16, 17, 18], score: 85 },
      { day: 'Friday', hours: [9, 10, 11, 15, 16, 17], score: 80 },
      { day: 'Saturday', hours: [10, 11, 12, 13, 14, 15], score: 75 },
      { day: 'Sunday', hours: [10, 11, 12, 13, 14, 15, 16], score: 70 }
    ]
  }

  // Get optimal posting times for a specific platform
  static getOptimalTimes(platform: string, timezone: string = 'UTC'): PlatformOptimalTimes {
    const platformData = this.PLATFORM_TIMES[platform as keyof typeof this.PLATFORM_TIMES]
    
    if (!platformData) {
      return {
        platform,
        times: [],
        timezone
      }
    }

    const times: OptimalTime[] = []
    
    platformData.forEach(dayData => {
      dayData.hours.forEach(hour => {
        times.push({
          day: dayData.day,
          hour,
          score: dayData.score,
          reason: this.getReasonForTime(platform, dayData.day, hour)
        })
      })
    })

    // Sort by score (highest first)
    times.sort((a, b) => b.score - a.score)

    return {
      platform,
      times: times.slice(0, 10), // Top 10 times
      timezone
    }
  }

  // Get optimal times for multiple platforms
  static getMultiPlatformOptimalTimes(platforms: string[], timezone: string = 'UTC'): PlatformOptimalTimes[] {
    return platforms.map(platform => this.getOptimalTimes(platform, timezone))
  }

  // Find the best overlapping times for multiple platforms
  static getBestOverlappingTimes(platforms: string[], timezone: string = 'UTC'): OptimalTime[] {
    const allTimes = this.getMultiPlatformOptimalTimes(platforms, timezone)
    const timeMap = new Map<string, { count: number; totalScore: number; platforms: string[] }>()

    // Aggregate times across platforms
    allTimes.forEach(platformData => {
      platformData.times.forEach(time => {
        const key = `${time.day}-${time.hour}`
        const existing = timeMap.get(key)
        
        if (existing) {
          existing.count++
          existing.totalScore += time.score
          existing.platforms.push(platformData.platform)
        } else {
          timeMap.set(key, {
            count: 1,
            totalScore: time.score,
            platforms: [platformData.platform]
          })
        }
      })
    })

    // Convert to OptimalTime objects and sort by overlap and score
    const overlappingTimes: OptimalTime[] = Array.from(timeMap.entries())
      .map(([key, data]) => {
        const [day, hour] = key.split('-')
        return {
          day,
          hour: parseInt(hour),
          score: Math.round(data.totalScore / data.count),
          reason: `Good for ${data.platforms.join(', ')} (${data.count} platforms)`
        }
      })
      .sort((a, b) => b.score - a.score)

    return overlappingTimes.slice(0, 5) // Top 5 overlapping times
  }

  // Get next optimal posting time
  static getNextOptimalTime(platform: string, timezone: string = 'UTC'): OptimalTime | null {
    const optimalTimes = this.getOptimalTimes(platform, timezone)
    const now = new Date()
    const currentDay = this.getDayName(now.getDay())
    const currentHour = now.getHours()

    // Find the next optimal time today or in the next few days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date(now)
      targetDate.setDate(now.getDate() + dayOffset)
      const targetDay = this.getDayName(targetDate.getDay())
      
      const dayTimes = optimalTimes.times.filter(time => time.day === targetDay)
      
      for (const time of dayTimes) {
        if (dayOffset === 0 && time.hour <= currentHour) continue
        
        return {
          ...time,
          reason: dayOffset === 0 ? 'Today' : `In ${dayOffset} day${dayOffset > 1 ? 's' : ''}`
        }
      }
    }

    return null
  }

  // Analyze user's historical engagement patterns
  static analyzeEngagementPatterns(historicalData: EngagementPattern[]): OptimalTime[] {
    if (historicalData.length === 0) return []

    // Group by day and hour
    const patternMap = new Map<string, { totalEngagement: number; postCount: number }>()
    
    historicalData.forEach(pattern => {
      const key = `${pattern.day}-${pattern.hour}`
      const existing = patternMap.get(key)
      
      if (existing) {
        existing.totalEngagement += pattern.engagement
        existing.postCount += pattern.posts
      } else {
        patternMap.set(key, {
          totalEngagement: pattern.engagement,
          postCount: pattern.posts
        })
      }
    })

    // Calculate average engagement and create OptimalTime objects
    const times: OptimalTime[] = Array.from(patternMap.entries())
      .map(([key, data]) => {
        const [day, hour] = key.split('-')
        const avgEngagement = data.postCount > 0 ? data.totalEngagement / data.postCount : 0
        
        return {
          day,
          hour: parseInt(hour),
          score: Math.round(avgEngagement),
          reason: `Based on ${data.postCount} posts with avg ${Math.round(avgEngagement)} engagement`
        }
      })
      .filter(time => time.score > 0)
      .sort((a, b) => b.score - a.score)

    return times.slice(0, 10)
  }

  // Get personalized recommendations based on user's timezone and preferences
  static getPersonalizedRecommendations(
    platform: string,
    userTimezone: string,
    preferredDays?: string[],
    preferredHours?: number[]
  ): OptimalTime[] {
    const optimalTimes = this.getOptimalTimes(platform, userTimezone)
    
    if (!preferredDays && !preferredHours) {
      return optimalTimes.times
    }

    return optimalTimes.times.filter(time => {
      const dayMatch = !preferredDays || preferredDays.includes(time.day)
      const hourMatch = !preferredHours || preferredHours.includes(time.hour)
      return dayMatch && hourMatch
    })
  }

  // Convert time to user's timezone
  static convertToUserTimezone(time: OptimalTime, userTimezone: string): OptimalTime {
    // This would use a proper timezone library in production
    // For now, we'll return the time as-is
    return {
      ...time,
      reason: `${time.reason} (${userTimezone})`
    }
  }

  // Get reason for why a time is optimal
  private static getReasonForTime(platform: string, day: string, hour: number): string {
    const reasons = {
      linkedin: {
        'Monday': 'Start of work week, professionals checking in',
        'Tuesday': 'Peak professional engagement day',
        'Wednesday': 'Midweek productivity peak',
        'Thursday': 'Pre-weekend planning and networking',
        'Friday': 'Weekend anticipation, lighter engagement',
        'Saturday': 'Weekend browsing, casual engagement',
        'Sunday': 'Lowest professional engagement'
      },
      reddit: {
        'Monday': 'Back to work, seeking distraction',
        'Tuesday': 'Midweek browsing peak',
        'Wednesday': 'Hump day engagement',
        'Thursday': 'Pre-weekend activity',
        'Friday': 'Weekend anticipation',
        'Saturday': 'Weekend leisure browsing',
        'Sunday': 'Sunday evening wind-down'
      },
      threads: {
        'Monday': 'Start of week social check-in',
        'Tuesday': 'Midweek social engagement',
        'Wednesday': 'Peak social media activity',
        'Thursday': 'Pre-weekend social planning',
        'Friday': 'Weekend excitement building',
        'Saturday': 'Weekend social sharing',
        'Sunday': 'Sunday reflection and planning'
      }
    }

    const dayReason = reasons[platform as keyof typeof reasons]?.[day as keyof typeof reasons.linkedin] || 'General engagement'
    const hourReason = hour >= 9 && hour <= 17 ? 'Business hours' : hour >= 18 && hour <= 21 ? 'Evening leisure' : 'Off-peak hours'
    
    return `${dayReason} - ${hourReason}`
  }

  // Get day name from day number
  private static getDayName(dayNumber: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber]
  }

  // Get timezone offset for user
  static getUserTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return 'UTC'
    }
  }

  // Format time for display
  static formatTime(hour: number): string {
    if (hour === 0) return '12 AM'
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return '12 PM'
    return `${hour - 12} PM`
  }

  // Get time until next optimal posting
  static getTimeUntilNextOptimal(optimalTime: OptimalTime): string {
    const now = new Date()
    const targetDate = new Date(now)
    
    // Set target to next occurrence of the optimal day and hour
    const dayMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 }
    const targetDay = dayMap[optimalTime.day as keyof typeof dayMap]
    
    targetDate.setHours(optimalTime.hour, 0, 0, 0)
    
    // If today is the target day but the hour has passed, move to next week
    if (now.getDay() === targetDay && now.getHours() >= optimalTime.hour) {
      targetDate.setDate(targetDate.getDate() + 7)
    } else {
      // Move to next occurrence of the target day
      const daysUntilTarget = (targetDay - now.getDay() + 7) % 7
      targetDate.setDate(targetDate.getDate() + daysUntilTarget)
    }

    const diffMs = targetDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}, ${diffHours} hour${diffHours > 1 ? 's' : ''}`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}, ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    }
  }
}
