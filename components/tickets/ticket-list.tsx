'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List,
  Plus,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { TicketWithRelations, TicketFilters, TicketSort } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loading, SkeletonCard } from '@/components/ui/loading'
import TicketCard from './ticket-card'
import { useRoleAccess } from '@/hooks/useAuth'

interface TicketListProps {
  tickets: TicketWithRelations[]
  loading?: boolean
  error?: string | null
  totalCount?: number
  onFiltersChange?: (filters: TicketFilters) => void
  onSortChange?: (sort: TicketSort) => void
  onRefresh?: () => void
  onCreateTicket?: () => void
  showCreateButton?: boolean
  showCustomer?: boolean
  showAgent?: boolean
  emptyMessage?: string
  emptyDescription?: string
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  loading = false,
  error = null,
  totalCount = 0,
  onFiltersChange,
  onSortChange,
  onRefresh,
  onCreateTicket,
  showCreateButton = false,
  showCustomer = true,
  showAgent = true,
  emptyMessage = 'No tickets found',
  emptyDescription = 'There are no tickets matching your current filters.',
}) => {
  const { isCustomer } = useRoleAccess()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [sortField, setSortField] = useState<TicketSort['field']>('created_at')
  const [sortDirection, setSortDirection] = useState<TicketSort['direction']>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting_for_customer', label: 'Waiting for Customer' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ]

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'technical', label: 'Technical' },
    { value: 'billing', label: 'Billing' },
    { value: 'general', label: 'General' },
    { value: 'account', label: 'Account' },
    { value: 'product', label: 'Product' },
  ]

  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
    { value: 'title', label: 'Title' },
  ]

  const handleFiltersChange = React.useCallback(() => {
    if (!onFiltersChange) return

    const filters: TicketFilters = {}
    
    if (searchQuery) filters.search = searchQuery
    if (statusFilter) filters.status = [statusFilter as any]
    if (priorityFilter) filters.priority = [priorityFilter as any]
    if (categoryFilter) filters.category = [categoryFilter]

    onFiltersChange(filters)
  }, [onFiltersChange, searchQuery, statusFilter, priorityFilter, categoryFilter])

  const handleSortChange = React.useCallback(() => {
    if (!onSortChange) return
    
    onSortChange({
      field: sortField,
      direction: sortDirection,
    })
  }, [onSortChange, sortField, sortDirection])

  React.useEffect(() => {
    handleFiltersChange()
  }, [handleFiltersChange])

  React.useEffect(() => {
    handleSortChange()
  }, [handleSortChange])

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setPriorityFilter('')
    setCategoryFilter('')
  }

  const activeFiltersCount = [
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ].filter(Boolean).length

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Error loading tickets
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
          {error}
        </p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tickets
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `${totalCount} ticket${totalCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          
          {showCreateButton && onCreateTicket && (
            <Button onClick={onCreateTicket}>
              <Plus className="h-4 w-4 mr-2" />
              {isCustomer() ? 'New Ticket' : 'Create Ticket'}
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets by title, description, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Status"
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusOptions}
              />
              <Select
                label="Priority"
                value={priorityFilter}
                onValueChange={setPriorityFilter}
                options={priorityOptions}
              />
              <Select
                label="Category"
                value={categoryFilter}
                onValueChange={setCategoryFilter}
                options={categoryOptions}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by
                </label>
                <div className="flex space-x-2">
                  <Select
                    value={sortField}
                    onValueChange={(value) => setSortField(value as TicketSort['field'])}
                    options={sortOptions}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="h-10 w-10"
                  >
                    {sortDirection === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
            {emptyDescription}
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
          {showCreateButton && onCreateTicket && activeFiltersCount === 0 && (
            <Button onClick={onCreateTicket}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Ticket
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              showCustomer={showCustomer}
              showAgent={showAgent}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TicketList
