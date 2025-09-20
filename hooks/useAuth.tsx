'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User, AuthContextType } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        const userData = await fetchUserProfile(session.user.id)
        setUser(userData)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          const userData = await fetchUserProfile(session.user.id)
          setUser(userData)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: User['role'] = 'customer'
  ): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        }
      }
    })

    if (error) {
      throw error
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        throw profileError
      }
    }
  }

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in')
    }

    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', user.id)

    if (error) {
      throw error
    }

    // Update local user state
    setUser(prev => prev ? { ...prev, ...data } : null)
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected route wrapper
export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode
  allowedRoles?: User['role'][]
  fallback?: React.ReactNode
}> = ({ children, allowedRoles, fallback }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return fallback || <div>Please log in to access this page.</div>
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>You don't have permission to access this page.</div>
  }

  return <>{children}</>
}

// Role-based access control hook
export const useRoleAccess = () => {
  const { user } = useAuth()

  const hasRole = (roles: User['role'] | User['role'][]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const isCustomer = (): boolean => hasRole('customer')
  const isAgent = (): boolean => hasRole('agent')
  const isAdmin = (): boolean => hasRole('admin')
  const isStaff = (): boolean => hasRole(['agent', 'admin'])

  return {
    hasRole,
    isCustomer,
    isAgent,
    isAdmin,
    isStaff,
    user,
  }
}
