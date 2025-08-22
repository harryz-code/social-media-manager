import { createClient } from './supabase'
import { Post, Platform, Analytics, Collaboration, Todo } from './types'

export class DatabaseService {
  private static supabase = createClient()

  // User Profile
  static async createUserProfile(userId: string, profile: any) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('user_profiles')
      .insert([{ user_id: userId, ...profile }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserProfile(userId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  }

  static async updateUserProfile(userId: string, updates: any) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Posts
  static async createPost(userId: string, post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('posts')
      .insert([{ user_id: userId, ...post }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserPosts(userId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updatePost(postId: string, updates: Partial<Post>) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deletePost(postId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { error } = await this.supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) throw error
  }

  // Platform Connections
  static async savePlatformConnection(userId: string, connection: any) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('platform_connections')
      .upsert([{ user_id: userId, ...connection }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserPlatformConnections(userId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  static async deletePlatformConnection(userId: string, platformId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { error } = await this.supabase
      .from('platform_connections')
      .delete()
      .eq('user_id', userId)
      .eq('platform_id', platformId)

    if (error) throw error
  }

  // Analytics
  static async saveAnalytics(userId: string, analytics: Analytics) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('analytics')
      .upsert([{ user_id: userId, ...analytics }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserAnalytics(userId: string, timeRange: string = '30d') {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - this.getTimeRangeDays(timeRange) * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false })

    if (error) throw error
    return data
  }

  // Collaboration
  static async createCollaboration(userId: string, collaboration: any) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('collaborations')
      .insert([{ user_id: userId, ...collaboration }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getPostCollaborations(postId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('collaborations')
      .select('*')
      .eq('post_id', postId)

    if (error) throw error
    return data
  }

  // Todos
  static async createTodo(userId: string, todo: Omit<Todo, 'id' | 'createdAt'>) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('todos')
      .insert([{ user_id: userId, ...todo }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserTodos(userId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updateTodo(todoId: string, updates: Partial<Todo>) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('todos')
      .update(updates)
      .eq('id', todoId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteTodo(todoId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { error } = await this.supabase
      .from('todos')
      .delete()
      .eq('id', todoId)

    if (error) throw error
  }

  // Settings
  static async saveUserSettings(userId: string, settings: any) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('user_settings')
      .upsert([{ user_id: userId, ...settings }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserSettings(userId: string) {
    if (!this.supabase) {
      throw new Error('Supabase not configured')
    }
    const { data, error } = await this.supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  }

  // Helper method
  private static getTimeRangeDays(timeRange: string): number {
    switch (timeRange) {
      case '7d': return 7
      case '30d': return 30
      case '90d': return 90
      case '1y': return 365
      default: return 30
    }
  }
}
