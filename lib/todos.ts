export interface Todo {
  id: string
  title: string
  description: string
  category: 'feature' | 'improvement' | 'bug' | 'research'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'todo' | 'in-progress' | 'review' | 'done'
  assignee?: string
  estimatedHours?: number
  actualHours?: number
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  tags: string[]
  dependencies?: string[] // IDs of other todos that must be completed first
  notes?: string
}

export interface TodoCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export const todoCategories: TodoCategory[] = [
  {
    id: 'ui-ux',
    name: 'UI/UX',
    description: 'User interface and experience improvements',
    color: 'bg-blue-100 text-blue-700',
    icon: '🎨'
  },
  {
    id: 'ai-features',
    name: 'AI Features',
    description: 'Artificial intelligence and machine learning features',
    color: 'bg-purple-100 text-purple-700',
    icon: '🧠'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Third-party platform integrations',
    color: 'bg-green-100 text-green-700',
    icon: '🔗'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data analysis and reporting features',
    color: 'bg-orange-100 text-orange-700',
    icon: '📊'
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    description: 'Team collaboration and communication features',
    color: 'bg-pink-100 text-pink-700',
    icon: '👥'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Performance optimizations and technical improvements',
    color: 'bg-gray-100 text-gray-700',
    icon: '⚡'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security and privacy improvements',
    color: 'bg-red-100 text-red-700',
    icon: '🔒'
  }
]

export const initialTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Content Calendar - Drag-and-drop interface',
    description: 'Create a visual content calendar with drag-and-drop functionality for scheduling posts. Include monthly/weekly views, color coding by platform, and easy rescheduling.',
    category: 'feature',
    priority: 'high',
    status: 'done',
    estimatedHours: 16,
    actualHours: 8,
    tags: ['ui-ux', 'calendar', 'scheduling'],
    notes: '✅ Completed! Implemented drag-and-drop calendar with visual post management, platform color coding, and event details modal.'
  },
  {
    title: 'Bulk Operations - Schedule multiple posts',
    description: 'Allow users to create and schedule multiple posts at once. Include bulk editing, bulk scheduling, and bulk publishing capabilities.',
    category: 'feature',
    priority: 'high',
    status: 'done',
    estimatedHours: 12,
    actualHours: 6,
    tags: ['bulk', 'scheduling', 'productivity'],
    notes: '✅ Completed! Implemented AI-powered bulk post generation with scheduling strategies, bulk selection, and batch operations.'
  },
  {
    title: 'Real Platform Integrations',
    description: 'Connect to actual social media APIs (LinkedIn, Instagram, YouTube, Reddit) for real posting and analytics. Implement OAuth flows and API rate limiting.',
    category: 'feature',
    priority: 'critical',
    status: 'todo',
    estimatedHours: 40,
    tags: ['integrations', 'api', 'oauth'],
    notes: 'Start with LinkedIn API, then expand to other platforms. Need to handle API keys securely.'
  },
  {
    title: 'Advanced Analytics Dashboard',
    description: 'Create comprehensive analytics with real engagement tracking, performance insights, and customizable reports. Include competitor analysis and trend tracking.',
    category: 'feature',
    priority: 'high',
    status: 'todo',
    estimatedHours: 24,
    tags: ['analytics', 'dashboard', 'insights'],
    notes: 'Consider using Chart.js or D3.js for visualizations'
  },
  {
    title: 'Team Management & Authentication',
    description: 'Implement user authentication, team management, role-based permissions, and user profiles. Include SSO options and team collaboration features.',
    category: 'feature',
    priority: 'critical',
    status: 'todo',
    estimatedHours: 32,
    tags: ['auth', 'teams', 'permissions'],
    notes: 'Consider using NextAuth.js or Auth0 for authentication'
  },
  {
    title: 'Advanced AI Content Optimization',
    description: 'Enhance AI features with more sophisticated content optimization, A/B testing suggestions, optimal posting time recommendations, and content performance predictions.',
    category: 'feature',
    priority: 'medium',
    status: 'todo',
    estimatedHours: 20,
    tags: ['ai-features', 'optimization', 'ml'],
    notes: 'Build on existing Hugging Face integration, add more models'
  },
  {
    title: 'Real-time Notifications',
    description: 'Implement real-time notifications for post publishing, engagement milestones, team mentions, and system alerts. Include email and push notifications.',
    category: 'feature',
    priority: 'medium',
    status: 'todo',
    estimatedHours: 16,
    tags: ['notifications', 'real-time', 'alerts'],
    notes: 'Consider using WebSockets or Server-Sent Events'
  },
  {
    title: 'Content Templates Library',
    description: 'Expand the template system with more categories, custom templates, template sharing, and industry-specific templates.',
    category: 'improvement',
    priority: 'medium',
    status: 'todo',
    estimatedHours: 12,
    tags: ['templates', 'content', 'productivity'],
    notes: 'Allow users to create and share custom templates'
  },
  {
    title: 'Media Management',
    description: 'Add image and video upload capabilities, media library, image editing tools, and media optimization for different platforms.',
    category: 'feature',
    priority: 'medium',
    status: 'todo',
    estimatedHours: 18,
    tags: ['media', 'upload', 'editing'],
    notes: 'Consider using Cloudinary or similar service for media handling'
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize app performance with code splitting, lazy loading, caching strategies, and database optimization.',
    category: 'improvement',
    priority: 'medium',
    status: 'todo',
    estimatedHours: 14,
    tags: ['performance', 'optimization', 'technical'],
    notes: 'Focus on Core Web Vitals and loading times'
  },
  {
    title: 'Mobile Responsiveness',
    description: 'Ensure perfect mobile experience with responsive design, touch-friendly interactions, and mobile-specific features.',
    category: 'improvement',
    priority: 'high',
    status: 'todo',
    estimatedHours: 10,
    tags: ['mobile', 'responsive', 'ui-ux'],
    notes: 'Test on various devices and screen sizes'
  },
  {
    title: 'Data Export & Backup',
    description: 'Add data export functionality (CSV, JSON), backup options, and data migration tools for user data portability.',
    category: 'feature',
    priority: 'low',
    status: 'todo',
    estimatedHours: 8,
    tags: ['export', 'backup', 'data'],
    notes: 'Important for user trust and data portability'
  },
  {
    title: 'API Documentation',
    description: 'Create comprehensive API documentation for developers who want to integrate with Post Genius.',
    category: 'improvement',
    priority: 'low',
    status: 'todo',
    estimatedHours: 6,
    tags: ['api', 'documentation', 'developer'],
    notes: 'Use tools like Swagger or OpenAPI'
  },
  {
    title: 'Multi-language Support',
    description: 'Implement internationalization (i18n) to support multiple languages and regional content optimization.',
    category: 'feature',
    priority: 'low',
    status: 'todo',
    estimatedHours: 12,
    tags: ['i18n', 'localization', 'global'],
    notes: 'Start with Spanish, French, and German'
  },
  {
    title: 'Dark Mode',
    description: 'Add dark mode theme option with automatic system preference detection and manual toggle.',
    category: 'improvement',
    priority: 'low',
    status: 'todo',
    estimatedHours: 6,
    tags: ['dark-mode', 'ui-ux', 'accessibility'],
    notes: 'Use CSS variables for theme switching'
  }
]

