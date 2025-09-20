'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff, Save } from 'lucide-react'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const { error: showError, success: showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsLoading(true)
    try {
      await updateProfile({
        full_name: data.fullName,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
      })
      showSuccess('Profile updated successfully!', 'Your changes have been saved.')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      showError('Failed to update profile', error.message || 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsPasswordLoading(true)
    try {
      // Here you would typically call your API to update the password
      console.log('Updating password...')
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      showSuccess('Password updated successfully!', 'Your password has been changed.')
      passwordForm.reset()
    } catch (error: any) {
      console.error('Error updating password:', error)
      showError('Failed to update password', error.message || 'Please try again.')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'agent':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300'
      case 'customer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300'
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Profile Settings
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1 border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="h-20 w-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {user?.full_name || 'User'}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {user?.email}
                </p>
              </div>
              
              <div className="space-y-3">
                <Badge className={getRoleBadgeColor(user?.role || 'customer')}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
                
                <div className="text-xs text-secondary-500 space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      {...profileForm.register('fullName')}
                      label="Full Name"
                      icon={<User className="h-4 w-4" />}
                      error={profileForm.formState.errors.fullName?.message}
                    />
                    
                    <Input
                      {...profileForm.register('email')}
                      label="Email Address"
                      type="email"
                      icon={<Mail className="h-4 w-4" />}
                      error={profileForm.formState.errors.email?.message}
                      disabled
                      className="bg-secondary-50 dark:bg-secondary-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      {...profileForm.register('phone')}
                      label="Phone Number"
                      icon={<Phone className="h-4 w-4" />}
                      placeholder="(555) 123-4567"
                      error={profileForm.formState.errors.phone?.message}
                    />
                    
                    <Input
                      {...profileForm.register('location')}
                      label="Location"
                      icon={<MapPin className="h-4 w-4" />}
                      placeholder="City, Country"
                      error={profileForm.formState.errors.location?.message}
                    />
                  </div>

                  <Textarea
                    {...profileForm.register('bio')}
                    label="Bio"
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                    error={profileForm.formState.errors.bio?.message}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" loading={isLoading} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Form */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="relative">
                    <Input
                      {...passwordForm.register('currentPassword')}
                      type={showCurrentPassword ? 'text' : 'password'}
                      label="Current Password"
                      error={passwordForm.formState.errors.currentPassword?.message}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-secondary-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-secondary-400" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      {...passwordForm.register('newPassword')}
                      type={showNewPassword ? 'text' : 'password'}
                      label="New Password"
                      error={passwordForm.formState.errors.newPassword?.message}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-secondary-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-secondary-400" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      {...passwordForm.register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirm New Password"
                      error={passwordForm.formState.errors.confirmPassword?.message}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-secondary-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-secondary-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" loading={isPasswordLoading} disabled={isPasswordLoading}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ProfilePage
