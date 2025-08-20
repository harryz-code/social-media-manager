import { createClient } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  provider?: string
}

export class AuthService {
  private static supabase = createClient()

  // Email/Password Authentication
  static async signUp(email: string, password: string, name?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    })

    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  // Google OAuth
  static async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // LinkedIn OAuth
  static async signInWithLinkedIn() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Sign Out
  static async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  // Get Current User
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    
    if (error || !user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.user_metadata?.full_name,
      avatar: user.user_metadata?.avatar_url,
      provider: user.app_metadata?.provider
    }
  }

  // Get Session
  static async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    if (error) throw error
    return session
  }

  // Listen to Auth Changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  // Reset Password
  static async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    if (error) throw error
  }

  // Update Password
  static async updatePassword(password: string) {
    const { error } = await this.supabase.auth.updateUser({
      password
    })
    if (error) throw error
  }
}
