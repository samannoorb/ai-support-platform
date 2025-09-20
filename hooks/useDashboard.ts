'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardStats, AgentStats } from '@/types'
import { useAuth } from './useAuth'

interface UseDashboardResult {
  stats: DashboardStats | AgentStats | null
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

export const useDashboard = (): UseDashboardResult => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | AgentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let statsData: DashboardStats | AgentStats

      if (user.role === 'customer') {
        statsData = await fetchCustomerStats(user.id)
      } else if (user.role === 'agent') {
        statsData = await fetchAgentStats(user.id)
      } else if (user.role === 'admin') {
        statsData = await fetchAdminStats()
      } else {
        throw new Error('Invalid user role')
      }

      setStats(statsData)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchCustomerStats = async (customerId: string): Promise<DashboardStats> => {
    // Get ticket counts
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('status, priority, category, created_at')
      .eq('customer_id', customerId)

    if (ticketsError) throw ticketsError

    // Get recent activity
    const { data: recentMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        ticket_id,
        tickets!inner(title),
        sender:users!messages_sender_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (messagesError) throw messagesError

    const totalTickets = tickets?.length || 0
    const openTickets = tickets?.filter(t => t.status === 'open').length || 0
    const inProgressTickets = tickets?.filter(t => t.status === 'in_progress').length || 0
    const resolvedTickets = tickets?.filter(t => t.status === 'resolved').length || 0

    // Calculate average response time (mock data for now)
    const averageResponseTime = 4.5 // hours

    // Customer satisfaction (mock data for now)
    const customerSatisfaction = 4.2

    // Priority breakdown
    const ticketsByPriority = {
      urgent: tickets?.filter(t => t.priority === 'urgent').length || 0,
      high: tickets?.filter(t => t.priority === 'high').length || 0,
      medium: tickets?.filter(t => t.priority === 'medium').length || 0,
      low: tickets?.filter(t => t.priority === 'low').length || 0,
    }

    // Category breakdown
    const categoryMap = new Map<string, number>()
    tickets?.forEach(ticket => {
      categoryMap.set(ticket.category, (categoryMap.get(ticket.category) || 0) + 1)
    })
    const ticketsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }))

    // Recent activity
    const recentActivity = recentMessages?.map(msg => ({
      id: msg.id,
      type: 'message_sent' as const,
      description: `New message in "${(msg.tickets as any)?.title}"`,
      timestamp: msg.created_at,
      user: msg.sender,
    })) || []

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      averageResponseTime,
      customerSatisfaction,
      ticketsByPriority,
      ticketsByCategory,
      recentActivity,
    }
  }

  const fetchAgentStats = async (agentId: string): Promise<AgentStats> => {
    // Get all tickets for general stats
    const { data: allTickets, error: allTicketsError } = await supabase
      .from('tickets')
      .select('status, priority, category, created_at')

    if (allTicketsError) throw allTicketsError

    // Get agent's assigned tickets
    const { data: agentTickets, error: agentTicketsError } = await supabase
      .from('tickets')
      .select('status, priority, category, created_at, resolved_at, first_response_at')
      .eq('agent_id', agentId)

    if (agentTicketsError) throw agentTicketsError

    // Get recent activity
    const { data: recentMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        ticket_id,
        tickets!inner(title),
        sender:users!messages_sender_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (messagesError) throw messagesError

    // Calculate general stats
    const totalTickets = allTickets?.length || 0
    const openTickets = allTickets?.filter(t => t.status === 'open').length || 0
    const inProgressTickets = allTickets?.filter(t => t.status === 'in_progress').length || 0
    const resolvedTickets = allTickets?.filter(t => t.status === 'resolved').length || 0

    // Calculate agent-specific stats
    const assignedTickets = agentTickets?.length || 0
    const myResolvedTickets = agentTickets?.filter(t => t.status === 'resolved').length || 0

    // Calculate average response time
    const responseTimes = agentTickets
      ?.filter(t => t.first_response_at)
      .map(t => {
        const created = new Date(t.created_at)
        const responded = new Date(t.first_response_at!)
        return (responded.getTime() - created.getTime()) / (1000 * 60 * 60) // hours
      }) || []
    
    const myAverageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0

    const averageResponseTime = 4.5 // Overall average (mock)
    const customerSatisfaction = 4.2 // Mock

    // My tickets by status
    const myTicketsByStatus = {
      open: agentTickets?.filter(t => t.status === 'open').length || 0,
      inProgress: agentTickets?.filter(t => t.status === 'in_progress').length || 0,
      waitingForCustomer: agentTickets?.filter(t => t.status === 'waiting_for_customer').length || 0,
      resolved: agentTickets?.filter(t => t.status === 'resolved').length || 0,
    }

    // Priority breakdown (all tickets)
    const ticketsByPriority = {
      urgent: allTickets?.filter(t => t.priority === 'urgent').length || 0,
      high: allTickets?.filter(t => t.priority === 'high').length || 0,
      medium: allTickets?.filter(t => t.priority === 'medium').length || 0,
      low: allTickets?.filter(t => t.priority === 'low').length || 0,
    }

    // Category breakdown (all tickets)
    const categoryMap = new Map<string, number>()
    allTickets?.forEach(ticket => {
      categoryMap.set(ticket.category, (categoryMap.get(ticket.category) || 0) + 1)
    })
    const ticketsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }))

    // Recent activity
    const recentActivity = recentMessages?.map(msg => ({
      id: msg.id,
      type: 'message_sent' as const,
      description: `New message in "${(msg.tickets as any)?.title}"`,
      timestamp: msg.created_at,
      user: msg.sender,
    })) || []

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      averageResponseTime,
      customerSatisfaction,
      ticketsByPriority,
      ticketsByCategory,
      recentActivity,
      assignedTickets,
      myResolvedTickets,
      myAverageResponseTime,
      myTicketsByStatus,
    }
  }

  const fetchAdminStats = async (): Promise<DashboardStats> => {
    // Get all tickets
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('status, priority, category, created_at, resolved_at, first_response_at')

    if (ticketsError) throw ticketsError

    // Get recent activity
    const { data: recentMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        ticket_id,
        tickets!inner(title),
        sender:users!messages_sender_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (messagesError) throw messagesError

    const totalTickets = tickets?.length || 0
    const openTickets = tickets?.filter(t => t.status === 'open').length || 0
    const inProgressTickets = tickets?.filter(t => t.status === 'in_progress').length || 0
    const resolvedTickets = tickets?.filter(t => t.status === 'resolved').length || 0

    // Calculate average response time
    const responseTimes = tickets
      ?.filter(t => t.first_response_at)
      .map(t => {
        const created = new Date(t.created_at)
        const responded = new Date(t.first_response_at!)
        return (responded.getTime() - created.getTime()) / (1000 * 60 * 60) // hours
      }) || []
    
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0

    const customerSatisfaction = 4.2 // Mock

    // Priority breakdown
    const ticketsByPriority = {
      urgent: tickets?.filter(t => t.priority === 'urgent').length || 0,
      high: tickets?.filter(t => t.priority === 'high').length || 0,
      medium: tickets?.filter(t => t.priority === 'medium').length || 0,
      low: tickets?.filter(t => t.priority === 'low').length || 0,
    }

    // Category breakdown
    const categoryMap = new Map<string, number>()
    tickets?.forEach(ticket => {
      categoryMap.set(ticket.category, (categoryMap.get(ticket.category) || 0) + 1)
    })
    const ticketsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }))

    // Recent activity
    const recentActivity = recentMessages?.map(msg => ({
      id: msg.id,
      type: 'message_sent' as const,
      description: `New message in "${(msg.tickets as any)?.title}"`,
      timestamp: msg.created_at,
      user: msg.sender,
    })) || []

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      averageResponseTime,
      customerSatisfaction,
      ticketsByPriority,
      ticketsByCategory,
      recentActivity,
    }
  }

  const refreshStats = useCallback(async (): Promise<void> => {
    await fetchStats()
  }, [fetchStats])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [fetchStats, user])

  return {
    stats,
    loading,
    error,
    refreshStats,
  }
}

// Hook for getting user statistics
export const useUserStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchUserStats = async () => {
      try {
        // Get user's online status and activity
        const { data, error } = await supabase
          .from('users')
          .select('is_online, last_seen')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setStats(data)
      } catch (err) {
        console.error('Error fetching user stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()

    // Subscribe to user status changes
    const subscription = supabase
      .channel(`user:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setStats(payload.new)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return { stats, loading }
}
