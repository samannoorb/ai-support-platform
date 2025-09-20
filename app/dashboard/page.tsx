'use client'

import React from 'react'
import { 
  Ticket, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  User,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useAuth, useRoleAccess } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { useTickets } from '@/hooks/useTickets'
import { ProtectedRoute } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import TicketCard from '@/components/tickets/ticket-card'
import { formatRelativeTime } from '@/lib/utils'

const DashboardPage = () => {
  const { user } = useAuth()
  const { isCustomer, isAgent, isAdmin } = useRoleAccess()
  const { stats, loading: statsLoading } = useDashboard()
  const { 
    tickets, 
    loading: ticketsLoading, 
    totalCount 
  } = useTickets(
    isCustomer() ? { customer_id: user?.id } : undefined,
    { field: 'updated_at', direction: 'desc' },
    { page: 1, limit: 5 }
  )

  if (statsLoading && ticketsLoading) {
    return <Loading fullPage text="Loading dashboard..." />
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    let greeting = 'Good morning'
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon'
    if (hour >= 17) greeting = 'Good evening'
    
    return `${greeting}, ${user?.full_name?.split(' ')[0] || 'there'}!`
  }

  const getDashboardTitle = () => {
    if (isCustomer()) return 'Customer Dashboard'
    if (isAgent()) return 'Agent Dashboard'
    if (isAdmin()) return 'Admin Dashboard'
    return 'Dashboard'
  }

  const getQuickActions = () => {
    if (isCustomer()) {
      return [
        {
          title: 'Create New Ticket',
          description: 'Submit a new support request',
          href: '/create-ticket',
          icon: <Plus className="h-5 w-5" />,
          color: 'bg-primary-500'
        },
        {
          title: 'View All Tickets',
          description: 'See all your support tickets',
          href: '/tickets',
          icon: <Ticket className="h-5 w-5" />,
          color: 'bg-blue-500'
        },
        {
          title: 'Messages',
          description: 'Recent conversations',
          href: '/messages',
          icon: <MessageSquare className="h-5 w-5" />,
          color: 'bg-green-500'
        }
      ]
    }
    
    if (isAgent()) {
      return [
        {
          title: 'Open Tickets',
          description: 'Unassigned tickets',
          href: '/tickets?status=open',
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'bg-red-500'
        },
        {
          title: 'My Tickets',
          description: 'Your assigned tickets',
          href: '/my-tickets',
          icon: <User className="h-5 w-5" />,
          color: 'bg-blue-500'
        },
        {
          title: 'Customers',
          description: 'Customer directory',
          href: '/customers',
          icon: <Users className="h-5 w-5" />,
          color: 'bg-green-500'
        }
      ]
    }

    return []
  }

  const getStatCards = () => {
    if (!stats) return []

    const baseStats = [
      {
        title: 'Total Tickets',
        value: stats.totalTickets,
        icon: <Ticket className="h-5 w-5" />,
        color: 'text-blue-600'
      },
      {
        title: 'Open Tickets',
        value: stats.openTickets,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'text-red-600'
      },
      {
        title: 'In Progress',
        value: stats.inProgressTickets,
        icon: <Clock className="h-5 w-5" />,
        color: 'text-yellow-600'
      },
      {
        title: 'Resolved',
        value: stats.resolvedTickets,
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'text-green-600'
      }
    ]

    if ('assignedTickets' in stats) {
      // Agent stats
      baseStats.push({
        title: 'Assigned to Me',
        value: stats.assignedTickets,
        icon: <User className="h-5 w-5" />,
        color: 'text-purple-600'
      })
    }

    return baseStats
  }

  const recentActivity = stats?.recentActivity?.slice(0, 3) || []
  const quickActions = getQuickActions()
  const statCards = getStatCards()

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getDashboardTitle()}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {getWelcomeMessage()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link href={isCustomer() ? '/create-ticket' : '/tickets'}>
                {isCustomer() ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                  </>
                ) : (
                  <>
                    <Ticket className="h-4 w-4 mr-2" />
                    View All Tickets
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`${action.color} p-3 rounded-lg text-white`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Tickets */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Tickets
            </h2>
            <Link href="/tickets">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {ticketsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No tickets yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isCustomer() 
                    ? "You haven't created any support tickets yet." 
                    : "No tickets match your current view."}
                </p>
                {isCustomer() && (
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
          )}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default DashboardPage
