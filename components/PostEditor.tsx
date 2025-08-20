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
  CheckIcon
} from '@heroicons/react/24/outline'
import { Post, Platform, AISuggestion } from '@/lib/types'
import { savePost, getPlatforms, generateId } from '@/lib/storage'
import { AIService } from '@/lib/ai'
import toast from 'react-hot-toast'

const postSchema = z.object({
  content: z.string().min(1, 'Content is required').max(280, 'Content must be less than 280 characters'),
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
      platforms: [],
      scheduledDate: '',
      scheduledTime: '',
    },
  })

  const content = watch('content')
  const characterCount = content.length
  const maxCharacters = 280

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
      const suggestions = await AIService.improveContent(content, platform)
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
      // Create post object
      const post: Post = {
        id: generateId(),
        content: improvedContent || data.content,
        platforms: selectedPlatforms,
        status: data.scheduledDate && data.scheduledTime ? 'scheduled' : 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        hashtags: await AIService.generateHashtags(data.content, 5)
      }

      // Set scheduled time if provided
      if (data.scheduledDate && data.scheduledTime) {
        const scheduledDateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`)
        post.scheduledFor = scheduledDateTime
      }

      // Save post to storage
      savePost(post)
      
      if (post.status === 'scheduled') {
        toast.success(`Post scheduled for ${post.scheduledFor?.toLocaleString()}`)
      } else {
        toast.success('Post saved as draft!')
      }
      
      // Reset form
      setValue('content', '')
      setValue('platforms', [])
      setValue('scheduledDate', '')
      setValue('scheduledTime', '')
      setSelectedPlatforms([])
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
        <p className="text-gray-600">Create and schedule your content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Editor */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Platform Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformToggle(platform.id)}
                className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-xl ${platform.color} mr-2`}>{platform.icon}</span>
                <span className="font-medium text-gray-900">{platform.name}</span>
                {selectedPlatforms.includes(platform.id) && (
                  <CheckIcon className="w-5 h-5 text-primary-600 ml-2" />
                )}
              </button>
            ))}
          </div>
          {errors.platforms && (
            <p className="text-red-600 text-sm mt-2">{errors.platforms.message}</p>
          )}
        </div>

        {/* Content Editor */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Content</h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={improveContent}
                disabled={isImproving || !content.trim()}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
              >
                <SparklesIcon className="w-4 h-4 mr-1" />
                {isImproving ? 'Improving...' : 'Improve with AI'}
              </button>
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                Suggestions
              </button>
            </div>
          </div>

          <textarea
            {...register('content')}
            rows={6}
            placeholder="What's on your mind? Write your post content here..."
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
            <div className={`text-sm ${
              characterCount > maxCharacters * 0.9 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {characterCount}/{maxCharacters}
            </div>
          </div>

          {errors.content && (
            <p className="text-red-600 text-sm mt-2">{errors.content.message}</p>
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
                    <div className="text-gray-900 leading-relaxed">
                      {improvedContent || content || "Your post content will appear here..."}
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
    </div>
  )
}
