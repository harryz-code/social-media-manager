'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
  PhotoIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Post, Platform, AISuggestion } from '@/lib/types'
import { savePost, getPlatforms, generateId } from '@/lib/storage'
import { AIService } from '@/lib/ai'
import { NotificationService } from '@/lib/notifications'
import { CollaborationService } from '@/lib/collaboration'
import { PlatformService } from '@/lib/api/platformService'
import TemplateSelector from '@/components/TemplateSelector'
import CollaborationPanel from '@/components/CollaborationPanel'
import PlatformIcon from '@/components/PlatformIcon'
import toast from 'react-hot-toast'

const postSchema = z.object({
  content: z.string().min(1, 'Content is required').max(280, 'Content must be less than 280 characters'),
  title: z.string().optional(), // Optional title for Reddit posts
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

export default function PostEditor() {
  const [isImproving, setIsImproving] = useState(false)
  const [improvedContent, setImprovedContent] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [currentPostId, setCurrentPostId] = useState<string>('')
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>('')
  const [redditTitle, setRedditTitle] = useState<string>('')
  const [subredditSuggestions] = useState([
    'AskReddit', 'todayilearned', 'LifeProTips', 'explainlikeimfive',
    'technology', 'programming', 'webdev', 'MachineLearning',
    'entrepreneur', 'business', 'startups', 'marketing',
    'socialmedia', 'digital_marketing', 'content_marketing'
  ])

  const handleTemplateSelect = (content: string) => {
    setValue('content', content)
    toast.success('Template applied!')
  }

  const handleCollaboration = () => {
    if (!currentPostId) {
      // Create a temporary post ID for new posts
      setCurrentPostId('temp_' + Date.now())
    }
    setShowCollaboration(true)
  }

  // Platform-specific content formatting
  const formatContentForPlatform = (content: string, platform: string) => {
    switch (platform) {
      case 'linkedin':
        // LinkedIn prefers professional tone, hashtags, and line breaks
        return content
          .replace(/\n/g, '\n\n') // Double line breaks for LinkedIn
          .replace(/#(\w+)/g, ' #$1') // Ensure hashtags have space before them
      case 'reddit':
        // Reddit prefers markdown formatting
        return content
          .replace(/\*\*(.*?)\*\*/g, '**$1**') // Bold text
          .replace(/\*(.*?)\*/g, '*$1*') // Italic text
      case 'threads':
        // Threads prefers casual, conversational tone
        return content
          .replace(/\n/g, '\n') // Single line breaks
          .replace(/#(\w+)/g, ' #$1') // Hashtags
      default:
        return content
    }
  }

  // Get platform-specific suggestions
  const getPlatformSuggestions = () => {
    const suggestions: string[] = []
    
    if (selectedPlatforms.includes('linkedin')) {
      suggestions.push('💼 Professional tone recommended')
      suggestions.push('📊 Include industry insights')
      suggestions.push('🤝 Engage with your network')
    }
    
    if (selectedPlatforms.includes('reddit')) {
      suggestions.push('🤖 Check subreddit rules first')
      suggestions.push('📝 Use markdown formatting')
      suggestions.push('💬 Engage with the community')
    }
    
    if (selectedPlatforms.includes('threads')) {
      suggestions.push('🧵 Keep it conversational')
      suggestions.push('📱 Use emojis naturally')
      suggestions.push('🔥 Follow trending topics')
    }
    
    return suggestions
  }

  // Load platforms on component mount
  useEffect(() => {
    const loadPlatforms = () => {
      const storedPlatforms = getPlatforms()
      setPlatforms(storedPlatforms)
    }
    loadPlatforms()
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      title: '',
      platforms: [],
      scheduledDate: '',
      scheduledTime: '',
    },
  })

  const content = watch('content')
  const characterCount = content.length
  
  // Platform-specific character limits
  const getMaxCharacters = () => {
    if (selectedPlatforms.includes('threads')) return 500
    if (selectedPlatforms.includes('linkedin')) return 3000
    if (selectedPlatforms.includes('reddit')) return 40000
    return 280 // Default
  }
  
  const maxCharacters = getMaxCharacters()

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
    setValue('platforms', selectedPlatforms.includes(platformId) 
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId]
    )
  }

  const improveContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content first')
      return
    }

    setIsImproving(true)
    
    try {
      // Get AI suggestions for the first selected platform
      const platform = selectedPlatforms[0] || 'linkedin'
      const suggestions = await AIService.generateSuggestions(content, platform)
      setAiSuggestions(suggestions)
      
      // Enhance content with AI
      const enhanced = await AIService.enhanceContent(content)
      setImprovedContent(enhanced)
      
      toast.success('Content improved with AI!')
    } catch (error) {
      toast.error('Failed to improve content')
      console.error('AI improvement error:', error)
    } finally {
      setIsImproving(false)
    }
  }

  const onSubmit = async (data: PostFormData) => {
    setIsLoading(true)
    
    try {
      // Format content for each platform
      const formattedContent = improvedContent || data.content
      
      // Handle Reddit posting if selected
      if (selectedPlatforms.includes('reddit') && selectedSubreddit) {
        const accessToken = localStorage.getItem('reddit_access_token')
        if (!accessToken) {
          toast.error('Please connect your Reddit account first')
          return
        }
        
        try {
          // Post to Reddit
          const redditContent = formatContentForPlatform(formattedContent, 'reddit')
          const subreddit = selectedSubreddit.replace('r/', '')
          
          // Use separate title and text for Reddit
          const title = redditTitle.trim() || redditContent.substring(0, 300) // Use custom title or fallback
          const text = redditContent
          
          console.log('🔄 Posting to Reddit:', { subreddit, title: title.substring(0, 50) + '...', text: text.substring(0, 100) + '...' })
          
          // Actually post to Reddit via server-side API
          const response = await fetch('/api/posts/reddit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subreddit: subreddit.replace('r/', '').replace('/', ''), // Remove r/ and / prefixes
              title: title,
              text: text,
              accessToken
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to post to Reddit')
          }

          const result = await response.json()
          console.log('✅ Reddit post successful:', result)
          
          toast.success(`Posted to r/${subreddit} successfully!`)
          
        } catch (error) {
          console.error('Reddit posting error:', error)
          toast.error(`Failed to post to Reddit: ${error instanceof Error ? error.message : 'Unknown error'}`)
          return
        }
      }
      
      // Determine post status
      let postStatus: 'draft' | 'scheduled' | 'published' = 'draft'
      
      if (data.scheduledDate && data.scheduledTime) {
        postStatus = 'scheduled'
      } else if (selectedPlatforms.length > 0) {
        // If platforms are selected and no scheduling, publish immediately
        postStatus = 'published'
      }
      
      // Create post object with platform-specific formatting
      const post: Post = {
        id: generateId(),
        content: formattedContent,
        platforms: selectedPlatforms,
        status: postStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        hashtags: await AIService.generateHashtags(formattedContent, 5),
        // Add Reddit-specific data
        ...(selectedPlatforms.includes('reddit') && selectedSubreddit && {
          redditSubreddit: selectedSubreddit.replace('r/', '')
        })
      }

      // Set scheduled time if provided
      if (data.scheduledDate && data.scheduledTime) {
        const scheduledDateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`)
        post.scheduledFor = scheduledDateTime
      }

      // Save post to storage
      savePost(post)
      
      if (post.status === 'scheduled') {
        NotificationService.notifyPostScheduled(post)
        toast.success('Post scheduled successfully!')
      } else if (post.status === 'published') {
        toast.success('Post published successfully!')
      } else {
        toast.success('Post saved as draft!')
      }
      
      // Reset form
      setValue('content', '')
      setValue('title', '')
      setValue('platforms', [])
      setValue('scheduledDate', '')
      setValue('scheduledTime', '')
      setSelectedPlatforms([])
      setSelectedSubreddit('')
      setRedditTitle('')
      setImprovedContent('')
      setAiSuggestions([])
    } catch (error) {
      toast.error('Failed to save post')
      console.error('Save post error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compose</h1>
        <p className="text-gray-600">Create and schedule your content with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Editor */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Platform Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformToggle(platform.id)}
                className={`flex items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <PlatformIcon platform={platform.id} size="sm" className="mr-2" />
                <span className="font-medium text-gray-900 text-sm">{platform.name}</span>
                {selectedPlatforms.includes(platform.id) && (
                  <CheckIcon className="w-5 h-5 text-primary-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
          {errors.platforms && (
            <p className="text-red-600 text-sm mt-2">{errors.platforms.message}</p>
          )}
        </div>

        {/* Reddit Subreddit Selection */}
        {selectedPlatforms.includes('reddit') && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Subreddit</h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {subredditSuggestions.map((subreddit) => (
                  <button
                    key={subreddit}
                    type="button"
                    onClick={() => setSelectedSubreddit(subreddit)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selectedSubreddit === subreddit
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    r/{subreddit}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Or enter custom subreddit (e.g., r/startups)"
                  value={selectedSubreddit}
                  onChange={(e) => setSelectedSubreddit(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {selectedSubreddit && (
                  <button
                    type="button"
                    onClick={() => setSelectedSubreddit('')}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              {selectedSubreddit && (
                <p className="text-sm text-gray-600">
                  📍 Will post to: <span className="font-medium text-red-600">r/{selectedSubreddit.replace('r/', '')}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reddit Title Field */}
        {selectedPlatforms.includes('reddit') && (
          <div className="card">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Reddit Title</h2>
              <p className="text-sm text-gray-600 mb-3">Create a compelling title for your Reddit post (max 300 characters)</p>
              <input
                type="text"
                placeholder="Enter your Reddit post title..."
                value={redditTitle}
                onChange={(e) => setRedditTitle(e.target.value)}
                maxLength={300}
                className="input-field w-full"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {redditTitle.length}/300 characters
                </div>
                {redditTitle.length > 250 && (
                  <div className="text-sm text-orange-600">
                    ⚠️ Title getting long
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Editor */}
        <div className="card">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {selectedPlatforms.includes('reddit') ? 'Post Content' : 'Content'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <TemplateSelector 
                onTemplateSelect={handleTemplateSelect}
                selectedPlatforms={selectedPlatforms}
              />
              <button
                type="button"
                onClick={improveContent}
                disabled={isImproving || !content.trim()}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 bg-primary-50 rounded-lg"
              >
                <SparklesIcon className="w-4 h-4 mr-1" />
                {isImproving ? 'Improving...' : 'Improve with AI'}
              </button>
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-50 rounded-lg"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                Suggestions
              </button>
              <button
                type="button"
                onClick={handleCollaboration}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-50 rounded-lg"
              >
                <UserGroupIcon className="w-4 h-4 mr-1" />
                Collaborate
              </button>
            </div>
          </div>

          <textarea
            {...register('content')}
            rows={6}
            placeholder={selectedPlatforms.includes('reddit') 
              ? "Write your Reddit post content here... (This will be the body text of your post)"
              : "What's on your mind? Write your post content here..."
            }
            className="input-field resize-none"
            value={improvedContent || content}
            onChange={(e) => {
              setValue('content', e.target.value)
              if (improvedContent) setImprovedContent('')
            }}
          />

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="flex items-center text-sm text-gray-600 hover:text-gray-700"
              >
                <PhotoIcon className="w-4 h-4 mr-1" />
                Add Media
              </button>
              <button
                type="button"
                className="flex items-center text-sm text-gray-600 hover:text-gray-700"
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                Add Link
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {/* Platform-specific character limits */}
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {selectedPlatforms.includes('linkedin') && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">LinkedIn: 3,000</span>
                )}
                {selectedPlatforms.includes('reddit') && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">Reddit: 40,000</span>
                )}
                {selectedPlatforms.includes('threads') && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Threads: 500</span>
                )}
              </div>
              <div className={`text-sm ${
                characterCount > maxCharacters * 0.9 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {characterCount}/{maxCharacters}
              </div>
            </div>
          </div>

          {errors.content && (
            <p className="text-red-600 text-sm mt-2">{errors.content.message}</p>
          )}

          {/* Platform-specific suggestions */}
          {selectedPlatforms.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Platform Tips:</h4>
              <ul className="space-y-1">
                {getPlatformSuggestions().map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">AI Suggestions</h3>
              <ul className="space-y-1">
                {aiSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {suggestion.suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Scheduling */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                {...register('scheduledDate')}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                {...register('scheduledTime')}
                className="input-field"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Leave empty to publish immediately
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn-secondary"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="btn-primary"
          >
            {isSubmitting || isLoading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="space-y-4">
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find(p => p.id === platformId)
                if (!platform) return null
                
                return (
                  <div key={platformId} className="post-preview">
                    <div className="flex items-center mb-3">
                      <span className={`text-lg ${platform.color} mr-2`}>{platform.icon}</span>
                      <span className="font-medium text-gray-900">{platform.name}</span>
                    </div>
                    <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {formatContentForPlatform(improvedContent || content || "Your post content will appear here...", platformId)}
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      {characterCount}/{maxCharacters} characters
                    </div>
                  </div>
                )
              })}
              {selectedPlatforms.length === 0 && (
                <div className="post-preview">
                  <div className="text-center text-gray-500 py-8">
                    <p>Select platforms to see preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          {showSuggestions && aiSuggestions.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{suggestion.suggestion}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          suggestion.type === 'hashtag' ? 'bg-purple-100 text-purple-700' :
                          suggestion.type === 'content' ? 'bg-blue-100 text-blue-700' :
                          suggestion.type === 'timing' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {suggestion.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collaboration Panel */}
      <CollaborationPanel
        postId={currentPostId}
        currentUserId="current-user"
        currentUserName="You"
        isOpen={showCollaboration}
        onClose={() => setShowCollaboration(false)}
      />
    </div>
  )
}
