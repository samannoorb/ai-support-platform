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
  Users,
  Activity,
  BarChart3
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
          color: 'from-primary-500 to-primary-600',
          textColor: 'text-white'
        },
        {
          title: 'View All Tickets',
          description: 'See all your support tickets',
          href: '/tickets',
          icon: <Ticket className="h-5 w-5" />,
          color: 'from-accent-500 to-accent-600',
          textColor: 'text-white'
        },
        {
          title: 'Messages',
          description: 'Recent conversations',
          href: '/messages',
          icon: <MessageSquare className="h-5 w-5" />,
          color: 'from-success-500 to-success-600',
          textColor: 'text-white'
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
          color: 'from-danger-500 to-danger-600',
          textColor: 'text-white'
        },
        {
          title: 'My Tickets',
          description: 'Your assigned tickets',
          href: '/my-tickets',
          icon: <User className="h-5 w-5" />,
          color: 'from-primary-500 to-primary-600',
          textColor: 'text-white'
        },
        {
          title: 'Customers',
          description: 'Customer directory',
          href: '/customers',
          icon: <Users className="h-5 w-5" />,
          color: 'from-accent-500 to-accent-600',
          textColor: 'text-white'
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
        icon: <Ticket className="h-6 w-6" />,
        color: 'text-primary-600 dark:text-primary-400',
        bgColor: 'bg-primary-50 dark:bg-primary-900/20',
        change: '+12%',
        changeType: 'positive' as const
      },
      {
        title: 'Open Tickets',
        value: stats.openTickets,
        icon: <AlertCircle className="h-6 w-6" />,
        color: 'text-danger-600 dark:text-danger-400',
        bgColor: 'bg-danger-50 dark:bg-danger-900/20',
        change: '-5%',
        changeType: 'negative' as const
      },
      {
        title: 'In Progress',
        value: stats.inProgressTickets,
        icon: <Clock className="h-6 w-6" />,
        color: 'text-warning-600 dark:text-warning-400',
        bgColor: 'bg-warning-50 dark:bg-warning-900/20',
        change: '+8%',
        changeType: 'positive' as const
      },
      {
        title: 'Resolved',
        value: stats.resolvedTickets,
        icon: <CheckCircle className="h-6 w-6" />,
        color: 'text-success-600 dark:text-success-400',
        bgColor: 'bg-success-50 dark:bg-success-900/20',
        change: '+15%',
        changeType: 'positive' as const
      }
    ]

    if ('assignedTickets' in stats) {
      baseStats.push({
        title: 'Assigned to Me',
        value: stats.assignedTickets,
        icon: <User className="h-6 w-6" />,
        color: 'text-accent-600 dark:text-accent-400',
        bgColor: 'bg-accent-50 dark:bg-accent-900/20',
        change: '+3%',
        changeType: 'positive' as const
      })
    }

    return baseStats
  }

  const recentActivity = stats?.recentActivity?.slice(0, 3) || []
  const quickActions = getQuickActions()
  const statCards = getStatCards()

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
              {getDashboardTitle()}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {getWelcomeMessage()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild className="shadow-lg">
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
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'positive' 
                          ? 'text-success-600 dark:text-success-400' 
                          : 'text-danger-600 dark:text-danger-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="card-hover cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg`}>
                          <div className={action.textColor}>
                            {action.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recent Tickets
            </h2>
            <Link href="/tickets">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {ticketsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No tickets yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                  {isCustomer() 
                    ? "You haven't created any support tickets yet." 
                    : "No tickets match your current view."}
                </p>
                {isCustomer() && (
                  <Button asChild className="shadow-lg">
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
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Recent Activity
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-slate-100">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Activity className="h-4 w-4 text-slate-400" />
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