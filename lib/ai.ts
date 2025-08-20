import { AISuggestion } from './types'

// Simple AI content improvement service
export class AIService {
  private static readonly HASHTAG_SUGGESTIONS = {
    tech: ['#tech', '#technology', '#innovation', '#startup', '#coding', '#programming', '#ai', '#machinelearning'],
    business: ['#business', '#entrepreneur', '#startup', '#leadership', '#management', '#strategy', '#growth'],
    marketing: ['#marketing', '#digitalmarketing', '#socialmedia', '#contentmarketing', '#branding', '#growth'],
    design: ['#design', '#ux', '#ui', '#webdesign', '#graphicdesign', '#creativity', '#art'],
    general: ['#inspiration', '#motivation', '#success', '#growth', '#learning', '#development']
  }

  private static readonly CONTENT_IMPROVEMENTS = [
    'Add a compelling hook at the beginning to grab attention',
    'Include specific numbers or data points to add credibility',
    'End with a clear call-to-action to encourage engagement',
    'Use power words to make your content more impactful',
    'Break up long paragraphs for better readability',
    'Ask a question to encourage comments and discussion',
    'Share a personal story or experience to build connection',
    'Include industry-specific terminology to show expertise'
  ]

  private static readonly TIMING_SUGGESTIONS = [
    'Post during peak hours (9-11 AM or 1-3 PM) for maximum reach',
    'Tuesday-Thursday typically see higher engagement rates',
    'Consider your audience\'s timezone for optimal timing',
    'Space out posts by at least 2-3 hours to avoid overwhelming followers'
  ]

  static async improveContent(content: string, platform: string): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = []
    
    // Analyze content length
    if (content.length < 50) {
      suggestions.push({
        id: this.generateId(),
        type: 'content',
        suggestion: 'Consider adding more detail to make your post more engaging',
        confidence: 0.8,
        applied: false
      })
    }

    if (content.length > 200 && platform === 'twitter') {
      suggestions.push({
        id: this.generateId(),
        type: 'content',
        suggestion: 'This content is too long for Twitter. Consider breaking it into a thread.',
        confidence: 0.9,
        applied: false
      })
    }

    // Check for questions
    if (!content.includes('?')) {
      suggestions.push({
        id: this.generateId(),
        type: 'engagement',
        suggestion: 'Adding a question can increase engagement by encouraging responses',
        confidence: 0.7,
        applied: false
      })
    }

    // Check for call-to-action
    if (!this.hasCallToAction(content)) {
      suggestions.push({
        id: this.generateId(),
        type: 'engagement',
        suggestion: 'Include a call-to-action like "What do you think?" or "Share your experience"',
        confidence: 0.8,
        applied: false
      })
    }

    // Suggest hashtags
    const hashtagSuggestion = this.suggestHashtags(content)
    if (hashtagSuggestion) {
      suggestions.push(hashtagSuggestion)
    }

    // Add timing suggestion
    suggestions.push({
      id: this.generateId(),
      type: 'timing',
      suggestion: this.TIMING_SUGGESTIONS[Math.floor(Math.random() * this.TIMING_SUGGESTIONS.length)],
      confidence: 0.6,
      applied: false
    })

    return suggestions
  }

  static async generateHashtags(content: string, count: number = 5): Promise<string[]> {
    const words = content.toLowerCase().split(/\s+/)
    const hashtags: string[] = []
    
    // Simple keyword extraction
    const keywords = words.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'just', 'into', 'than', 'more', 'other', 'about', 'many', 'then', 'them', 'these', 'people', 'only', 'well', 'also', 'over', 'still', 'take', 'every', 'think', 'here', 'again', 'another', 'around', 'away', 'because', 'before', 'below', 'between', 'during', 'first', 'found', 'great', 'house', 'large', 'might', 'never', 'often', 'place', 'right', 'small', 'sound', 'their', 'there', 'through', 'under', 'until', 'water', 'where', 'while', 'world', 'years'].includes(word)
    )

    // Add relevant hashtags based on content
    if (keywords.some(word => ['tech', 'technology', 'coding', 'programming', 'ai', 'software'].includes(word))) {
      hashtags.push(...this.HASHTAG_SUGGESTIONS.tech.slice(0, 2))
    }
    
    if (keywords.some(word => ['business', 'entrepreneur', 'startup', 'leadership', 'management'].includes(word))) {
      hashtags.push(...this.HASHTAG_SUGGESTIONS.business.slice(0, 2))
    }
    
    if (keywords.some(word => ['marketing', 'social', 'content', 'brand', 'growth'].includes(word))) {
      hashtags.push(...this.HASHTAG_SUGGESTIONS.marketing.slice(0, 2))
    }

    // Add general hashtags
    hashtags.push(...this.HASHTAG_SUGGESTIONS.general.slice(0, 2))

    return hashtags.slice(0, count)
  }

  static async enhanceContent(content: string): Promise<string> {
    let enhanced = content

    // Add hashtags if none present
    if (!content.includes('#')) {
      const hashtags = await this.generateHashtags(content, 3)
      enhanced += `\n\n${hashtags.join(' ')}`
    }

    // Add call-to-action if none present
    if (!this.hasCallToAction(content)) {
      const ctas = [
        'What are your thoughts?',
        'Share your experience below!',
        'Would love to hear your perspective!',
        'What do you think?',
        'Drop a comment if you agree!'
      ]
      enhanced += `\n\n${ctas[Math.floor(Math.random() * ctas.length)]}`
    }

    return enhanced
  }

  private static hasCallToAction(content: string): boolean {
    const ctaKeywords = ['what', 'think', 'thoughts', 'share', 'comment', 'agree', 'disagree', 'experience', 'perspective']
    return ctaKeywords.some(keyword => content.toLowerCase().includes(keyword))
  }

  private static suggestHashtags(content: string): AISuggestion | null {
    const words = content.toLowerCase().split(/\s+/)
    
    if (words.some(word => ['tech', 'technology', 'coding', 'programming'].includes(word))) {
      return {
        id: this.generateId(),
        type: 'hashtag',
        suggestion: 'Consider adding tech hashtags like #tech #programming #innovation',
        confidence: 0.8,
        applied: false
      }
    }

    if (words.some(word => ['business', 'entrepreneur', 'startup'].includes(word))) {
      return {
        id: this.generateId(),
        type: 'hashtag',
        suggestion: 'Consider adding business hashtags like #business #entrepreneur #startup',
        confidence: 0.8,
        applied: false
      }
    }

    return null
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}
