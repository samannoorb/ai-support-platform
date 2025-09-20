'use client'

import React, { useState } from 'react'
import { 
  Users, 
  Ticket, 
  UserCheck, 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Settings,
  Shield,
  Database,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'

const AdminPage = () => {
  const { user } = useAuth()
  const { stats, loading } = useDashboard()

  // Use real stats from the dashboard hook
  const systemStats = {
    totalUsers: 1247, // This would come from a real users count API
    totalAgents: 23,
    totalCustomers: 1224,
    activeTickets: stats?.openTickets || 0,
    avgResponseTime: stats?.averageResponseTime ? `${stats.averageResponseTime.toFixed(1)} hours` : '0 hours',
    systemUptime: '99.9%',
    storageUsed: '2.4 GB',
    apiCalls: '45.2K'
  }

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      href: '/users',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      title: 'System Analytics',
      description: 'View detailed system analytics',
      href: '/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      title: 'Agent Performance',
      description: 'Monitor agent performance metrics',
      href: '/agents',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      color: 'bg-orange-500'
    },
    {
      title: 'Generate Reports',
      description: 'Create custom reports',
      href: '/reports',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-indigo-500'
    },
    {
      title: 'All Tickets',
      description: 'View and manage all tickets',
      href: '/tickets',
      icon: <Ticket className="h-5 w-5" />,
      color: 'bg-red-500'
    }
  ]

  const recentActivities = [
    {
      id: '1',
      type: 'user_created',
      message: 'New user "John Doe" registered as customer',
      timestamp: '2 minutes ago',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: '2',
      type: 'ticket_resolved',
      message: 'Agent Sarah Wilson resolved ticket #TKT-001',
      timestamp: '15 minutes ago',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: '3',
      type: 'system_alert',
      message: 'High number of open tickets detected',
      timestamp: '1 hour ago',
      icon: <AlertCircle className="h-4 w-4" />
    },
    {
      id: '4',
      type: 'agent_login',
      message: 'Agent Mike Chen logged in',
      timestamp: '2 hours ago',
      icon: <UserCheck className="h-4 w-4" />
    },
    {
      id: '5',
      type: 'ticket_created',
      message: 'New urgent ticket created by Emma Davis',
      timestamp: '3 hours ago',
      icon: <Ticket className="h-4 w-4" />
    }
  ]

  if (loading) {
    return <Loading fullPage text="Loading admin dashboard..." />
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              System overview and management tools
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button asChild variant="outline">
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button asChild>
              <Link href="/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      {systemStats.totalUsers}
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
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      {systemStats.totalAgents}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Active Agents
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      {systemStats.activeTickets}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Active Tickets
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      {systemStats.avgResponseTime}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Avg Response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Health */}
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">{systemStats.systemUptime}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Storage</p>
                    <p className="text-2xl font-bold text-blue-600">{systemStats.storageUsed}</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">API Calls</p>
                    <p className="text-2xl font-bold text-purple-600">{systemStats.apiCalls}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Security</p>
                    <p className="text-2xl font-bold text-green-600">Secure</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`${action.color} p-3 rounded-lg text-white`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                          {action.title}
                        </h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent System Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-secondary-900 dark:text-secondary-100">
                        {activity.message}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Tickets Resolved Today</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    24
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Customer Satisfaction</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    4.8/5
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Agent Utilization</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    87%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Open Tickets</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                    {systemStats.activeTickets}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">System Load</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Normal
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default AdminPage
