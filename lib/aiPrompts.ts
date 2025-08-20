export interface AIPrompt {
  id: string
  title: string
  description: string
  prompt: string
  category: PromptCategory
  tags: string[]
  platforms: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
}

export type PromptCategory = 
  | 'business' 
  | 'personal' 
  | 'educational' 
  | 'engagement' 
  | 'storytelling' 
  | 'thought-leadership'
  | 'behind-scenes'
  | 'achievements'
  | 'tips-advice'
  | 'trending'
  | 'questions'
  | 'inspiration'

export const aiPrompts: AIPrompt[] = [
  // Business & Professional
  {
    id: 'business-1',
    title: 'Share a Business Lesson Learned',
    description: 'Share a valuable business lesson you learned the hard way',
    prompt: 'Write about a business lesson you learned that others can benefit from. Include what happened, what you learned, and how others can avoid the same mistake.',
    category: 'business',
    tags: ['business', 'lessons', 'learning'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'beginner',
    estimatedTime: 5
  },
  {
    id: 'business-2',
    title: 'Behind the Scenes of Your Business',
    description: 'Show the real work behind your success',
    prompt: 'Share a behind-the-scenes look at your business. What does a typical day look like? What challenges are you currently facing? Be authentic and relatable.',
    category: 'behind-scenes',
    tags: ['behind-scenes', 'authenticity', 'business'],
    platforms: ['linkedin', 'threads', 'reddit'],
    difficulty: 'beginner',
    estimatedTime: 3
  },
  {
    id: 'business-3',
    title: 'Industry Trend Analysis',
    description: 'Share your take on current industry trends',
    prompt: 'What trend in your industry are you most excited about or concerned about? Share your perspective and why it matters.',
    category: 'thought-leadership',
    tags: ['trends', 'industry', 'analysis'],
    platforms: ['linkedin'],
    difficulty: 'intermediate',
    estimatedTime: 8
  },

  // Personal & Storytelling
  {
    id: 'personal-1',
    title: 'Share Your Origin Story',
    description: 'Tell the story of how you got started',
    prompt: 'Share your origin story. What led you to where you are today? What pivotal moments shaped your journey?',
    category: 'storytelling',
    tags: ['story', 'journey', 'personal'],
    platforms: ['linkedin', 'threads', 'reddit'],
    difficulty: 'beginner',
    estimatedTime: 7
  },
  {
    id: 'personal-2',
    title: 'A Failure That Taught You Something',
    description: 'Share a failure and what you learned from it',
    prompt: 'Share a failure or setback you experienced and what you learned from it. Be vulnerable and honest about what went wrong.',
    category: 'personal',
    tags: ['failure', 'learning', 'vulnerability'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'intermediate',
    estimatedTime: 6
  },
  {
    id: 'personal-3',
    title: 'What You're Currently Learning',
    description: 'Share something you're actively learning',
    prompt: 'What are you currently learning or studying? Share your progress, challenges, and insights from the learning process.',
    category: 'educational',
    tags: ['learning', 'growth', 'progress'],
    platforms: ['linkedin', 'threads', 'reddit'],
    difficulty: 'beginner',
    estimatedTime: 4
  },

  // Tips & Advice
  {
    id: 'tips-1',
    title: 'Quick Tip or Hack',
    description: 'Share a useful tip or life hack',
    prompt: 'Share a quick tip, hack, or piece of advice that has helped you. Make it actionable and easy to implement.',
    category: 'tips-advice',
    tags: ['tips', 'advice', 'hacks'],
    platforms: ['linkedin', 'threads', 'reddit'],
    difficulty: 'beginner',
    estimatedTime: 3
  },
  {
    id: 'tips-2',
    title: 'How-To Guide',
    description: 'Create a step-by-step guide for something you know well',
    prompt: 'Create a step-by-step guide for something you're knowledgeable about. Break it down into simple, actionable steps.',
    category: 'educational',
    tags: ['how-to', 'guide', 'tutorial'],
    platforms: ['linkedin', 'threads', 'reddit'],
    difficulty: 'intermediate',
    estimatedTime: 10
  },
  {
    id: 'tips-3',
    title: 'Common Mistake to Avoid',
    description: 'Warn others about a common mistake',
    prompt: 'What's a common mistake people make in your field that you want to warn others about? Explain why it's problematic and how to avoid it.',
    category: 'tips-advice',
    tags: ['mistakes', 'advice', 'warnings'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'beginner',
    estimatedTime: 5
  },

  // Engagement & Questions
  {
    id: 'engagement-1',
    title: 'Ask Your Audience',
    description: 'Pose an interesting question to your followers',
    prompt: 'Ask your audience an engaging question. Make it thought-provoking and encourage them to share their experiences or opinions.',
    category: 'questions',
    tags: ['question', 'engagement', 'audience'],
    platforms: ['linkedin', 'threads', 'reddit'],
    difficulty: 'beginner',
    estimatedTime: 2
  },
  {
    id: 'engagement-2',
    title: 'Poll or Survey',
    description: 'Create a poll to gather insights from your audience',
    prompt: 'Create a poll or survey question to gather insights from your audience. Make it relevant to your industry or expertise.',
    category: 'engagement',
    tags: ['poll', 'survey', 'insights'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'beginner',
    estimatedTime: 2
  },
  {
    id: 'engagement-3',
    title: 'Share and Ask',
    description: 'Share something and ask for others' experiences',
    prompt: 'Share an experience, observation, or insight, then ask your audience to share their own similar experiences.',
    category: 'engagement',
    tags: ['share', 'ask', 'community'],
    platforms: ['linkedin', 'threads', 'reddit'],
    difficulty: 'beginner',
    estimatedTime: 4
  },

  // Achievements & Milestones
  {
    id: 'achievements-1',
    title: 'Celebrate a Win',
    description: 'Share and celebrate a recent achievement',
    prompt: 'Share a recent win or achievement. What did you accomplish? What did you learn in the process?',
    category: 'achievements',
    tags: ['achievement', 'success', 'celebration'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'beginner',
    estimatedTime: 4
  },
  {
    id: 'achievements-2',
    title: 'Milestone Reflection',
    description: 'Reflect on reaching an important milestone',
    prompt: 'You've reached an important milestone. Reflect on the journey, the challenges overcome, and what's next.',
    category: 'achievements',
    tags: ['milestone', 'reflection', 'journey'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'intermediate',
    estimatedTime: 6
  },

  // Thought Leadership
  {
    id: 'thought-leadership-1',
    title: 'Contrarian Opinion',
    description: 'Share an unpopular but well-reasoned opinion',
    prompt: 'Share a contrarian opinion about something in your industry. Back it up with reasoning and evidence.',
    category: 'thought-leadership',
    tags: ['opinion', 'contrarian', 'industry'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'advanced',
    estimatedTime: 12
  },
  {
    id: 'thought-leadership-2',
    title: 'Future Prediction',
    description: 'Make a prediction about your industry's future',
    prompt: 'Make a prediction about where your industry is heading. What changes do you see coming? What should people prepare for?',
    category: 'thought-leadership',
    tags: ['prediction', 'future', 'industry'],
    platforms: ['linkedin'],
    difficulty: 'advanced',
    estimatedTime: 10
  },

  // Trending & Current Events
  {
    id: 'trending-1',
    title: 'React to Current News',
    description: 'Share your take on current industry news',
    prompt: 'React to a current news story or development in your industry. What's your perspective? What does it mean for the future?',
    category: 'trending',
    tags: ['news', 'current-events', 'reaction'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'intermediate',
    estimatedTime: 6
  },
  {
    id: 'trending-2',
    title: 'Trend Analysis',
    description: 'Analyze a current trend in your field',
    prompt: 'Analyze a current trend in your field. What's driving it? Is it here to stay? What should people know about it?',
    category: 'trending',
    tags: ['trends', 'analysis', 'insights'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'intermediate',
    estimatedTime: 8
  },

  // Inspiration & Motivation
  {
    id: 'inspiration-1',
    title: 'Quote That Resonates',
    description: 'Share a quote that inspires you',
    prompt: 'Share a quote that has inspired you recently. Why does it resonate with you? How has it influenced your thinking or actions?',
    category: 'inspiration',
    tags: ['quote', 'inspiration', 'motivation'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'beginner',
    estimatedTime: 3
  },
  {
    id: 'inspiration-2',
    title: 'What Motivates You',
    description: 'Share what drives and motivates you',
    prompt: 'What motivates you to do what you do? Share your driving force and what keeps you going through challenges.',
    category: 'inspiration',
    tags: ['motivation', 'purpose', 'drive'],
    platforms: ['linkedin', 'threads'],
    difficulty: 'intermediate',
    estimatedTime: 5
  }
]

export class AIPromptService {
  static getPromptsByCategory(category: PromptCategory): AIPrompt[] {
    return aiPrompts.filter(prompt => prompt.category === category)
  }

  static getPromptsByPlatform(platform: string): AIPrompt[] {
    return aiPrompts.filter(prompt => prompt.platforms.includes(platform))
  }

  static getPromptsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): AIPrompt[] {
    return aiPrompts.filter(prompt => prompt.difficulty === difficulty)
  }

  static getPromptsByTags(tags: string[]): AIPrompt[] {
    return aiPrompts.filter(prompt => 
      tags.some(tag => prompt.tags.includes(tag))
    )
  }

  static getRandomPrompt(): AIPrompt {
    const randomIndex = Math.floor(Math.random() * aiPrompts.length)
    return aiPrompts[randomIndex]
  }

  static getRandomPromptByCategory(category: PromptCategory): AIPrompt {
    const categoryPrompts = this.getPromptsByCategory(category)
    const randomIndex = Math.floor(Math.random() * categoryPrompts.length)
    return categoryPrompts[randomIndex]
  }

  static getCategories(): PromptCategory[] {
    return [...new Set(aiPrompts.map(prompt => prompt.category))]
  }

  static getTags(): string[] {
    const allTags = aiPrompts.flatMap(prompt => prompt.tags)
    return [...new Set(allTags)]
  }

  static searchPrompts(query: string): AIPrompt[] {
    const lowercaseQuery = query.toLowerCase()
    return aiPrompts.filter(prompt => 
      prompt.title.toLowerCase().includes(lowercaseQuery) ||
      prompt.description.toLowerCase().includes(lowercaseQuery) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }
}
