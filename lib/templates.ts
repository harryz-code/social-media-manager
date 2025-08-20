export interface ContentTemplate {
  id: string
  name: string
  description: string
  category: 'business' | 'personal' | 'promotional' | 'educational' | 'engagement'
  content: string
  hashtags: string[]
  platforms: string[]
  variables: TemplateVariable[]
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'url' | 'date'
  placeholder: string
  required: boolean
}

export const contentTemplates: ContentTemplate[] = [
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Announce a new product or feature launch',
    category: 'promotional',
    content: '🚀 Excited to announce our latest {product_name}! {product_description}\n\nThis {product_type} will help you {benefit}.\n\n🔗 Learn more: {product_url}\n\nWhat do you think? We\'d love to hear your thoughts!',
    hashtags: ['#productlaunch', '#innovation', '#newproduct', '#tech'],
    platforms: ['linkedin', 'twitter'],
    variables: [
      { name: 'product_name', type: 'text', placeholder: 'Product name', required: true },
      { name: 'product_description', type: 'text', placeholder: 'Brief description', required: true },
      { name: 'product_type', type: 'text', placeholder: 'Type of product', required: true },
      { name: 'benefit', type: 'text', placeholder: 'Main benefit', required: true },
      { name: 'product_url', type: 'url', placeholder: 'Product URL', required: false }
    ]
  },
  {
    id: 'behind-scenes',
    name: 'Behind the Scenes',
    description: 'Share a glimpse into your work process',
    category: 'personal',
    content: 'Behind the scenes: {activity_description}\n\n{personal_insight}\n\n{hashtag_1} {hashtag_2} {hashtag_3}',
    hashtags: ['#behindthescenes', '#worklife', '#teamwork'],
    platforms: ['instagram', 'linkedin'],
    variables: [
      { name: 'activity_description', type: 'text', placeholder: 'What you\'re working on', required: true },
      { name: 'personal_insight', type: 'text', placeholder: 'Your thoughts or insights', required: true },
      { name: 'hashtag_1', type: 'text', placeholder: 'Relevant hashtag', required: false },
      { name: 'hashtag_2', type: 'text', placeholder: 'Relevant hashtag', required: false },
      { name: 'hashtag_3', type: 'text', placeholder: 'Relevant hashtag', required: false }
    ]
  },
  {
    id: 'industry-insights',
    name: 'Industry Insights',
    description: 'Share valuable industry knowledge and insights',
    category: 'educational',
    content: '💡 Industry Insight: {insight_topic}\n\n{insight_content}\n\nKey takeaway: {key_takeaway}\n\nWhat\'s your experience with this? Share in the comments!',
    hashtags: ['#industryinsights', '#thoughtleadership', '#expertise'],
    platforms: ['linkedin', 'twitter'],
    variables: [
      { name: 'insight_topic', type: 'text', placeholder: 'Topic of your insight', required: true },
      { name: 'insight_content', type: 'text', placeholder: 'Your insight or analysis', required: true },
      { name: 'key_takeaway', type: 'text', placeholder: 'Main takeaway for readers', required: true }
    ]
  },
  {
    id: 'team-spotlight',
    name: 'Team Spotlight',
    description: 'Highlight team members and their contributions',
    category: 'personal',
    content: '👥 Team Spotlight: Meet {team_member_name}!\n\n{member_role} at {company_name}\n\n{member_achievement}\n\n{personal_note}\n\n{hashtag_1} {hashtag_2}',
    hashtags: ['#teamspotlight', '#companyculture', '#teamwork'],
    platforms: ['linkedin', 'instagram'],
    variables: [
      { name: 'team_member_name', type: 'text', placeholder: 'Team member name', required: true },
      { name: 'member_role', type: 'text', placeholder: 'Their role', required: true },
      { name: 'company_name', type: 'text', placeholder: 'Company name', required: true },
      { name: 'member_achievement', type: 'text', placeholder: 'Recent achievement', required: true },
      { name: 'personal_note', type: 'text', placeholder: 'Personal note or fun fact', required: false },
      { name: 'hashtag_1', type: 'text', placeholder: 'Relevant hashtag', required: false },
      { name: 'hashtag_2', type: 'text', placeholder: 'Relevant hashtag', required: false }
    ]
  },
  {
    id: 'question-post',
    name: 'Engagement Question',
    description: 'Ask your audience a thought-provoking question',
    category: 'engagement',
    content: '🤔 Question of the day:\n\n{question}\n\n{context}\n\nShare your thoughts in the comments below! 👇\n\n{hashtag_1} {hashtag_2}',
    hashtags: ['#question', '#engagement', '#discussion'],
    platforms: ['linkedin', 'twitter', 'instagram'],
    variables: [
      { name: 'question', type: 'text', placeholder: 'Your question', required: true },
      { name: 'context', type: 'text', placeholder: 'Context or background', required: false },
      { name: 'hashtag_1', type: 'text', placeholder: 'Relevant hashtag', required: false },
      { name: 'hashtag_2', type: 'text', placeholder: 'Relevant hashtag', required: false }
    ]
  },
  {
    id: 'tips-advice',
    name: 'Tips & Advice',
    description: 'Share helpful tips and advice with your audience',
    category: 'educational',
    content: '💡 Pro Tip: {tip_topic}\n\n{tip_content}\n\nWhy this matters: {why_matters}\n\n{call_to_action}\n\n{hashtag_1} {hashtag_2} {hashtag_3}',
    hashtags: ['#protip', '#advice', '#tips'],
    platforms: ['linkedin', 'twitter', 'instagram'],
    variables: [
      { name: 'tip_topic', type: 'text', placeholder: 'Topic of your tip', required: true },
      { name: 'tip_content', type: 'text', placeholder: 'Your tip or advice', required: true },
      { name: 'why_matters', type: 'text', placeholder: 'Why this tip is important', required: true },
      { name: 'call_to_action', type: 'text', placeholder: 'What should readers do next', required: false },
      { name: 'hashtag_1', type: 'text', placeholder: 'Relevant hashtag', required: false },
      { name: 'hashtag_2', type: 'text', placeholder: 'Relevant hashtag', required: false },
      { name: 'hashtag_3', type: 'text', placeholder: 'Relevant hashtag', required: false }
    ]
  }
]

export class TemplateService {
  static getTemplatesByCategory(category?: string): ContentTemplate[] {
    if (!category) return contentTemplates
    return contentTemplates.filter(template => template.category === category)
  }

  static getTemplateById(id: string): ContentTemplate | undefined {
    return contentTemplates.find(template => template.id === id)
  }

  static fillTemplate(template: ContentTemplate, variables: Record<string, string>): string {
    let content = template.content

    // Replace variables in content
    template.variables.forEach(variable => {
      const value = variables[variable.name] || `{${variable.name}}`
      content = content.replace(new RegExp(`{${variable.name}}`, 'g'), value)
    })

    // Add hashtags
    if (template.hashtags.length > 0) {
      content += `\n\n${template.hashtags.join(' ')}`
    }

    return content
  }

  static getTemplateCategories(): string[] {
    return [...new Set(contentTemplates.map(template => template.category))]
  }

  static getTemplatesForPlatform(platform: string): ContentTemplate[] {
    return contentTemplates.filter(template => 
      template.platforms.includes(platform.toLowerCase())
    )
  }
}
