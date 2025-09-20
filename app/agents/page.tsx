'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, User, Mail, Ticket, Star, Clock, TrendingUp, Shield, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'

interface AgentData {
  id: string
  full_name: string
  email: string
  created_at: string
  last_seen?: string
  is_online: boolean
  assigned_tickets: number
  resolved_tickets: number
  avg_response_time: number
  satisfaction_rating: number
  total_messages: number
}

const AgentsPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [agents, setAgents] = useState<AgentData[]>([])
  const [loading, setLoading] = useState(false)

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'tickets', label: 'Assigned Tickets' },
    { value: 'resolved', label: 'Resolved Tickets' },
    { value: 'satisfaction', label: 'Satisfaction Rating' },
    { value: 'response_time', label: 'Response Time' }
  ]

  // Fetch real agents data from Supabase
  const fetchAgents = async () => {
    setLoading(true)
    try {
      // Get all users with agent role
      const { data: agentUsers, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'agent')

      if (usersError) throw usersError

      // Get performance data for each agent
      const agentsWithPerformanceData = await Promise.all(
        (agentUsers || []).map(async (agent) => {
          // Get assigned tickets count
          const { count: assignedTickets } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', agent.id)

          // Get resolved tickets count
          const { count: resolvedTickets } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', agent.id)
            .eq('status', 'resolved')

          // Get messages count
          const { count: totalMessages } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', agent.id)

          // Calculate average response time (mock for now)
          const avgResponseTime = Math.random() * 4 + 1 // 1-5 hours

          // Mock satisfaction rating
          const satisfactionRating = 4.0 + Math.random() * 1 // 4.0-5.0

          return {
            id: agent.id,
            full_name: agent.full_name || 'Unknown Agent',
            email: agent.email,
            created_at: agent.created_at,
            last_seen: agent.last_seen,
            is_online: agent.is_online || false,
            assigned_tickets: assignedTickets || 0,
            resolved_tickets: resolvedTickets || 0,
            avg_response_time: avgResponseTime,
            satisfaction_rating: satisfactionRating,
            total_messages: totalMessages || 0
          }
        })
      )

      setAgents(agentsWithPerformanceData)
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAgents()
    }
  }, [user])

  const filteredAgents = agents.filter(agent =>
    agent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.full_name.localeCompare(b.full_name)
      case 'tickets':
        return b.assigned_tickets - a.assigned_tickets
      case 'resolved':
        return b.resolved_tickets - a.resolved_tickets
      case 'satisfaction':
        return b.satisfaction_rating - a.satisfaction_rating
      case 'response_time':
        return a.avg_response_time - b.avg_response_time
      default:
        return 0
    }
  })

  const getPerformanceColor = (rating: number, type: 'satisfaction' | 'response_time') => {
    if (type === 'satisfaction') {
      if (rating >= 4.5) return 'text-green-600'
      if (rating >= 4.0) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (rating <= 2) return 'text-green-600'
      if (rating <= 4) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  const agentStats = {
    total: agents.length,
    online: agents.filter(a => a.is_online).length,
    avgSatisfaction: agents.length > 0 ? agents.reduce((sum, a) => sum + a.satisfaction_rating, 0) / agents.length : 0,
    avgResponseTime: agents.length > 0 ? agents.reduce((sum, a) => sum + a.avg_response_time, 0) / agents.length : 0,
    totalTickets: agents.reduce((sum, a) => sum + a.assigned_tickets, 0),
    totalResolved: agents.reduce((sum, a) => sum + a.resolved_tickets, 0)
  }

  if (loading) {
    return <Loading fullPage text="Loading agents..." />
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Agent Management
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Monitor agent performance and workload
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
                    {agentStats.total}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Total Agents
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
                    {agentStats.online}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Online Now
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
                    {agentStats.totalTickets}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Assigned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {agentStats.totalResolved}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Resolved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {agentStats.avgResponseTime.toFixed(1)}h
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Avg Response
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
                    {agentStats.avgSatisfaction.toFixed(1)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                options={sortOptions}
                placeholder="Sort by"
              />
            </div>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAgents.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                No agents found
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                No agents match your current search.
              </p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <Card key={agent.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-primary-600">
                            {agent.full_name.charAt(0)}
                          </span>
                        </div>
                        {agent.is_online && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-secondary-900"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                          {agent.full_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                            <Shield className="h-3 w-3 mr-1" />
                            Agent
                          </Badge>
                          <Badge className={agent.is_online ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300'}>
                            {agent.is_online ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-secondary-400" />
                      <span className="text-secondary-600 dark:text-secondary-400">{agent.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                          {agent.assigned_tickets}
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">Assigned</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {agent.resolved_tickets}
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">Resolved</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className={`font-semibold ${getPerformanceColor(agent.satisfaction_rating, 'satisfaction')}`}>
                            {agent.satisfaction_rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">Rating</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="h-4 w-4 text-secondary-400" />
                          <span className={`font-semibold ${getPerformanceColor(agent.avg_response_time, 'response_time')}`}>
                            {agent.avg_response_time.toFixed(1)}h
                          </span>
                        </div>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">Response</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Performance
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

export default AgentsPage
