'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useTickets } from '@/hooks/useTickets'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.string().min(1, 'Please select a category'),
})

type CreateTicketForm = z.infer<typeof createTicketSchema>

const CreateTicketPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { error: showError, success: showSuccess } = useToast()
  const { createTicket } = useTickets()
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: 'medium',
      category: '',
    },
  })

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  const categoryOptions = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Payment' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'account', label: 'Account Issue' },
    { value: 'general', label: 'General Support' },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showError('File too large', `${file.name} is larger than 5MB`)
        return false
      }
      return true
    })
    
    setAttachments(prev => [...prev, ...validFiles])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreateTicketForm) => {
    if (!user) {
      showError('Authentication required', 'Please sign in to create a ticket')
      return
    }

    setIsLoading(true)
    try {
      // Create the ticket with real data
      await createTicket({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        attachments: attachments
      })
      
      showSuccess('Ticket created successfully!', 'Your support request has been submitted.')
      router.push('/tickets')
    } catch (error: any) {
      console.error('Error creating ticket:', error)
      showError('Failed to create ticket', error.message || 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300'
    }
  }

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/tickets">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Create Support Ticket
            </h1>
            <p className="mt-1 text-secondary-600 dark:text-secondary-400">
              Describe your issue and we'll get back to you soon
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <Input
                  {...register('title')}
                  label="Title"
                  placeholder="Brief description of your issue"
                  error={errors.title?.message}
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Category"
                    value={watch('category')}
                    onValueChange={(value) => setValue('category', value)}
                    options={categoryOptions}
                    error={errors.category?.message}
                    placeholder="Select a category"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Priority
                  </label>
                  <Select
                    value={watch('priority')}
                    onValueChange={(value) => setValue('priority', value as any)}
                    options={priorityOptions}
                  />
                  <div className="mt-2">
                    <Badge className={getPriorityColor(watch('priority'))}>
                      {watch('priority')} Priority
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Textarea
                  {...register('description')}
                  label="Description"
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  error={errors.description?.message}
                />
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                  <p className="text-xs text-secondary-500 mt-2">
                    Max 5MB per file. Supported: Images, PDF, DOC, TXT
                  </p>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/20 rounded flex items-center justify-center">
                            <Upload className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                              {file.name}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/tickets">
                  <Button variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" loading={isLoading} disabled={isLoading}>
                  Create Ticket
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-2">
                  Tips for getting faster support
                </h4>
                <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                  <li>• Be specific about the issue you're experiencing</li>
                  <li>• Include steps to reproduce the problem</li>
                  <li>• Attach relevant screenshots or files</li>
                  <li>• Select the appropriate priority level</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

export default CreateTicketPage
