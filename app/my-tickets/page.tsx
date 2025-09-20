'use client'

import React, { useState } from 'react'
import { Search, Filter, User, Clock, CheckCircle, AlertCircle, Users, ArrowUpDown, Eye } from 'lucide-react'
import Link from 'next/link'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useTickets } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import TicketCard from '@/components/tickets/ticket-card'

const MyTicketsPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortField, setSortField] = useState('updated_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Build filter object for agent's assigned tickets
  const buildFilters = () => {
    const filters: any = {
      agent_id: user?.id // Only show tickets assigned to current agent
    }
    
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
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
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
        return <User className="h-4 w-4" />
    }
  }

  const getStatusCount = (status: string) => {
    return tickets.filter(ticket => ticket.status === status).length
  }

  // Calculate performance metrics
  const avgResponseTime = '2.5 hours' // This would be calculated from real data
  const resolutionRate = tickets.length > 0 ? 
    Math.round((tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length / tickets.length) * 100) : 0
  const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length

  if (loading) {
    return <Loading fullPage text="Loading your assigned tickets..." />
  }

  return (
    <ProtectedRoute allowedRoles={['agent', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              My Assigned Tickets
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Manage tickets assigned to you
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild variant="outline">
              <Link href="/tickets">
                <Users className="h-4 w-4 mr-2" />
                View All Tickets
              </Link>
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {tickets.length}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Total Assigned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {activeTickets}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {resolutionRate}%
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Resolution Rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {avgResponseTime}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Avg Response
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
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
                  placeholder="Search your tickets..."
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
                  {error.message || 'Failed to load your assigned tickets. Please try again.'}
                </p>
              </CardContent>
            </Card>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  No assigned tickets
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                    ? "No tickets match your current filters."
                    : "You don't have any tickets assigned to you yet."}
                </p>
                <Button asChild variant="outline">
                  <Link href="/tickets">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse All Tickets
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Showing {tickets.length} of {totalCount} assigned tickets
                </p>
              </div>
              
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket}
                    showCustomer={true}
                    showAgent={false}
                    isAgentView={true}
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

export default MyTicketsPage
