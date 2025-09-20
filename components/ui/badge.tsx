import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
        secondary:
          'border-transparent bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200',
        destructive:
          'border-transparent bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
        success:
          'border-transparent bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
        warning:
          'border-transparent bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
        outline: 'text-gray-950 border-gray-200 dark:text-gray-50 dark:border-gray-700',
        // Ticket status variants
        open: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'in-progress': 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'waiting-for-customer': 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        resolved: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        closed: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        // Priority variants
        urgent: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        high: 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        medium: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        low: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
