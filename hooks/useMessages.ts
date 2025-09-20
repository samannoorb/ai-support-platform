'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Message, 
  MessageWithSender, 
  SendMessageForm
} from '@/types'
import { useAuth } from './useAuth'

interface UseMessagesResult {
  messages: MessageWithSender[]
  loading: boolean
  error: string | null
  sendMessage: (data: SendMessageForm) => Promise<void>
  markAsRead: (messageIds: string[]) => Promise<void>
  refreshMessages: () => Promise<void>
}

export const useMessages = (ticketId: string) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!user || !ticketId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(*),
          attachments(*)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }, [user, ticketId])

  const sendMessage = useCallback(async (data: SendMessageForm): Promise<void> => {
    if (!user || !ticketId) {
      throw new Error('User not authenticated or ticket ID missing')
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticketId,
          sender_id: user.id,
          content: data.content,
          message_type: data.message_type || 'message',
        })

      if (error) {
        throw error
      }

      // Update ticket's updated_at timestamp
      await supabase
        .from('tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId)

      // If this is the first response from an agent, update first_response_at
      if (user.role === 'agent') {
        const { data: ticket } = await supabase
          .from('tickets')
          .select('first_response_at')
          .eq('id', ticketId)
          .single()

        if (ticket && !ticket.first_response_at) {
          await supabase
            .from('tickets')
            .update({ first_response_at: new Date().toISOString() })
            .eq('id', ticketId)
        }
      }

    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }, [user, ticketId])

  const markAsRead = useCallback(async (messageIds: string[]): Promise<void> => {
    // Implementation for marking messages as read
    // This would require additional schema changes to track read status
    console.log('Marking messages as read:', messageIds)
  }, [])

  const refreshMessages = useCallback(async (): Promise<void> => {
    await fetchMessages()
  }, [fetchMessages])

  // Set up real-time subscription
  useEffect(() => {
    if (!ticketId) return

    const subscription = supabase
      .channel(`messages:${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey(*),
              attachments(*)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => [...prev, data])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        async (payload) => {
          // Fetch the updated message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey(*),
              attachments(*)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => prev.map(msg => 
              msg.id === data.id ? data : msg
            ))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [ticketId])

  useEffect(() => {
    if (user && ticketId) {
      fetchMessages()
    }
  }, [fetchMessages, user, ticketId])

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    refreshMessages,
  }
}

// Hook for typing indicators
export const useTypingIndicator = (ticketId: string) => {
  const { user } = useAuth()
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const setTyping = useCallback((isTyping: boolean) => {
    if (!user || !ticketId) return

    // Send typing indicator via real-time channel
    const channel = supabase.channel(`typing:${ticketId}`)
    
    if (isTyping) {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: user.id, is_typing: true }
      })
    } else {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: user.id, is_typing: false }
      })
    }
  }, [user, ticketId])

  useEffect(() => {
    if (!ticketId) return

    const subscription = supabase
      .channel(`typing:${ticketId}`)
      .on(
        'broadcast',
        { event: 'typing' },
        (payload) => {
          const { user_id, is_typing } = payload.payload
          
          if (is_typing) {
            setTypingUsers(prev => 
              prev.includes(user_id) ? prev : [...prev, user_id]
            )
          } else {
            setTypingUsers(prev => prev.filter(id => id !== user_id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [ticketId])

  return {
    typingUsers: typingUsers.filter(id => id !== user?.id), // Exclude current user
    setTyping,
  }
}
