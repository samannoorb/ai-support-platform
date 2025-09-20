import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
        secondary:
          'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        destructive:
          'border-transparent bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
        success:
          'border-transparent bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
        warning:
          'border-transparent bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
        outline: 'text-slate-950 border-slate-200 dark:text-slate-50 dark:border-slate-700',
        // Ticket status variants
        open: 'border-transparent bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
        'in-progress': 'border-transparent bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
        'waiting-for-customer': 'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        resolved: 'border-transparent bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
        closed: 'border-transparent bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
        // Priority variants
        urgent: 'border-transparent bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
        high: 'border-transparent bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
        medium: 'border-transparent bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
        low: 'border-transparent bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
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