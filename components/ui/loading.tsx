import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  return (
    <svg
      className={cn('animate-spin text-primary-600', sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullPage?: boolean
  className?: string
}

const Loading: React.FC<LoadingProps> = ({ 
  text = 'Loading...', 
  size = 'md', 
  fullPage = false, 
  className 
}) => {
  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80'
    : 'flex items-center justify-center p-4'

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-2">
        <LoadingSpinner size={size} />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    </div>
  )
}

const LoadingButton: React.FC<{ loading?: boolean; children: React.ReactNode }> = ({ 
  loading = false, 
  children 
}) => {
  return (
    <>
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </>
  )
}

const LoadingOverlay: React.FC<{ show: boolean; text?: string }> = ({ 
  show, 
  text = 'Loading...' 
}) => {
  if (!show) return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex flex-col items-center space-y-2">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  )
}

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  )
}

const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-3">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-4 w-1/2" />
        <div className="space-y-2">
          <SkeletonLoader className="h-3 w-full" />
          <SkeletonLoader className="h-3 w-full" />
          <SkeletonLoader className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}

const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonLoader key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { 
  Loading, 
  LoadingSpinner, 
  LoadingButton, 
  LoadingOverlay,
  SkeletonLoader,
  SkeletonCard,
  SkeletonTable
}
