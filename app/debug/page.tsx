'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTickets } from '@/hooks/useTickets'
import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DebugPage = () => {
  const { user, loading: authLoading } = useAuth()
  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets()
  const { stats, loading: statsLoading, error: statsError } = useDashboard()

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Debug Information</h1>
      
      {/* Auth Debug */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? `${user.email} (${user.role})` : 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Debug */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {ticketsLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {ticketsError || 'None'}</p>
            <p><strong>Count:</strong> {tickets.length}</p>
            <p><strong>Tickets:</strong></p>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(tickets.slice(0, 2), null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Debug */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {statsLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {statsError || 'None'}</p>
            <p><strong>Stats:</strong></p>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DebugPage