export class TodoService {
  private static readonly STORAGE_KEY = 'postgenius_todos'

  static getTodos(): Todo[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      const todos = JSON.parse(stored)
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }))
    }
    
    // Initialize with default todos if none exist
    const defaultTodos = initialTodos.map(todo => ({
      ...todo,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    this.saveTodos(defaultTodos)
    return defaultTodos
  }

  static saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos))
  }

  static addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
    const todos = this.getTodos()
    const newTodo: Todo = {
      ...todo,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    todos.push(newTodo)
    this.saveTodos(todos)
    return newTodo
  }

  static updateTodo(id: string, updates: Partial<Todo>): Todo | null {
    const todos = this.getTodos()
    const index = todos.findIndex(todo => todo.id === id)
    if (index === -1) return null

    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date()
    }
    this.saveTodos(todos)
    return todos[index]
  }

  static deleteTodo(id: string): boolean {
    const todos = this.getTodos()
    const filtered = todos.filter(todo => todo.id !== id)
    if (filtered.length === todos.length) return false
    
    this.saveTodos(filtered)
    return true
  }

  static getTodosByStatus(status: Todo['status']): Todo[] {
    return this.getTodos().filter(todo => todo.status === status)
  }

  static getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.getTodos().filter(todo => todo.priority === priority)
  }

  static getTodosByCategory(category: Todo['category']): Todo[] {
    return this.getTodos().filter(todo => todo.category === category)
  }

  static getOverdueTodos(): Todo[] {
    const now = new Date()
    return this.getTodos().filter(todo => 
      todo.dueDate && todo.dueDate < now && todo.status !== 'done'
    )
  }

  static getUpcomingTodos(days: number = 7): Todo[] {
    const now = new Date()
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    return this.getTodos().filter(todo => 
      todo.dueDate && todo.dueDate >= now && todo.dueDate <= future && todo.status !== 'done'
    )
  }

  static getTodoStats(): {
    total: number
    todo: number
    inProgress: number
    review: number
    done: number
    overdue: number
  } {
    const todos = this.getTodos()
    const overdue = this.getOverdueTodos().length
    
    return {
      total: todos.length,
      todo: todos.filter(t => t.status === 'todo').length,
      inProgress: todos.filter(t => t.status === 'in-progress').length,
      review: todos.filter(t => t.status === 'review').length,
      done: todos.filter(t => t.status === 'done').length,
      overdue
    }
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}
