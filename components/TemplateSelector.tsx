'use client'

import { useState } from 'react'
import { 
  DocumentTextIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { ContentTemplate, TemplateService } from '@/lib/templates'

interface TemplateSelectorProps {
  onTemplateSelect: (content: string) => void
  selectedPlatforms: string[]
}

export default function TemplateSelector({ onTemplateSelect, selectedPlatforms }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})

  const categories = TemplateService.getTemplateCategories()
  const templates = selectedCategory 
    ? TemplateService.getTemplatesByCategory(selectedCategory)
    : TemplateService.getTemplatesByCategory()

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template)
    setVariables({})
  }

  const handleVariableChange = (variableName: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variableName]: value
    }))
  }

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      const filledContent = TemplateService.fillTemplate(selectedTemplate, variables)
      onTemplateSelect(filledContent)
      setIsOpen(false)
      setSelectedTemplate(null)
      setVariables({})
    }
  }

  const isTemplateValid = selectedTemplate && 
    selectedTemplate.variables.every(variable => 
      !variable.required || variables[variable.name]?.trim()
    )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <DocumentTextIcon className="w-4 h-4" />
        <span>Use Template</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Templates</h3>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Template List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.description}</div>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {template.category}
                    </span>
                    {template.platforms.map(platform => (
                      <span key={platform} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Template Variables */}
            {selectedTemplate && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Fill in the details:</h4>
                <div className="space-y-3">
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {variable.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {variable.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={variable.type === 'url' ? 'url' : 'text'}
                        placeholder={variable.placeholder}
                        value={variables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUseTemplate}
                  disabled={!isTemplateValid}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Use Template
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
