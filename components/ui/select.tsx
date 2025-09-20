import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  label?: string
  error?: string
  helper?: string
  disabled?: boolean
  className?: string
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ value, onValueChange, placeholder, options, label, error, helper, disabled, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const selectId = React.useId()
    const selectedOption = options.find(option => option.value === value)

    const handleSelect = (optionValue: string) => {
      onValueChange?.(optionValue)
      setIsOpen(false)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(!isOpen)
      } else if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    return (
      <div className="relative space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <button
          ref={ref}
          id={selectId}
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-primary-400',
            error && 'border-danger-500 focus:ring-danger-500 dark:border-danger-400 dark:focus:ring-danger-400',
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={cn('block truncate', !selectedOption && 'text-gray-500 dark:text-gray-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
            <ul className="max-h-60 overflow-auto py-1" role="listbox">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={cn(
                      'relative flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                      option.disabled && 'cursor-not-allowed opacity-50',
                      value === option.value && 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                    )}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={value === option.value}
                  >
                    <span className="block truncate">{option.label}</span>
                    {value === option.value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {helper && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>
        )}
        {error && (
          <p className="text-xs text-danger-600 dark:text-danger-400">{error}</p>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
