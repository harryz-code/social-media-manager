'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ShareIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { 
  CollaborationService, 
  Collaborator, 
  CollaborationInvite, 
  PostComment, 
  PostVersion 
} from '@/lib/collaboration'
import toast from 'react-hot-toast'

interface CollaborationPanelProps {
  postId: string
  currentUserId: string
  currentUserName: string
  isOpen: boolean
  onClose: () => void
}

export default function CollaborationPanel({ 
  postId, 
  currentUserId, 
  currentUserName, 
  isOpen, 
  onClose 
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<'collaborators' | 'comments' | 'history'>('collaborators')
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [invites, setInvites] = useState<CollaborationInvite[]>([])
  const [comments, setComments] = useState<PostComment[]>([])
  const [versions, setVersions] = useState<PostVersion[]>([])
  
  const [newInviteEmail, setNewInviteEmail] = useState('')
  const [newInviteRole, setNewInviteRole] = useState<'viewer' | 'editor'>('viewer')
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, postId])

  const loadData = () => {
    setCollaborators(CollaborationService.getCollaborators(postId))
    setInvites(CollaborationService.getInvites(postId))
    setComments(CollaborationService.getComments(postId))
    setVersions(CollaborationService.getVersions(postId))
  }

  const handleInviteCollaborator = () => {
    if (!newInviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    try {
      CollaborationService.createInvite(postId, newInviteEmail, newInviteRole, currentUserName)
      setNewInviteEmail('')
      setNewInviteRole('viewer')
      loadData()
      toast.success(`Invite sent to ${newInviteEmail}`)
    } catch (error) {
      toast.error('Failed to send invite')
    }
  }

  const handleRemoveCollaborator = (collaboratorId: string) => {
    CollaborationService.removeCollaborator(postId, collaboratorId)
    loadData()
    toast.success('Collaborator removed')
  }

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    try {
      CollaborationService.addComment(postId, {
        postId,
        authorId: currentUserId,
        authorName: currentUserName,
        content: newComment,
        resolved: false
      })
      setNewComment('')
      loadData()
      toast.success('Comment added')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const handleResolveComment = (commentId: string) => {
    CollaborationService.resolveComment(postId, commentId)
    loadData()
    toast.success('Comment resolved')
  }

  const copyShareLink = () => {
    const link = CollaborationService.getShareableLink(postId)
    navigator.clipboard.writeText(link)
    toast.success('Share link copied to clipboard')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Collaboration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('collaborators')}
            className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'collaborators'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserGroupIcon className="w-4 h-4 mr-2" />
            Collaborators
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
            Comments
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClockIcon className="w-4 h-4 mr-2" />
            History
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'collaborators' && (
            <div className="space-y-6">
              {/* Invite Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Collaborators</h3>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <select
                    value={newInviteRole}
                    onChange={(e) => setNewInviteRole(e.target.value as 'viewer' | 'editor')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <button
                    onClick={handleInviteCollaborator}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Current Collaborators */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Collaborators</h3>
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {collaborator.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{collaborator.name}</div>
                          <div className="text-sm text-gray-500">{collaborator.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          collaborator.role === 'admin' ? 'bg-red-100 text-red-700' :
                          collaborator.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {collaborator.role}
                        </span>
                        {collaborator.id !== currentUserId && (
                          <button
                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {collaborators.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No collaborators yet</p>
                      <p className="text-sm">Invite team members to collaborate on this post</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Link */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Share Link</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={CollaborationService.getShareableLink(postId)}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={copyShareLink}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Add Comment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Comment</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className={`p-3 rounded-lg border ${
                      comment.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{comment.authorName}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            {comment.resolved && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                Resolved
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        {!comment.resolved && comment.authorId === currentUserId && (
                          <button
                            onClick={() => handleResolveComment(comment.id)}
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No comments yet</p>
                      <p className="text-sm">Start a conversation about this post</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Version History</h3>
              <div className="space-y-3">
                {versions.map((version) => (
                  <div key={version.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">Version {version.version}</span>
                        <span className="text-sm text-gray-500">
                          by {version.editedBy}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(version.editedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{version.changes}</p>
                    <div className="flex items-center space-x-2">
                      {version.platforms.map((platform) => (
                        <span key={platform} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {versions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No version history yet</p>
                    <p className="text-sm">Changes will appear here as you edit the post</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
