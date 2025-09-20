'use client'

import React, { useState } from 'react'
import { Download, FileText, Calendar, Filter, BarChart3, TrendingUp, Users, Ticket } from 'lucide-react'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ReportsPage = () => {
  const { user } = useAuth()
  const { stats } = useDashboard()
  const [reportType, setReportType] = useState('overview')
  const [timeRange, setTimeRange] = useState('30d')
  const [format, setFormat] = useState('pdf')
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    { value: 'overview', label: 'Overview Report' },
    { value: 'tickets', label: 'Ticket Analysis' },
    { value: 'agent_performance', label: 'Agent Performance' },
    { value: 'customer_satisfaction', label: 'Customer Satisfaction' },
    { value: 'response_times', label: 'Response Times' },
    { value: 'resolution_rates', label: 'Resolution Rates' }
  ]

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      // Here you would generate the actual report
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate generation
      
      // Create a sample download
      const reportData = {
        type: reportType,
        timeRange,
        generatedAt: new Date().toISOString(),
        data: stats
      }
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}_report_${timeRange}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const quickReports = [
    {
      title: 'Daily Summary',
      description: 'Quick overview of today\'s metrics',
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => handleGenerateReport()
    },
    {
      title: 'Weekly Performance',
      description: 'Agent and ticket performance this week',
      icon: <TrendingUp className="h-5 w-5" />,
      action: () => handleGenerateReport()
    },
    {
      title: 'Customer Insights',
      description: 'Customer satisfaction and feedback',
      icon: <Users className="h-5 w-5" />,
      action: () => handleGenerateReport()
    },
    {
      title: 'Ticket Analysis',
      description: 'Detailed breakdown of ticket categories',
      icon: <Ticket className="h-5 w-5" />,
      action: () => handleGenerateReport()
    }
  ]

  const recentReports = [
    {
      id: '1',
      name: 'Monthly Overview Report',
      type: 'Overview',
      generatedAt: '2024-01-20T10:30:00Z',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: '2',
      name: 'Agent Performance Analysis',
      type: 'Performance',
      generatedAt: '2024-01-19T15:45:00Z',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: '3',
      name: 'Customer Satisfaction Survey',
      type: 'Satisfaction',
      generatedAt: '2024-01-18T09:15:00Z',
      size: '956 KB',
      format: 'PDF'
    }
  ]

  return (
    <ProtectedRoute allowedRoles={['admin', 'agent']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Reports & Analytics
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Generate detailed reports and export data
            </p>
          </div>
        </div>

        {/* Report Generator */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generate Custom Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Select
                label="Report Type"
                value={reportType}
                onValueChange={setReportType}
                options={reportTypes}
              />
              
              <Select
                label="Time Range"
                value={timeRange}
                onValueChange={setTimeRange}
                options={timeRanges}
              />
              
              <Select
                label="Format"
                value={format}
                onValueChange={setFormat}
                options={formats}
              />
              
              <div className="flex items-end">
                <Button 
                  onClick={handleGenerateReport} 
                  loading={isGenerating}
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {timeRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                />
                <Input
                  label="End Date"
                  type="date"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Quick Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReports.map((report, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={report.action}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg text-primary-600">
                      {report.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Stats Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Current Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.totalTickets || 0}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Total Tickets
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats?.resolvedTickets || 0}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Resolved Tickets
                </div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {stats?.averageResponseTime?.toFixed(1) || '0.0'}h
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Avg Response Time
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats?.customerSatisfaction?.toFixed(1) || '0.0'}/5
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">
                  Customer Satisfaction
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                        {report.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                      {report.format}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

export default ReportsPage
