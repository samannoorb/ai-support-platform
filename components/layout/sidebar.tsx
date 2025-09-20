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
  Inbox,
  X
} from 'lucide-react'
import { useRoleAccess } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 dark:bg-slate-900/80 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
                SupportAI
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActiveLink(item.href)
                    ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border border-primary-200 shadow-sm dark:from-primary-900/20 dark:to-accent-900/20 dark:text-primary-300 dark:border-primary-800'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'transition-colors',
                    isActiveLink(item.href)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400'
                  )}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={isActiveLink(item.href) ? 'default' : 'secondary'}
                          className="text-xs px-2 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Pro Tip</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
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