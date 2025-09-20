'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, Search, Phone, Video, MoreVertical } from 'lucide-react'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { formatRelativeTime } from '@/lib/utils'

interface Conversation {
  id: string
  title: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  participant: {
    name: string
    role: string
    avatar?: string
    isOnline: boolean
  }
}

const MessagesPage = () => {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, loading, sendMessage } = useMessages(selectedConversation)

  // Mock conversations data - in real app this would come from an API
  const conversations: Conversation[] = [
    {
      id: '1',
      title: 'Login Issue - Unable to access account',
      lastMessage: 'Thank you for the help! The issue has been resolved.',
      lastMessageTime: '2 hours ago',
      unreadCount: 0,
      participant: {
        name: 'Sarah Wilson',
        role: 'agent',
        isOnline: true
      }
    },
    {
      id: '2',
      title: 'Payment Processing Error',
      lastMessage: 'Could you please check your payment method?',
      lastMessageTime: '1 day ago',
      unreadCount: 2,
      participant: {
        name: 'Mike Chen',
        role: 'agent',
        isOnline: false
      }
    },
    {
      id: '3',
      title: 'Feature Request - Dark Mode',
      lastMessage: 'We appreciate your feedback and will consider this...',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
      participant: {
        name: 'Emma Davis',
        role: 'agent',
        isOnline: true
      }
    }
  ]

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      await sendMessage(newMessage.trim())
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-secondary-900 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-secondary-600 dark:text-secondary-400">
                  No conversations found
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                        : 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {conversation.participant.name.charAt(0)}
                          </span>
                        </div>
                        {conversation.participant.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-secondary-900"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                            {conversation.participant.name}
                          </p>
                          <span className="text-xs text-secondary-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 truncate mb-1">
                          {conversation.title}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-secondary-600 dark:text-secondary-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {conversations.find(c => c.id === selectedConversation)?.participant.name.charAt(0)}
                        </span>
                      </div>
                      {conversations.find(c => c.id === selectedConversation)?.participant.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-secondary-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                        {conversations.find(c => c.id === selectedConversation)?.participant.name}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {conversations.find(c => c.id === selectedConversation)?.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <Loading text="Loading messages..." />
                ) : (
                  <>
                    {/* Mock messages - in real app these would come from the API */}
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-2xl px-4 py-2">
                          <p className="text-sm">Hi! I'm having trouble logging into my account. It keeps saying my credentials are invalid.</p>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1 px-2">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-primary-600 text-white rounded-2xl px-4 py-2">
                          <p className="text-sm">Hi! I'd be happy to help you with that. Can you please try resetting your password using the "Forgot Password" link?</p>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1 px-2 text-right">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-2xl px-4 py-2">
                          <p className="text-sm">That worked! Thank you so much for the help. I'm able to log in now.</p>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1 px-2">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-primary-600 text-white rounded-2xl px-4 py-2">
                          <p className="text-sm">You're welcome! Is there anything else I can help you with today?</p>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1 px-2 text-right">2 hours ago</p>
                      </div>
                    </div>

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={1}
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  Select a conversation
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default MessagesPage
