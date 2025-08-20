export interface AISuggestion {
  id: string
  suggestion: string
  type: 'hashtag' | 'content' | 'timing' | 'engagement'
  confidence: number
  applied: boolean
}

export interface AIResponse {
  generated_text: string
  confidence?: number
}

class HuggingFaceAPI {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || ''
  private static readonly BASE_URL = 'https://api-inference.huggingface.co/models'
  
  // Models for different tasks
  private static readonly MODELS = {
    TEXT_GENERATION: 'gpt2',
    SENTIMENT_ANALYSIS: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    TEXT_SUMMARIZATION: 'facebook/bart-large-cnn',
    TEXT_CLASSIFICATION: 'facebook/bart-large-mnli'
  }

  static async generateText(prompt: string, maxLength: number = 100): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/${this.MODELS.TEXT_GENERATION}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: maxLength,
            temperature: 0.7,
            do_sample: true
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data[0]?.generated_text || prompt
    } catch (error) {
      console.error('Hugging Face API error:', error)
      // Fallback to simple text enhancement
      return this.fallbackEnhancement(prompt)
    }
  }

  static async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    try {
      const response = await fetch(`${this.BASE_URL}/${this.MODELS.SENTIMENT_ANALYSIS}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const sentiment = data[0]?.[0]?.label?.toLowerCase()
      
      if (sentiment?.includes('positive')) return 'positive'
      if (sentiment?.includes('negative')) return 'negative'
      return 'neutral'
    } catch (error) {
      console.error('Sentiment analysis error:', error)
      return 'neutral'
    }
  }

  static async summarizeText(text: string): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/${this.MODELS.TEXT_SUMMARIZATION}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            max_length: 150,
            min_length: 30
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data[0]?.summary_text || text
    } catch (error) {
      console.error('Text summarization error:', error)
      return text
    }
  }

  private static fallbackEnhancement(text: string): string {
    // Simple fallback enhancement when API is unavailable
    let enhanced = text
    
    // Add line breaks for readability
    enhanced = enhanced.replace(/\. /g, '.\n\n')
    
    // Add engagement elements if missing
    if (!enhanced.includes('?') && !enhanced.includes('!')) {
      enhanced += '\n\nWhat do you think?'
    }
    
    return enhanced
  }
}

export class AIService {
  static async improveContent(content: string, platform: string = 'linkedin'): Promise<string> {
    try {
      // Create a platform-specific prompt
      const prompt = this.createPlatformPrompt(content, platform)
      
      // Use Hugging Face API for text generation
      const improved = await HuggingFaceAPI.generateText(prompt, content.length + 100)
      
      // Apply platform-specific formatting
      return this.applyPlatformFormatting(improved, platform)
    } catch (error) {
      console.error('Content improvement error:', error)
      // Fallback to simple enhancement
      return this.simpleEnhancement(content, platform)
    }
  }

  static async generateSuggestions(content: string, platform: string): Promise<AISuggestion[]> {
    const suggestions: AISuggestion[] = []
    
    try {
      // Analyze sentiment to provide better suggestions
      const sentiment = await HuggingFaceAPI.analyzeSentiment(content)
      
      // Generate hashtag suggestions
      const hashtagSuggestion = await this.generateHashtagSuggestion(content, platform, sentiment)
             if (hashtagSuggestion) {
         suggestions.push({
           id: this.generateId(),
           suggestion: hashtagSuggestion,
           type: 'hashtag',
           confidence: 0.8,
           applied: false
         })
       }
      
      // Generate content improvement suggestions
      const contentSuggestion = await this.generateContentSuggestion(content, platform, sentiment)
             if (contentSuggestion) {
         suggestions.push({
           id: this.generateId(),
           suggestion: contentSuggestion,
           type: 'content',
           confidence: 0.7,
           applied: false
         })
       }
      
             // Generate engagement suggestions
       const engagementSuggestion = this.generateEngagementSuggestion(sentiment)
       suggestions.push({
         id: this.generateId(),
         suggestion: engagementSuggestion,
         type: 'engagement',
         confidence: 0.9,
         applied: false
       })
      
    } catch (error) {
      console.error('Suggestion generation error:', error)
             // Fallback suggestions
       suggestions.push({
         id: this.generateId(),
         suggestion: 'Consider adding relevant hashtags to increase visibility',
         type: 'hashtag',
         confidence: 0.6,
         applied: false
       })
    }
    
    return suggestions
  }

  static async generateHashtags(content: string, count: number = 5): Promise<string[]> {
    try {
      // Extract key topics from content
      const topics = this.extractTopics(content)
      
      // Generate hashtags based on topics and platform
      const hashtags = topics.slice(0, count).map(topic => `#${topic.replace(/\s+/g, '')}`)
      
      // Add platform-specific hashtags
      const platformHashtags = this.getPlatformHashtags()
      hashtags.push(...platformHashtags.slice(0, 2))
      
      return hashtags.slice(0, count)
    } catch (error) {
      console.error('Hashtag generation error:', error)
      return ['#content', '#socialmedia', '#post']
    }
  }

  static async enhanceContent(content: string): Promise<string> {
    try {
      // Use Hugging Face for content enhancement
      const enhanced = await HuggingFaceAPI.generateText(
        `Improve this social media post: ${content}`,
        content.length + 50
      )
      return enhanced
    } catch (error) {
      console.error('Content enhancement error:', error)
      return this.fallbackEnhancement(content)
    }
  }

  // Private helper methods
  private static createPlatformPrompt(content: string, platform: string): string {
    const platformPrompts = {
      linkedin: `Improve this LinkedIn post to be more professional and engaging: ${content}`,
      twitter: `Make this Twitter post more concise and engaging (max 280 chars): ${content}`,
      instagram: `Enhance this Instagram post with emojis and hashtags: ${content}`,
      youtube: `Improve this YouTube post description: ${content}`,
      reddit: `Make this Reddit post more engaging and community-focused: ${content}`
    }
    
    return platformPrompts[platform.toLowerCase()] || platformPrompts.linkedin
  }

  private static applyPlatformFormatting(content: string, platform: string): string {
    switch (platform.toLowerCase()) {
      case 'instagram':
        if (!content.includes('📸') && !content.includes('📷')) {
          content = '📸 ' + content
        }
        break
      case 'youtube':
        if (!content.includes('🎥') && !content.includes('📺')) {
          content = '🎥 ' + content
        }
        break
      case 'twitter':
        if (content.length > 280) {
          content = content.substring(0, 277) + '...'
        }
        break
    }
    
    return content
  }

  private static simpleEnhancement(content: string, platform: string): string {
    let enhanced = content
    
    // Add platform-specific improvements
    switch (platform.toLowerCase()) {
      case 'linkedin':
        if (!enhanced.includes('#')) {
          enhanced += '\n\n#LinkedIn #Professional #Networking'
        }
        break
      case 'twitter':
        if (enhanced.length > 280) {
          enhanced = enhanced.substring(0, 277) + '...'
        }
        break
      case 'instagram':
        if (!enhanced.includes('📸')) {
          enhanced = '📸 ' + enhanced
        }
        break
    }
    
    return enhanced
  }

  private static async generateHashtagSuggestion(content: string, platform: string, sentiment: string): Promise<string> {
    const topics = this.extractTopics(content)
    const platformHashtags = this.getPlatformHashtags()
    
    const suggestions = [
      `Add hashtags like: ${topics.slice(0, 3).map(t => `#${t.replace(/\s+/g, '')}`).join(', ')}`,
      `Include platform hashtags: ${platformHashtags.slice(0, 2).join(', ')}`,
      `Consider trending hashtags in your industry`
    ]
    
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  private static async generateContentSuggestion(content: string, platform: string, sentiment: string): Promise<string> {
    if (content.length < 50) {
      return 'Consider adding more details to make your post more engaging'
    }
    
    if (sentiment === 'negative') {
      return 'Consider making your tone more positive to increase engagement'
    }
    
    if (!content.includes('?') && !content.includes('!')) {
      return 'Add a question or call-to-action to encourage engagement'
    }
    
    return 'Your content looks good! Consider adding a personal touch or story'
  }

  private static generateEngagementSuggestion(sentiment: string): string {
    const suggestions = {
      positive: 'Great positive tone! Consider asking followers to share their experiences',
      negative: 'Consider balancing with positive elements to maintain engagement',
      neutral: 'Add emotional elements or questions to increase engagement'
    }
    
    return suggestions[sentiment] || suggestions.neutral
  }

  private static extractTopics(content: string): string[] {
    // Simple topic extraction based on common words
    const words = content.toLowerCase().split(/\s+/)
    const commonTopics = ['business', 'technology', 'marketing', 'social', 'media', 'content', 'strategy', 'growth', 'innovation']
    
    return commonTopics.filter(topic => 
      words.some(word => word.includes(topic) || topic.includes(word))
    )
  }

  private static getPlatformHashtags(): string[] {
    return ['#socialmedia', '#content', '#marketing', '#digital', '#growth']
  }

  private static fallbackEnhancement(content: string): string {
    return content + '\n\nWhat are your thoughts on this?'
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}
