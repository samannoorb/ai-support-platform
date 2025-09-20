'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3,
  MessageSquare,
  Ticket,
  Users,
  Settings,
  Plus,
  Home,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Shield,
  TrendingUp,
  Inbox
} from 'lucide-react'
import { useRoleAccess } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: string | number
  description?: string
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const { isCustomer, isAgent, isAdmin } = useRoleAccess()

  const getNavItems = (): NavItem[] => {
    if (isCustomer()) {
      return [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: <Home className="h-5 w-5" />,
          description: 'Overview of your tickets'
        },
        {
          href: '/tickets',
          label: 'My Tickets',
          icon: <Ticket className="h-5 w-5" />,
          badge: '3',
          description: 'View and manage your support tickets'
        },
        {
          href: '/create-ticket',
          label: 'New Ticket',
          icon: <Plus className="h-5 w-5" />,
          description: 'Create a new support request'
        },
        {
          href: '/messages',
          label: 'Messages',
          icon: <MessageSquare className="h-5 w-5" />,
          badge: '2',
          description: 'Recent conversations'
        },
        {
          href: '/profile',
          label: 'Profile',
          icon: <User className="h-5 w-5" />,
          description: 'Manage your account settings'
        }
      ]
    } else if (isAgent()) {
      return [
        {
          href: '/agent-dashboard',
          label: 'Dashboard',
          icon: <Home className="h-5 w-5" />,
          description: 'Agent performance overview'
        },
        {
          href: '/tickets',
          label: 'All Tickets',
          icon: <Inbox className="h-5 w-5" />,
          badge: '12',
          description: 'View all support tickets'
        },
        {
          href: '/my-tickets',
          label: 'My Tickets',
          icon: <User className="h-5 w-5" />,
          badge: '5',
          description: 'Tickets assigned to you'
        },
        {
          href: '/tickets?status=open',
          label: 'Open Tickets',
          icon: <AlertCircle className="h-5 w-5" />,
          badge: '8',
          description: 'Unassigned tickets'
        },
        {
          href: '/tickets?status=in_progress',
          label: 'In Progress',
          icon: <Clock className="h-5 w-5" />,
          badge: '4',
          description: 'Tickets being worked on'
        },
        {
          href: '/customers',
          label: 'Customers',
          icon: <Users className="h-5 w-5" />,
          description: 'Customer directory'
        }
      ]
    } else if (isAdmin()) {
      return [
        {
          href: '/admin',
          label: 'Admin Panel',
          icon: <Shield className="h-5 w-5" />,
          description: 'System administration'
        },
        {
          href: '/analytics',
          label: 'Analytics',
          icon: <BarChart3 className="h-5 w-5" />,
          description: 'Performance metrics and reports'
        },
        {
          href: '/tickets',
          label: 'All Tickets',
          icon: <Ticket className="h-5 w-5" />,
          badge: '45',
          description: 'System-wide ticket overview'
        },
        {
          href: '/users',
          label: 'Users',
          icon: <Users className="h-5 w-5" />,
          description: 'Manage users and permissions'
        },
        {
          href: '/agents',
          label: 'Agents',
          icon: <User className="h-5 w-5" />,
          description: 'Agent management and performance'
        },
        {
          href: '/reports',
          label: 'Reports',
          icon: <TrendingUp className="h-5 w-5" />,
          description: 'Generate custom reports'
        },
        {
          href: '/settings',
          label: 'Settings',
          icon: <Settings className="h-5 w-5" />,
          description: 'System configuration'
        }
      ]
    }
    return []
  }

  const navItems = getNavItems()

  const isActiveLink = (href: string): boolean => {
    if (href === '/dashboard' || href === '/agent-dashboard' || href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                SupportAI
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors group',
                  isActiveLink(item.href)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'transition-colors',
                    isActiveLink(item.href)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                  )}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={isActiveLink(item.href) ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Pro Tip</span>
              </div>
              <p className="text-xs text-white/90">
                Use keyboard shortcuts to navigate faster. Press &lsquo;?&rsquo; to see all shortcuts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
