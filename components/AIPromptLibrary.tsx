'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon,
  TagIcon,
  ChevronRightIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { AIPromptService, AIPrompt, PromptCategory } from '@/lib/aiPrompts'
import toast from 'react-hot-toast'

interface AIPromptLibraryProps {
  onPromptSelect: (prompt: AIPrompt) => void
  selectedPlatforms?: string[]
}

export default function AIPromptLibrary({ onPromptSelect, selectedPlatforms = [] }: AIPromptLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [filteredPrompts, setFilteredPrompts] = useState<AIPrompt[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const categories = AIPromptService.getCategories()
  const allPrompts = AIPromptService.getPromptsByCategory('business').concat(
    AIPromptService.getPromptsByCategory('personal'),
    AIPromptService.getPromptsByCategory('educational'),
    AIPromptService.getPromptsByCategory('engagement'),
    AIPromptService.getPromptsByCategory('storytelling'),
    AIPromptService.getPromptsByCategory('thought-leadership'),
    AIPromptService.getPromptsByCategory('behind-scenes'),
    AIPromptService.getPromptsByCategory('achievements'),
    AIPromptService.getPromptsByCategory('tips-advice'),
    AIPromptService.getPromptsByCategory('trending'),
    AIPromptService.getPromptsByCategory('questions'),
    AIPromptService.getPromptsByCategory('inspiration')
  )

  useEffect(() => {
    let filtered = allPrompts

    // Filter by search query
    if (searchQuery) {
      filtered = AIPromptService.searchPrompts(searchQuery)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(prompt => prompt.difficulty === selectedDifficulty)
    }

    // Filter by selected platforms
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(prompt => 
        prompt.platforms.some(platform => selectedPlatforms.includes(platform))
      )
    }

    setFilteredPrompts(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedPlatforms, allPrompts])

  const handlePromptSelect = (prompt: AIPrompt) => {
    onPromptSelect(prompt)
    toast.success(`"${prompt.title}" selected!`)
  }

  const handleRandomPrompt = () => {
    const randomPrompt = AIPromptService.getRandomPrompt()
    onPromptSelect(randomPrompt)
    toast.success(`Random prompt: "${randomPrompt.title}"`)
  }

  const toggleFavorite = (promptId: string) => {
    setFavorites(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: PromptCategory) => {
    const icons = {
      business: '💼',
      personal: '👤',
      educational: '📚',
      engagement: '💬',
      storytelling: '📖',
      'thought-leadership': '🧠',
      'behind-scenes': '🎬',
      achievements: '🏆',
      'tips-advice': '💡',
      trending: '📈',
      questions: '❓',
      inspiration: '✨'
    }
    return icons[category] || '📝'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Prompt Library</h1>
        <p className="text-gray-600">Never run out of inspiration with curated prompts and AI-powered ideas</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleRandomPrompt}
            className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Pick Random
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Prompts
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">Difficulty:</span>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map(prompt => (
          <div
            key={prompt.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => handlePromptSelect(prompt)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(prompt.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(prompt.difficulty)}`}>
                  {prompt.difficulty}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(prompt.id)
                }}
                className={`p-1 rounded-full transition-colors ${
                  favorites.includes(prompt.id)
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <BookmarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Title and Description */}
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {prompt.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {prompt.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{prompt.estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Platforms:</span>
                <div className="flex gap-1">
                  {prompt.platforms.map(platform => (
                    <span key={platform} className="text-xs">
                      {platform === 'linkedin' ? '💼' : platform === 'threads' ? '🧵' : platform === 'reddit' ? '🤖' : '📱'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hover Action */}
            <div className="absolute inset-0 bg-blue-50 bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 text-blue-600 font-medium">
                <span>Use this prompt</span>
                <ChevronRightIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedDifficulty('all')
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
