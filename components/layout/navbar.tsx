'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  Menu, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut,
  Search,
  MessageSquare,
  Ticket,
  ChevronDown
} from 'lucide-react'
import { useAuth, useRoleAccess } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, getInitials } from '@/lib/utils'

interface NavbarProps {
  onMobileMenuToggle: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, signOut } = useAuth()
  const { isCustomer, isAgent, isAdmin } = useRoleAccess()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const getNavLinks = () => {
    if (isCustomer()) {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: <Ticket className="h-4 w-4" /> },
        { href: '/tickets', label: 'My Tickets', icon: <MessageSquare className="h-4 w-4" /> },
        { href: '/create-ticket', label: 'New Ticket', icon: <Ticket className="h-4 w-4" /> },
      ]
    } else if (isAgent()) {
      return [
        { href: '/agent-dashboard', label: 'Dashboard', icon: <Ticket className="h-4 w-4" /> },
        { href: '/tickets', label: 'All Tickets', icon: <MessageSquare className="h-4 w-4" /> },
        { href: '/my-tickets', label: 'My Tickets', icon: <User className="h-4 w-4" /> },
      ]
    } else if (isAdmin()) {
      return [
        { href: '/admin', label: 'Admin Panel', icon: <Settings className="h-4 w-4" /> },
        { href: '/tickets', label: 'All Tickets', icon: <MessageSquare className="h-4 w-4" /> },
        { href: '/users', label: 'Users', icon: <User className="h-4 w-4" /> },
        { href: '/analytics', label: 'Analytics', icon: <Ticket className="h-4 w-4" /> },
      ]
    }
    return []
  }

  if (!user) {
    return (
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-9 w-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
                  SupportAI
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/login">
                <Button variant="ghost" className="text-slate-700 dark:text-slate-300">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="shadow-lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const navLinks = getNavLinks()

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuToggle}
              className="lg:hidden mr-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
                SupportAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Search, Notifications, and User Menu */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-down">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h3>
                  </div>
                  <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    <div className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-slate-100">
                          New ticket assigned: #TKT-12345
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-slate-100">
                          Ticket resolved: #TKT-12340
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-warning-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-slate-100">
                          New message from customer
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          3 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                  {getInitials(user.full_name)}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user.full_name}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-down">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </nav>
  )
}

export default Navbar