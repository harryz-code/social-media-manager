export interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'viewer' | 'editor' | 'admin'
  joinedAt: Date
  permissions: {
    canView: boolean
    canEdit: boolean
    canPublish: boolean
    canInvite: boolean
    canDelete: boolean
    canManageCollaborators: boolean
  }
}

export interface CollaborationInvite {
  id: string
  postId: string
  email: string
  role: 'viewer' | 'editor'
  invitedBy: string
  invitedAt: Date
  expiresAt: Date
  status: 'pending' | 'accepted' | 'expired'
}

export interface PostComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: Date
  resolved: boolean
}

export interface PostVersion {
  id: string
  postId: string
  content: string
  platforms: string[]
  editedBy: string
  editedAt: Date
  version: number
  changes: string
}

export class CollaborationService {
  private static readonly STORAGE_KEYS = {
    COLLABORATORS: 'postgenius_collaborators',
    INVITES: 'postgenius_invites',
    COMMENTS: 'postgenius_comments',
    VERSIONS: 'postgenius_versions'
  }

  // Collaborator Management
  static addCollaborator(postId: string, collaborator: Omit<Collaborator, 'id' | 'joinedAt' | 'permissions'>): void {
    const collaborators = this.getCollaborators(postId)
    const permissions = this.getDefaultPermissions(collaborator.role)
    
    const newCollaborator: Collaborator = {
      ...collaborator,
      id: this.generateId(),
      joinedAt: new Date(),
      permissions
    }
    
    collaborators.push(newCollaborator)
    this.saveCollaborators(postId, collaborators)
  }

  private static getDefaultPermissions(role: 'viewer' | 'editor' | 'admin'): Collaborator['permissions'] {
    switch (role) {
      case 'admin':
        return {
          canView: true,
          canEdit: true,
          canPublish: true,
          canInvite: true,
          canDelete: true,
          canManageCollaborators: true
        }
      case 'editor':
        return {
          canView: true,
          canEdit: true,
          canPublish: true,
          canInvite: false,
          canDelete: false,
          canManageCollaborators: false
        }
      case 'viewer':
        return {
          canView: true,
          canEdit: false,
          canPublish: false,
          canInvite: false,
          canDelete: false,
          canManageCollaborators: false
        }
    }
  }

  static removeCollaborator(postId: string, collaboratorId: string): void {
    const collaborators = this.getCollaborators(postId)
    const filtered = collaborators.filter(c => c.id !== collaboratorId)
    this.saveCollaborators(postId, filtered)
  }

  static getCollaborators(postId: string): Collaborator[] {
    const key = `${this.STORAGE_KEYS.COLLABORATORS}_${postId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private static saveCollaborators(postId: string, collaborators: Collaborator[]): void {
    const key = `${this.STORAGE_KEYS.COLLABORATORS}_${postId}`
    localStorage.setItem(key, JSON.stringify(collaborators))
  }

  // Invite Management
  static createInvite(postId: string, email: string, role: 'viewer' | 'editor', invitedBy: string): CollaborationInvite {
    const invite: CollaborationInvite = {
      id: this.generateId(),
      postId,
      email,
      role,
      invitedBy,
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'pending'
    }

    const invites = this.getInvites(postId)
    invites.push(invite)
    this.saveInvites(postId, invites)

    return invite
  }

  static acceptInvite(inviteId: string, collaborator: Omit<Collaborator, 'id' | 'joinedAt'>): void {
    const allInvites = this.getAllInvites()
    const invite = allInvites.find(i => i.id === inviteId)
    
    if (invite && invite.status === 'pending' && new Date() < invite.expiresAt) {
      // Mark invite as accepted
      invite.status = 'accepted'
      this.saveAllInvites(allInvites)
      
      // Add collaborator
      this.addCollaborator(invite.postId, collaborator)
    }
  }

  static getInvites(postId: string): CollaborationInvite[] {
    const key = `${this.STORAGE_KEYS.INVITES}_${postId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private static getAllInvites(): CollaborationInvite[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.INVITES)
    return stored ? JSON.parse(stored) : []
  }

  private static saveInvites(postId: string, invites: CollaborationInvite[]): void {
    const key = `${this.STORAGE_KEYS.INVITES}_${postId}`
    localStorage.setItem(key, JSON.stringify(invites))
  }

  private static saveAllInvites(invites: CollaborationInvite[]): void {
    localStorage.setItem(this.STORAGE_KEYS.INVITES, JSON.stringify(invites))
  }

  // Comments System
  static addComment(postId: string, comment: Omit<PostComment, 'id' | 'createdAt'>): PostComment {
    const newComment: PostComment = {
      ...comment,
      id: this.generateId(),
      createdAt: new Date()
    }

    const comments = this.getComments(postId)
    comments.push(newComment)
    this.saveComments(postId, comments)

    return newComment
  }

  static resolveComment(postId: string, commentId: string): void {
    const comments = this.getComments(postId)
    const comment = comments.find(c => c.id === commentId)
    if (comment) {
      comment.resolved = true
      this.saveComments(postId, comments)
    }
  }

  static getComments(postId: string): PostComment[] {
    const key = `${this.STORAGE_KEYS.COMMENTS}_${postId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private static saveComments(postId: string, comments: PostComment[]): void {
    const key = `${this.STORAGE_KEYS.COMMENTS}_${postId}`
    localStorage.setItem(key, JSON.stringify(comments))
  }

  // Version History
  static saveVersion(postId: string, content: string, platforms: string[], editedBy: string, changes: string): PostVersion {
    const versions = this.getVersions(postId)
    const newVersion: PostVersion = {
      id: this.generateId(),
      postId,
      content,
      platforms,
      editedBy,
      editedAt: new Date(),
      version: versions.length + 1,
      changes
    }

    versions.push(newVersion)
    this.saveVersions(postId, versions)

    return newVersion
  }

  static getVersions(postId: string): PostVersion[] {
    const key = `${this.STORAGE_KEYS.VERSIONS}_${postId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private static saveVersions(postId: string, versions: PostVersion[]): void {
    const key = `${this.STORAGE_KEYS.VERSIONS}_${postId}`
    localStorage.setItem(key, JSON.stringify(versions))
  }

  // Utility functions
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  static canEdit(postId: string, userId: string): boolean {
    const collaborators = this.getCollaborators(postId)
    const collaborator = collaborators.find(c => c.id === userId)
    return collaborator?.role === 'editor' || collaborator?.role === 'admin'
  }

  static canView(postId: string, userId: string): boolean {
    const collaborators = this.getCollaborators(postId)
    return collaborators.some(c => c.id === userId)
  }

  static getShareableLink(postId: string): string {
    // In a real app, this would generate a secure shareable link
    return `${window.location.origin}/post/${postId}/collaborate`
  }
}
