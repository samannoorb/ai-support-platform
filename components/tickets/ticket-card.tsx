import React from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Pause,
  XCircle,
  MoreHorizontal
} from 'lucide-react'
import { TicketWithRelations } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRelativeTime, getInitials, truncateText } from '@/lib/utils'

interface TicketCardProps {
  ticket: TicketWithRelations
  showCustomer?: boolean
  showAgent?: boolean
  onEdit?: (ticket: TicketWithRelations) => void
  onDelete?: (ticket: TicketWithRelations) => void
  onAssign?: (ticket: TicketWithRelations) => void
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  showCustomer = true,
  showAgent = true,
  onEdit,
  onDelete,
  onAssign,
}) => {
  const getStatusIcon = () => {
    switch (ticket.status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'waiting_for_customer':
        return <Pause className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      case 'closed':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'open'
      case 'in_progress':
        return 'in-progress'
      case 'waiting_for_customer':
        return 'waiting-for-customer'
      case 'resolved':
        return 'resolved'
      case 'closed':
        return 'closed'
      default:
        return 'outline'
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'urgent'
      case 'high':
        return 'high'
      case 'medium':
        return 'medium'
      case 'low':
        return 'low'
      default:
        return 'outline'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500'
      case 'high':
        return 'border-orange-500'
      case 'medium':
        return 'border-yellow-500'
      case 'low':
        return 'border-green-500'
      default:
        return 'border-gray-300'
    }
  }

  return (
    <Card className={`group hover:shadow-md transition-all duration-200 border-l-4 ${getPriorityColor(ticket.priority)}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link 
                  href={`/tickets/${ticket.id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {truncateText(ticket.title, 60)}
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {ticket.ticket_id}
                  </span>
                  <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                    {ticket.priority}
                  </Badge>
                  <Badge variant={getStatusVariant(ticket.status)} className="text-xs">
                    <span className="flex items-center space-x-1">
                      {getStatusIcon()}
                      <span>{ticket.status.replace('_', ' ')}</span>
                    </span>
                  </Badge>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onAssign && !ticket.agent_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAssign(ticket)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Assign
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(ticket)}
                    className="h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {truncateText(ticket.description, 120)}
            </p>

            {/* Category */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Category:</span>
                <Badge variant="secondary" className="text-xs">
                  {ticket.category}
                </Badge>
              </div>
              {ticket.estimated_resolution && (
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Est: {ticket.estimated_resolution}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Customer Info */}
                {showCustomer && ticket.customer && (
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {getInitials(ticket.customer.full_name)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {ticket.customer.full_name}
                    </span>
                  </div>
                )}

                {/* Agent Info */}
                {showAgent && ticket.agent && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {getInitials(ticket.agent.full_name)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {ticket.agent.full_name}
                    </span>
                  </div>
                )}

                {showAgent && !ticket.agent && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Unassigned
                    </span>
                  </div>
                )}

                {/* Message Count */}
                {ticket._count?.messages && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ticket._count.messages}</span>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formatRelativeTime(ticket.created_at)}</span>
              </div>
            </div>

            {/* Tags */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                {ticket.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {ticket.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{ticket.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TicketCard
