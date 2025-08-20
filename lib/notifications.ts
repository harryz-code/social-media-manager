import toast from 'react-hot-toast'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export class NotificationService {
  private static notifications: Notification[] = []

  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }

    this.notifications.unshift(newNotification)
    
    // Show toast notification
    switch (notification.type) {
      case 'success':
        toast.success(notification.message, { duration: 4000 })
        break
      case 'error':
        toast.error(notification.message, { duration: 5000 })
        break
      case 'warning':
        toast(notification.message, { 
          icon: '⚠️',
          duration: 4000 
        })
        break
      case 'info':
        toast(notification.message, { 
          icon: 'ℹ️',
          duration: 3000 
        })
        break
    }

    // Store in localStorage
    this.saveNotifications()
  }

  static getNotifications(): Notification[] {
    return this.notifications
  }

  static markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications()
    }
  }

  static markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.saveNotifications()
  }

  static clearNotifications() {
    this.notifications = []
    this.saveNotifications()
  }

  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Post-specific notifications
  static notifyPostPublished(post: any) {
    this.addNotification({
      type: 'success',
      title: 'Post Published!',
      message: `Your post has been successfully published to ${post.platforms.join(', ')}`
    })
  }

  static notifyPostScheduled(post: any) {
    this.addNotification({
      type: 'info',
      title: 'Post Scheduled',
      message: `Post scheduled for ${new Date(post.scheduledFor).toLocaleString()}`
    })
  }

  static notifyPostFailed(post: any, error: string) {
    this.addNotification({
      type: 'error',
      title: 'Post Failed',
      message: `Failed to publish post: ${error}`
    })
  }

  static notifyPlatformConnected(platform: string) {
    this.addNotification({
      type: 'success',
      title: 'Platform Connected',
      message: `Successfully connected to ${platform}`
    })
  }

  static notifyPlatformDisconnected(platform: string) {
    this.addNotification({
      type: 'warning',
      title: 'Platform Disconnected',
      message: `Disconnected from ${platform}`
    })
  }

  // Analytics notifications
  static notifyHighEngagement(post: any, engagement: number) {
    this.addNotification({
      type: 'success',
      title: 'High Engagement!',
      message: `Your post is performing well with ${engagement}% engagement rate`
    })
  }

  // Private methods
  private static saveNotifications() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('socialflow_notifications', JSON.stringify(this.notifications))
    }
  }

  private static loadNotifications() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('socialflow_notifications')
        if (stored) {
          this.notifications = JSON.parse(stored).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
  }

  // Initialize
  static init() {
    this.loadNotifications()
  }
}
