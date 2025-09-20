'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { error: showError, success: showSuccess } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      showSuccess('Welcome back!', 'You have been signed in successfully.')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      showError(
        'Sign in failed',
        error.message || 'Please check your credentials and try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              SupportAI
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('email')}
                  type="email"
                  label="Email address"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className="w-full"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.312-.623-.312-1.544c0-1.445.839-2.524 1.883-2.524.888 0 1.317.666 1.317 1.466 0 .893-.568 2.228-.861 3.467-.245 1.035.52 1.88 1.543 1.88 1.852 0 3.275-1.952 3.275-4.768 0-2.494-1.79-4.237-4.349-4.237-2.962 0-4.702 2.221-4.702 4.516 0 .894.344 1.854.774 2.375.085.103.097.194.072.299-.079.33-.254 1.037-.289 1.183-.045.189-.147.229-.339.138-1.273-.593-2.068-2.456-2.068-3.956 0-3.282 2.386-6.296 6.885-6.296 3.615 0 6.427 2.576 6.427 6.019 0 3.591-2.262 6.478-5.401 6.478-1.055 0-2.048-.548-2.386-1.272 0 0-.522 1.987-.649 2.473-.235.897-.869 2.017-1.293 2.699.974.301 2.005.465 3.077.465 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017.001z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Demo Credentials
            </h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p><strong>Customer:</strong> customer@demo.com / demo123</p>
              <p><strong>Agent:</strong> agent@demo.com / demo123</p>
              <p><strong>Admin:</strong> admin@demo.com / demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
