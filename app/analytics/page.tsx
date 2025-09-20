'use client'

import React, { useState } from 'react'
import { Calendar, TrendingUp, TrendingDown, BarChart3, PieChart, Users, Ticket, Clock, Star, Download } from 'lucide-react'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { useTickets } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const AnalyticsPage = () => {
  const { user } = useAuth()
  const { stats } = useDashboard()
  const { tickets } = useTickets()
  const [timeRange, setTimeRange] = useState('7d')
  const [viewType, setViewType] = useState('overview')

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ]

  const viewTypeOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'tickets', label: 'Tickets' },
    { value: 'agents', label: 'Agents' },
    { value: 'customers', label: 'Customers' },
    { value: 'satisfaction', label: 'Satisfaction' }
  ]

  // Use real analytics data from dashboard stats
  const metrics = {
    totalTickets: stats?.totalTickets || 0,
    ticketGrowth: 12.5, // This would be calculated from historical data
    resolvedTickets: stats?.resolvedTickets || 0,
    resolutionRate: stats?.totalTickets > 0 ? ((stats?.resolvedTickets || 0) / stats.totalTickets * 100) : 0,
    avgResponseTime: stats?.averageResponseTime || 0,
    responseTimeChange: -15.2, // This would be calculated from historical data
    customerSatisfaction: stats?.customerSatisfaction || 0,
    satisfactionChange: 8.1, // This would be calculated from historical data
    activeAgents: 23, // This would come from a real agents count API
    agentUtilization: 89.2 // This would be calculated from agent activity data
  }

  // Calculate real ticket distributions
  const totalTickets = stats?.totalTickets || 1
  
  const ticketsByStatus = [
    { 
      status: 'Open', 
      count: stats?.openTickets || 0, 
      percentage: ((stats?.openTickets || 0) / totalTickets * 100).toFixed(1), 
      color: 'bg-red-500' 
    },
    { 
      status: 'In Progress', 
      count: stats?.inProgressTickets || 0, 
      percentage: ((stats?.inProgressTickets || 0) / totalTickets * 100).toFixed(1), 
      color: 'bg-yellow-500' 
    },
    { 
      status: 'Resolved', 
      count: stats?.resolvedTickets || 0, 
      percentage: ((stats?.resolvedTickets || 0) / totalTickets * 100).toFixed(1), 
      color: 'bg-green-500' 
    },
    { 
      status: 'Closed', 
      count: 0, 
      percentage: '0.0', 
      color: 'bg-secondary-500' 
    }
  ]

  const ticketsByPriority = [
    { 
      priority: 'Urgent', 
      count: stats?.ticketsByPriority?.urgent || 0, 
      percentage: ((stats?.ticketsByPriority?.urgent || 0) / totalTickets * 100).toFixed(1), 
      color: 'bg-red-500' 
    },
    { 
      priority: 'High', 
      count: stats?.ticketsByPriority?.high || 0, 
      percentage: ((stats?.ticketsByPriority?.high || 0) / totalTickets * 100).toFixed(1), 
      color: 'bg-orange-500' 
    },
    { 
      priority: 'Medium', 
      count: stats?.ticketsByPriority?.medium || 0, 
      percentage: ((stats?.ticketsByPriority?.medium || 0) / totalTickets * 100).toFixed(1), 
      color: 'bg-yellow-500' 
    },
    { 
      priority: 'Low', 
      count: stats?.ticketsByPriority?.low || 0, 
      percentage: ((stats?.ticketsByPriority?.low || 0) / totalTickets * 100).toFixed(1), 
      color: 'bg-green-500' 
    }
  ]

  const topAgents = [
    { name: 'Sarah Wilson', resolved: 89, satisfaction: 4.8, responseTime: '1.2h' },
    { name: 'Mike Chen', resolved: 76, satisfaction: 4.7, responseTime: '1.8h' },
    { name: 'Emma Davis', resolved: 71, satisfaction: 4.9, responseTime: '1.1h' },
    { name: 'Alex Johnson', resolved: 68, satisfaction: 4.6, responseTime: '2.1h' },
    { name: 'Lisa Brown', resolved: 65, satisfaction: 4.8, responseTime: '1.9h' }
  ]

  const recentTrends = [
    { metric: 'Ticket Volume', current: 156, previous: 142, change: 9.9, trend: 'up' },
    { metric: 'Resolution Time', current: 2.4, previous: 2.8, change: -14.3, trend: 'down' },
    { metric: 'First Response', current: 45, previous: 52, change: -13.5, trend: 'down' },
    { metric: 'Customer Rating', current: 4.6, previous: 4.3, change: 7.0, trend: 'up' }
  ]

  const MetricCard = ({ title, value, change, icon, suffix = '' }: any) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {value}{suffix}
            </p>
            {change !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                <span>{Math.abs(change)}% vs last period</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <ProtectedRoute allowedRoles={['admin', 'agent']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Performance metrics and insights
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              options={timeRangeOptions}
            />
            <Select
              value={viewType}
              onValueChange={setViewType}
              options={viewTypeOptions}
            />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Tickets"
            value={metrics.totalTickets}
            change={metrics.ticketGrowth}
            icon={<Ticket className="h-6 w-6 text-primary-600" />}
          />
          <MetricCard
            title="Resolution Rate"
            value={metrics.resolutionRate}
            change={5.2}
            suffix="%"
            icon={<BarChart3 className="h-6 w-6 text-primary-600" />}
          />
          <MetricCard
            title="Avg Response Time"
            value={metrics.avgResponseTime}
            change={metrics.responseTimeChange}
            suffix="h"
            icon={<Clock className="h-6 w-6 text-primary-600" />}
          />
          <MetricCard
            title="Satisfaction Score"
            value={metrics.customerSatisfaction}
            change={metrics.satisfactionChange}
            suffix="/5"
            icon={<Star className="h-6 w-6 text-primary-600" />}
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets by Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Tickets by Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketsByStatus.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {item.status}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-secondary-900 dark:text-secondary-100">
                          {item.count}
                        </span>
                        <span className="text-xs text-secondary-500 ml-2">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tickets by Priority */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Tickets by Priority</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketsByPriority.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {item.priority}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-secondary-900 dark:text-secondary-100">
                          {item.count}
                        </span>
                        <span className="text-xs text-secondary-500 ml-2">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentTrends.map((trend, index) => (
                <div key={index} className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                      {trend.metric}
                    </span>
                    <div className={`flex items-center text-sm ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.trend === 'up' ? 
                        <TrendingUp className="h-4 w-4" /> : 
                        <TrendingDown className="h-4 w-4" />
                      }
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">
                    {trend.current}
                    {trend.metric.includes('Time') || trend.metric.includes('Response') ? 
                      (trend.metric.includes('Response') ? 'min' : 'h') : 
                      trend.metric.includes('Rating') ? '/5' : ''
                    }
                  </p>
                  <p className={`text-xs ${
                    trend.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.change >= 0 ? '+' : ''}{trend.change}% change
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Agents */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Top Performing Agents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-secondary-200 dark:border-secondary-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Agent</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Resolved</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Satisfaction</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Avg Response</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600 dark:text-secondary-400">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {topAgents.map((agent, index) => (
                    <tr key={index} className="border-b border-secondary-100 dark:border-secondary-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {agent.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-secondary-900 dark:text-secondary-100">
                            {agent.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-secondary-900 dark:text-secondary-100">
                          {agent.resolved}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-secondary-900 dark:text-secondary-100">
                            {agent.satisfaction}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-secondary-900 dark:text-secondary-100">
                          {agent.responseTime}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          Excellent
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

export default AnalyticsPage
