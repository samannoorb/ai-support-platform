'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Ticket, 
  TicketWithRelations, 
  TicketFilters, 
  TicketSort, 
  PaginationParams,
  CreateTicketForm,
  UpdateTicketForm
} from '@/types'
import { useAuth } from './useAuth'
import { generateTicketId } from '@/lib/utils'

interface UseTicketsResult {
  tickets: TicketWithRelations[]
  loading: boolean
  error: string | null
  totalCount: number
  createTicket: (data: CreateTicketForm) => Promise<Ticket>
  updateTicket: (id: string, data: UpdateTicketForm) => Promise<void>
  deleteTicket: (id: string) => Promise<void>
  assignTicket: (ticketId: string, agentId: string) => Promise<void>
  refreshTickets: () => Promise<void>
}

export const useTickets = (
  filters?: TicketFilters,
  sort?: TicketSort,
  pagination?: PaginationParams
) => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchTickets = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          customer:users!tickets_customer_id_fkey(*),
          agent:users!tickets_agent_id_fkey(*),
          _count:messages(count)
        `, { count: 'exact' })

      // Apply role-based filtering
      if (user.role === 'customer') {
        query = query.eq('customer_id', user.id)
      } else if (user.role === 'agent') {
        // Agents can see assigned tickets and unassigned tickets
        query = query.or(`agent_id.eq.${user.id},agent_id.is.null`)
      }
      // Admins can see all tickets (no additional filter)

      // Apply filters
      if (filters?.status?.length) {
        query = query.in('status', filters.status)
      }
      
      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority)
      }
      
      if (filters?.category?.length) {
        query = query.in('category', filters.category)
      }
      
      if (filters?.agent_id) {
        query = query.eq('agent_id', filters.agent_id)
      }
      
      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id)
      }
      
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,ticket_id.ilike.%${filters.search}%`
        )
      }
      
      if (filters?.date_range) {
        query = query
          .gte('created_at', filters.date_range.start)
          .lte('created_at', filters.date_range.end)
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit
        const to = from + pagination.limit - 1
        query = query.range(from, to)
      }

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        throw fetchError
      }

      setTickets(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching tickets:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }, [user, filters, sort, pagination])

  const createTicket = useCallback(async (data: CreateTicketForm): Promise<Ticket> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    const ticketId = generateTicketId()
    
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        ticket_id: ticketId,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || 'medium',
        customer_id: user.id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Refresh tickets list
    await fetchTickets()

    return ticket
  }, [user, fetchTickets])

  const updateTicket = useCallback(async (id: string, data: UpdateTicketForm): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .update(data)
      .eq('id', id)

    if (error) {
      throw error
    }

    // Refresh tickets list
    await fetchTickets()
  }, [fetchTickets])

  const deleteTicket = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    // Refresh tickets list
    await fetchTickets()
  }, [fetchTickets])

  const assignTicket = useCallback(async (ticketId: string, agentId: string): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        agent_id: agentId,
        status: 'in_progress',
        first_response_at: new Date().toISOString()
      })
      .eq('id', ticketId)

    if (error) {
      throw error
    }

    // Refresh tickets list
    await fetchTickets()
  }, [fetchTickets])

  const refreshTickets = useCallback(async (): Promise<void> => {
    await fetchTickets()
  }, [fetchTickets])

  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [fetchTickets, user])

  return {
    tickets,
    loading,
    error,
    totalCount,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTicket,
    refreshTickets,
  }
}

// Hook for getting a single ticket
export const useTicket = (ticketId: string) => {
  const { user } = useAuth()
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicket = useCallback(async () => {
    if (!user || !ticketId) return

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          customer:users!tickets_customer_id_fkey(*),
          agent:users!tickets_agent_id_fkey(*),
          organization:organizations(*)
        `)
        .eq('id', ticketId)

      // Apply role-based access control
      if (user.role === 'customer') {
        query = query.eq('customer_id', user.id)
      } else if (user.role === 'agent') {
        query = query.or(`agent_id.eq.${user.id},agent_id.is.null,customer_id.eq.${user.id}`)
      }
      // Admins can access all tickets

      const { data, error: fetchError } = await query.single()

      if (fetchError) {
        throw fetchError
      }

      setTicket(data)
    } catch (err) {
      console.error('Error fetching ticket:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch ticket')
    } finally {
      setLoading(false)
    }
  }, [user, ticketId])

  useEffect(() => {
    if (user && ticketId) {
      fetchTicket()
    }
  }, [fetchTicket, user, ticketId])

  return {
    ticket,
    loading,
    error,
    refetch: fetchTicket,
  }
}
