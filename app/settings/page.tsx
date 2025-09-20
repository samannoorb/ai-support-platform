'use client'

import React, { useState } from 'react'
import { Save, Bell, Shield, Globe, Database, Mail, Smartphone, Palette, Monitor } from 'lucide-react'
import { useAuth, ProtectedRoute } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SettingsPage = () => {
  const { user } = useAuth()
  const { success: showSuccess } = useToast()
  const [loading, setLoading] = useState(false)

  // System settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'SupportAI',
    siteDescription: 'AI-powered customer support platform',
    defaultLanguage: 'en',
    timezone: 'UTC',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    
    // Security Settings
    sessionTimeout: '30',
    passwordMinLength: '8',
    requireTwoFactor: false,
    allowRegistration: true,
    
    // Business Settings
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'UTC'
    },
    autoAssignment: true,
    maxTicketsPerAgent: '20',
    
    // AI Settings
    aiAutoClassification: true,
    aiResponseSuggestions: true,
    aiSentimentAnalysis: true,
    
    // Appearance
    theme: 'system',
    primaryColor: 'emerald',
    compactMode: false
  })

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' }
  ]

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
  ]

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ]

  const colorOptions = [
    { value: 'emerald', label: 'Emerald (Current)' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'indigo', label: 'Indigo' },
    { value: 'teal', label: 'Teal' }
  ]

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      // Here you would make API calls to save the settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Settings saved', `${section} settings have been updated successfully.`)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const SettingSection = ({ title, description, icon, children }: any) => (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 font-normal">
              {description}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            System Settings
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Configure system-wide settings and preferences
          </p>
        </div>

        {/* General Settings */}
        <SettingSection
          title="General Settings"
          description="Basic system configuration"
          icon={<Globe className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Site Name"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
              <Select
                label="Default Language"
                value={settings.defaultLanguage}
                onValueChange={(value) => setSettings(prev => ({ ...prev, defaultLanguage: value }))}
                options={languageOptions}
              />
            </div>
            
            <Textarea
              label="Site Description"
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Default Timezone"
                value={settings.timezone}
                onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                options={timezoneOptions}
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => handleSave('General')} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </div>
          </div>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection
          title="Notification Settings"
          description="Configure system notifications"
          icon={<Bell className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      Email Notifications
                    </label>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      Send notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      SMS Notifications
                    </label>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      Send notifications via SMS
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      Push Notifications
                    </label>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      Browser push notifications
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      Weekly Reports
                    </label>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      Send weekly performance reports
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={(e) => setSettings(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => handleSave('Notifications')} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </div>
        </SettingSection>

        {/* Security Settings */}
        <SettingSection
          title="Security Settings"
          description="Configure security and authentication"
          icon={<Shield className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              />
              <Input
                label="Minimum Password Length"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings(prev => ({ ...prev, passwordMinLength: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    Require Two-Factor Authentication
                  </label>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    Enforce 2FA for all users
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireTwoFactor}
                  onChange={(e) => setSettings(prev => ({ ...prev, requireTwoFactor: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    Allow Public Registration
                  </label>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    Allow users to self-register
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowRegistration: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => handleSave('Security')} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </div>
        </SettingSection>

        {/* Appearance Settings */}
        <SettingSection
          title="Appearance"
          description="Customize the look and feel"
          icon={<Palette className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Theme"
                value={settings.theme}
                onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
                options={themeOptions}
              />
              <Select
                label="Primary Color"
                value={settings.primaryColor}
                onValueChange={(value) => setSettings(prev => ({ ...prev, primaryColor: value }))}
                options={colorOptions}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  Compact Mode
                </label>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  Use smaller spacing and elements
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => setSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => handleSave('Appearance')} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Appearance Settings
              </Button>
            </div>
          </div>
        </SettingSection>

        {/* System Status */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Uptime</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">2.4GB</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Storage Used</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">45.2K</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">API Calls</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

export default SettingsPage
