'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import { Post, Platform } from '@/lib/types'
import { getPosts, savePost, getPlatforms, generateId } from '@/lib/storage'
import { AIService } from '@/lib/ai'
import { NotificationService } from '@/lib/notifications'
import { format, addDays, addWeeks, addMonths } from 'date-fns'
import toast from 'react-hot-toast'

interface BulkPost {
  id: string
  content: string
  platforms: string[]
  scheduledFor?: Date
  status: 'draft' | 'scheduled'
  hashtags?: string[]
  isSelected: boolean
}

export default function BulkOperations() {
  const [bulkPosts, setBulkPosts] = useState<BulkPost[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [baseContent, setBaseContent] = useState('')
  const [schedulingStrategy, setSchedulingStrategy] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [postCount, setPostCount] = useState(5)
  const [showPreview, setShowPreview] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadPlatforms()
  }, [])

  const loadPlatforms = () => {
    const platformData = getPlatforms()
    setPlatforms(platformData)
  }

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const generateBulkPosts = async () => {
    if (!baseContent.trim()) {
      toast.error('Please enter base content')
      return
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    if (!startDate) {
      toast.error('Please select a start date')
      return
    }

    setIsProcessing(true)

    try {
      const posts: BulkPost[] = []
      const startDateTime = new Date(`${startDate}T${startTime}`)

      for (let i = 0; i < postCount; i++) {
        // Generate varied content using AI
        const variedContent = await AIService.enhanceContent(baseContent)
        
        // Calculate scheduled date based on strategy
        let scheduledDate: Date
        switch (schedulingStrategy) {
          case 'daily':
            scheduledDate = addDays(startDateTime, i)
            break
          case 'weekly':
            scheduledDate = addWeeks(startDateTime, i)
            break
          case 'monthly':
            scheduledDate = addMonths(startDateTime, i)
            break
          default:
            scheduledDate = addDays(startDateTime, i)
        }

        // Generate hashtags
        const hashtags = await AIService.generateHashtags(variedContent, 3)

        posts.push({
          id: generateId(),
          content: variedContent,
          platforms: selectedPlatforms,
          scheduledFor: scheduledDate,
          status: 'draft',
          hashtags,
          isSelected: true
        })
      }

      setBulkPosts(posts)
      toast.success(`Generated ${postCount} posts successfully!`)
    } catch (error) {
      toast.error('Failed to generate posts')
      console.error('Bulk generation error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectAll = () => {
    setBulkPosts(prev => prev.map(post => ({ ...post, isSelected: true })))
  }

  const handleDeselectAll = () => {
    setBulkPosts(prev => prev.map(post => ({ ...post, isSelected: false })))
  }

  const handleToggleSelection = (postId: string) => {
    setBulkPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isSelected: !post.isSelected } : post
    ))
  }

  const handleBulkSchedule = () => {
    const selectedPosts = bulkPosts.filter(post => post.isSelected)
    
    if (selectedPosts.length === 0) {
      toast.error('Please select posts to schedule')
      return
    }

    try {
      selectedPosts.forEach(bulkPost => {
        const post: Post = {
          id: bulkPost.id,
          content: bulkPost.content,
          platforms: bulkPost.platforms,
          scheduledFor: bulkPost.scheduledFor,
          status: bulkPost.status,
          hashtags: bulkPost.hashtags,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        savePost(post)
      })

      toast.success(`Scheduled ${selectedPosts.length} posts successfully!`)
      
      // Remove scheduled posts from bulk list
      setBulkPosts(prev => prev.filter(post => !post.isSelected))
    } catch (error) {
      toast.error('Failed to schedule posts')
    }
  }

  const handleBulkDelete = () => {
    const selectedPosts = bulkPosts.filter(post => post.isSelected)
    
    if (selectedPosts.length === 0) {
      toast.error('Please select posts to delete')
      return
    }

    if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
      setBulkPosts(prev => prev.filter(post => !post.isSelected))
      toast.success(`Deleted ${selectedPosts.length} posts`)
    }
  }

  const handleEditPost = (postId: string, field: keyof BulkPost, value: any) => {
    setBulkPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, [field]: value } : post
    ))
  }

  const selectedCount = bulkPosts.filter(post => post.isSelected).length

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Operations</h1>
        <p className="text-gray-600">Create and schedule multiple posts at once</p>
      </div>

      {/* Generation Form */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Bulk Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Content */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Content</label>
            <textarea
              value={baseContent}
              onChange={(e) => setBaseContent(e.target.value)}
              className="input-field"
              rows={4}
              placeholder="Enter the base content for your posts. AI will create variations for each post."
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
            <div className="grid grid-cols-2 gap-3">
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
                  <span className={`text-xl ${platform.color} mr-2`}>{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scheduling Strategy</label>
            <select
              value={schedulingStrategy}
              onChange={(e) => setSchedulingStrategy(e.target.value as any)}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Posts</label>
              <input
                type="number"
                value={postCount}
                onChange={(e) => setPostCount(parseInt(e.target.value) || 1)}
                min="1"
                max="50"
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={generateBulkPosts}
            disabled={isProcessing}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{isProcessing ? 'Generating...' : 'Generate Posts'}</span>
          </button>
        </div>
      </div>

      {/* Bulk Posts List */}
      {bulkPosts.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Generated Posts ({bulkPosts.length})
            </h2>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSelectAll}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Deselect All
              </button>
              <span className="text-sm text-gray-500">
                {selectedCount} selected
              </span>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={handleBulkSchedule}
              disabled={selectedCount === 0}
              className="btn-primary flex items-center space-x-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Schedule Selected ({selectedCount})</span>
            </button>
            
            <button
              onClick={handleBulkDelete}
              disabled={selectedCount === 0}
              className="btn-secondary flex items-center space-x-2"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete Selected</span>
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {bulkPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={post.isSelected}
                    onChange={() => handleToggleSelection(post.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {post.platforms.map(platformId => {
                          const platform = platforms.find(p => p.id === platformId)
                          return (
                            <span key={platformId} className={`text-sm px-2 py-1 rounded ${platform?.color} text-white`}>
                              {platform?.name || platformId}
                            </span>
                          )
                        })}
                        
                        {post.scheduledFor && (
                          <span className="text-sm text-gray-500">
                            {format(post.scheduledFor, 'MMM d, h:mm a')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditPost(post.id, 'content', prompt('Edit content:', post.content))}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPost(post.id, 'isSelected', !post.isSelected)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-900 mb-2">{post.content}</p>
                    
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.map((hashtag, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
