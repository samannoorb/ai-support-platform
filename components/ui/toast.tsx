'use client'

import * as React from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps extends Toast {
  onRemove: (id: string) => void
}

const ToastComponent: React.FC<ToastProps> = ({
  id,
  title,
  description,
  type,
  action,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = React.useState(true)

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <XCircle className="h-5 w-5" />
      case 'warning':
        return <AlertCircle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-success-200 bg-success-50 text-success-800 dark:border-success-800 dark:bg-success-900 dark:text-success-200'
      case 'error':
        return 'border-danger-200 bg-danger-50 text-danger-800 dark:border-danger-800 dark:bg-danger-900 dark:text-danger-200'
      case 'warning':
        return 'border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-800 dark:bg-warning-900 dark:text-warning-200'
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(id), 300)
  }

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        getStyles(),
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-sm opacity-90">{description}</p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={handleRemove}
              className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-75"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}

// Toast Context and Hook
interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration (default 5 seconds)
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  const success = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'success' })
  }, [addToast])

  const error = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'error' })
  }, [addToast])

  const warning = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'warning' })
  }, [addToast])

  const info = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'info' })
  }, [addToast])

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }),
    [toasts, addToast, removeToast, success, error, warning, info]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export { ToastComponent, ToastContainer }
