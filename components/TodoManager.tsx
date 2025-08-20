'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Todo, TodoService, todoCategories } from '@/lib/todos'
import toast from 'react-hot-toast'

export default function TodoManager() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [stats, setStats] = useState(TodoService.getTodoStats())
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all')
  const [activePriority, setActivePriority] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    category: 'feature' as Todo['category'],
    priority: 'medium' as Todo['priority'],
    status: 'todo' as Todo['status'],
    estimatedHours: 0,
    tags: [] as string[],
    notes: ''
  })

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    filterTodos()
  }, [todos, activeFilter, activePriority])

  const loadTodos = () => {
    const allTodos = TodoService.getTodos()
    setTodos(allTodos)
    setStats(TodoService.getTodoStats())
  }

  const filterTodos = () => {
    let filtered = todos

    if (activeFilter !== 'all') {
      filtered = filtered.filter(todo => todo.status === activeFilter)
    }

    if (activePriority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === activePriority)
    }

    setFilteredTodos(filtered)
  }

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    try {
      TodoService.addTodo(newTodo)
      setNewTodo({
        title: '',
        description: '',
        category: 'feature',
        priority: 'medium',
        status: 'todo',
        estimatedHours: 0,
        tags: [],
        notes: ''
      })
      setShowAddForm(false)
      loadTodos()
      toast.success('Todo added successfully!')
    } catch (error) {
      toast.error('Failed to add todo')
    }
  }

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    try {
      TodoService.updateTodo(id, updates)
      loadTodos()
      toast.success('Todo updated successfully!')
    } catch (error) {
      toast.error('Failed to update todo')
    }
  }

  const handleDeleteTodo = (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        TodoService.deleteTodo(id)
        loadTodos()
        toast.success('Todo deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete todo')
      }
    }
  }

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: Todo['status']) => {
    switch (status) {
      case 'done': return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'in-progress': return <ClockIcon className="w-5 h-5 text-blue-500" />
      case 'review': return <EyeIcon className="w-5 h-5 text-purple-500" />
      default: return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">To-Do Manager</h1>
        <p className="text-gray-600">Track and manage Post Genius features and improvements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
          <div className="text-sm text-gray-500">To Do</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-500">{stats.review}</div>
          <div className="text-sm text-gray-500">Review</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.done}</div>
          <div className="text-sm text-gray-500">Done</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-500">Overdue</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          
          <select
            value={activePriority}
            onChange={(e) => setActivePriority(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Todo</span>
        </button>
      </div>

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                className="input-field"
                placeholder="Enter todo title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newTodo.category}
                onChange={(e) => setNewTodo({...newTodo, category: e.target.value as Todo['category']})}
                className="input-field"
              >
                <option value="feature">Feature</option>
                <option value="improvement">Improvement</option>
                <option value="bug">Bug</option>
                <option value="research">Research</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({...newTodo, priority: e.target.value as Todo['priority']})}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
              <input
                type="number"
                value={newTodo.estimatedHours}
                onChange={(e) => setNewTodo({...newTodo, estimatedHours: parseInt(e.target.value) || 0})}
                className="input-field"
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                className="input-field"
                rows={3}
                placeholder="Enter todo description"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newTodo.notes}
                onChange={(e) => setNewTodo({...newTodo, notes: e.target.value})}
                className="input-field"
                rows={2}
                placeholder="Additional notes (optional)"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTodo}
              className="btn-primary"
            >
              Add Todo
            </button>
          </div>
        </div>
      )}

      {/* Todos List */}
      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(todo.status)}
                  <h3 className="text-lg font-medium text-gray-900">{todo.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                    {todo.priority}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {todo.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{todo.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {todo.estimatedHours > 0 && (
                    <span>Est: {todo.estimatedHours}h</span>
                  )}
                  {todo.actualHours && todo.actualHours > 0 && (
                    <span>Actual: {todo.actualHours}h</span>
                  )}
                  <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                  {todo.dueDate && (
                    <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                  )}
                </div>

                {todo.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{todo.notes}</p>
                  </div>
                )}

                {todo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {todo.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <select
                  value={todo.status}
                  onChange={(e) => handleUpdateTodo(todo.id, { status: e.target.value as Todo['status'] })}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
                
                <button
                  onClick={() => setEditingTodo(todo)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No todos found with the current filters</p>
            <p className="text-sm">Try adjusting your filters or add a new todo</p>
          </div>
        )}
      </div>
    </div>
  )
}
