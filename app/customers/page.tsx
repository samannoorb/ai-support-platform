'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, User, Mail, Phone, Ticket, Calendar, Star, MessageSquare, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Customer {
  id: string
  full_name: string
  email: string
  phone?: string
  created_at: string
  last_login?: string
  total_tickets: number
  open_tickets: number
  satisfaction_rating?: number
  status: 'active' | 'inactive'
}

const CustomersPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch real customers data from Supabase
  const fetchCustomers = async () => {
    setLoading(true)
    try {
      // Get all users with customer role
      const { data: customerUsers, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer')

      if (usersError) throw usersError

      // Get ticket data for each customer
      const customersWithTicketData = await Promise.all(
        (customerUsers || []).map(async (customer) => {
          // Get total tickets count
          const { count: totalTickets } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true })
            .eq('customer_id', customer.id)

          // Get open tickets count
          const { count: openTickets } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true })
            .eq('customer_id', customer.id)
            .in('status', ['open', 'in_progress'])

          return {
            id: customer.id,
            full_name: customer.full_name || 'Unknown Customer',
            email: customer.email,
            phone: customer.phone,
            created_at: customer.created_at,
            last_login: customer.last_seen,
            total_tickets: totalTickets || 0,
            open_tickets: openTickets || 0,
            satisfaction_rating: 4.5, // This would come from satisfaction surveys
            status: customer.is_online ? 'active' : 'inactive' as 'active' | 'inactive'
          }
        })
      )

      setCustomers(customersWithTicketData)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCustomers()
    }
  }, [user])

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'tickets', label: 'Total Tickets' },
    { value: 'satisfaction', label: 'Satisfaction' },
    { value: 'created', label: 'Date Joined' }
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.full_name.localeCompare(b.full_name)
      case 'email':
        return a.email.localeCompare(b.email)
      case 'tickets':
        return b.total_tickets - a.total_tickets
      case 'satisfaction':
        return (b.satisfaction_rating || 0) - (a.satisfaction_rating || 0)
      case 'created':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300'
    }
  }

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-yellow-600'
    if (rating >= 3.0) return 'text-orange-600'
    return 'text-red-600'
  }

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    avgSatisfaction: customers.reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0) / customers.length,
    totalTickets: customers.reduce((sum, c) => sum + c.total_tickets, 0),
    openTickets: customers.reduce((sum, c) => sum + c.open_tickets, 0)
  }

  return (
    <ProtectedRoute allowedRoles={['agent', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Customer Directory
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Manage and view customer information
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {customerStats.total}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {customerStats.active}
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
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {customerStats.inactive}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Inactive
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {customerStats.totalTickets}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Total Tickets
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {customerStats.openTickets}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Open Tickets
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {customerStats.avgSatisfaction.toFixed(1)}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Avg Rating
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
                <Input
                  placeholder="Search customers..."
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
                value={sortBy}
                onValueChange={setSortBy}
                options={sortOptions}
                placeholder="Sort by"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                No customers found
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                No customers match your current filters.
              </p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <Card key={customer.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-primary-600">
                          {customer.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                          {customer.full_name}
                        </h3>
                        <Badge className={getStatusBadgeColor(customer.status)}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-secondary-400" />
                      <span className="text-secondary-600 dark:text-secondary-400">{customer.email}</span>
                    </div>
                    
                    {customer.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-secondary-400" />
                        <span className="text-secondary-600 dark:text-secondary-400">{customer.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-secondary-400" />
                      <span className="text-secondary-600 dark:text-secondary-400">
                        Joined {new Date(customer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                          {customer.total_tickets}
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">Total Tickets</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {customer.open_tickets}
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">Open</p>
                      </div>
                    </div>
                    
                    {customer.satisfaction_rating && (
                      <div className="mt-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className={`font-semibold ${getSatisfactionColor(customer.satisfaction_rating)}`}>
                            {customer.satisfaction_rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Ticket className="h-4 w-4 mr-2" />
                      Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default CustomersPage
