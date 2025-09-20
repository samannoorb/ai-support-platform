'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Filter, Plus, Edit, Trash2, User, Mail, Calendar, Shield, MoreVertical, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'

interface UserData {
  id: string
  full_name: string
  email: string
  role: 'customer' | 'agent' | 'admin'
  created_at: string
  last_login?: string
  status: 'active' | 'inactive' | 'suspended'
  ticket_count?: number
}

const UsersPage = () => {
  const { user } = useAuth()
  const { error: showError, success: showSuccess } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<UserData[]>([])

  // Fetch real users from Supabase
  const fetchUsers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          role,
          created_at,
          is_online,
          last_seen
        `)

      const { data, error } = await query

      if (error) throw error

      // Get ticket counts for each user
      const usersWithTicketCounts = await Promise.all(
        (data || []).map(async (userData) => {
          let ticketCount = 0
          
          if (userData.role === 'customer') {
            const { count } = await supabase
              .from('tickets')
              .select('*', { count: 'exact', head: true })
              .eq('customer_id', userData.id)
            ticketCount = count || 0
          } else if (userData.role === 'agent') {
            const { count } = await supabase
              .from('tickets')
              .select('*', { count: 'exact', head: true })
              .eq('agent_id', userData.id)
            ticketCount = count || 0
          }

          return {
            id: userData.id,
            full_name: userData.full_name || 'Unknown User',
            email: userData.email,
            role: userData.role as 'customer' | 'agent' | 'admin',
            created_at: userData.created_at,
            last_login: userData.last_seen,
            status: userData.is_online ? 'active' : 'inactive' as 'active' | 'inactive' | 'suspended',
            ticket_count: ticketCount
          }
        })
      )

      setUsers(usersWithTicketCounts)
    } catch (error: any) {
      console.error('Error fetching users:', error)
      showError('Error', 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers()
    }
  }, [user])

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'customer', label: 'Customers' },
    { value: 'agent', label: 'Agents' },
    { value: 'admin', label: 'Admins' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'agent':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300'
      case 'customer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300'
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setLoading(true)
    try {
      // Here you would make an API call to update the user status
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus as any } : user
      ))
      showSuccess('Status updated', 'User status has been updated successfully.')
    } catch (error) {
      showError('Error', 'Failed to update user status.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      // Here you would make an API call to delete the user
      setUsers(prev => prev.filter(user => user.id !== userId))
      showSuccess('User deleted', 'User has been deleted successfully.')
    } catch (error) {
      showError('Error', 'Failed to delete user.')
    } finally {
      setLoading(false)
    }
  }

  const userCounts = {
    total: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    agents: users.filter(u => u.role === 'agent').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              User Management
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {userCounts.total}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Total Users
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
                    {userCounts.customers}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Customers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/20">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {userCounts.agents}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Agents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {userCounts.admins}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Admins
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
                    {userCounts.active}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Active
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
                options={roleOptions}
                placeholder="Filter by role"
              />
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusOptions}
                placeholder="Filter by status"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loading text="Updating user..." />
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  No users found
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  No users match your current filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-secondary-200 dark:border-secondary-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">User</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Tickets</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((userData) => (
                      <tr key={userData.id} className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {userData.full_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900 dark:text-secondary-100">
                                {userData.full_name}
                              </p>
                              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                {userData.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getRoleBadgeColor(userData.role)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusBadgeColor(userData.status)}>
                            {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            {userData.last_login ? 
                              new Date(userData.last_login).toLocaleDateString() : 
                              'Never'
                            }
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-secondary-900 dark:text-secondary-100">
                            {userData.ticket_count || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Select
                              value={userData.status}
                              onValueChange={(value) => handleStatusChange(userData.id, value)}
                              options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'suspended', label: 'Suspended' }
                              ]}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(userData.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

export default UsersPage
