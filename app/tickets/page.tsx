'use client'

import React, { useState } from 'react'
import { Search, Filter, Plus, Ticket, Clock, User, AlertCircle, CheckCircle, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { useAuth, useRoleAccess, ProtectedRoute } from '@/hooks/useAuth'
import { useTickets } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import TicketCard from '@/components/tickets/ticket-card'

const TicketsPage = () => {
  const { user } = useAuth()
  const { isCustomer, isAgent, isAdmin } = useRoleAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortField, setSortField] = useState('updated_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Build filter object based on user role and selected filters
  const buildFilters = () => {
    const filters: any = {}
    
    // Status filter
    if (statusFilter !== 'all') {
      filters.status = [statusFilter]
    }
    
    // Priority filter
    if (priorityFilter !== 'all') {
      filters.priority = [priorityFilter]
    }
    
    // Search term
    if (searchTerm) {
      filters.search = searchTerm
    }
    
    return filters
  }

  const { tickets, loading, totalCount, error } = useTickets(
    buildFilters(),
    { field: sortField, direction: sortDirection }
  )

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const sortOptions = [
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'created_at', label: 'Created Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Ticket className="h-4 w-4" />
    }
  }

  const getStatusCount = (status: string) => {
    return tickets.filter(ticket => ticket.status === status).length
  }

  if (loading) {
    return <Loading fullPage text="Loading tickets..." />
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {isCustomer() ? 'My Tickets' : 'All Tickets'}
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              {isCustomer() 
                ? 'View and manage your support requests' 
                : 'Manage all customer support tickets'}
            </p>
          </div>
          {isCustomer() && (
            <div className="mt-4 sm:mt-0">
              <Button asChild>
                <Link href="/create-ticket">
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
            <Card key={status} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    status === 'open' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                    status === 'in_progress' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' :
                    'bg-green-100 text-green-600 dark:bg-green-900/20'
                  }`}>
                    {getStatusIcon(status)}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      {getStatusCount(status)}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 capitalize">
                      {status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusOptions}
                placeholder="Filter by status"
              />
              
              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
                options={priorityOptions}
                placeholder="Filter by priority"
              />
              
              <div className="flex space-x-2">
                <Select
                  value={sortField}
                  onValueChange={setSortField}
                  options={sortOptions}
                  placeholder="Sort by"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-3"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Debug Info</h4>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                User: {user?.email} | Role: {user?.role} | Loading: {loading ? 'Yes' : 'No'} | 
                Tickets: {tickets.length} | Error: {error || 'None'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {error ? (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Error Loading Tickets
                </h3>
                <p className="text-red-600 dark:text-red-300">
                  {error.message || 'Failed to load tickets. Please try again.'}
                </p>
              </CardContent>
            </Card>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Ticket className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  No tickets found
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                    ? "No tickets match your current filters."
                    : isCustomer() 
                      ? "You haven't created any support tickets yet." 
                      : "No tickets have been created yet."}
                </p>
                {isCustomer() && !searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                  <Button asChild>
                    <Link href="/create-ticket">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Ticket
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Showing {tickets.length} of {totalCount} tickets
                </p>
              </div>
              
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket}
                    showCustomer={!isCustomer()}
                    showAgent={true}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default TicketsPage
