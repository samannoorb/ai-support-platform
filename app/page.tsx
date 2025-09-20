import Link from 'next/link'
import { 
  ArrowRight, 
  MessageSquare, 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  BarChart3,
  CheckCircle,
  Star,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'AI-Powered Intelligence',
      description: 'Automatic ticket classification, sentiment analysis, and smart response suggestions using Google Gemini AI.'
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Real-time Chat',
      description: 'Instant messaging with typing indicators, file sharing, and seamless agent-customer communication.'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Fast Response Times',
      description: 'Reduce response times by 60% with AI-assisted agent workflows and automated routing.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with row-level security, encryption, and compliance-ready infrastructure.'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with performance metrics, satisfaction scores, and trend analysis.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Multi-role Support',
      description: 'Separate interfaces for customers, agents, and administrators with role-based permissions.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Customer Success Manager',
      company: 'TechCorp',
      content: 'SupportAI reduced our response times by 70% and improved customer satisfaction significantly.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Head of Support',
      company: 'StartupXYZ',
      content: 'The AI-powered ticket classification is incredibly accurate and saves our team hours daily.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Operations Director',
      company: 'Enterprise Inc',
      content: 'Best customer support platform we\'ve used. The real-time features are game-changing.',
      rating: 5
    }
  ]

  const stats = [
    { label: 'Response Time Reduction', value: '70%' },
    { label: 'Customer Satisfaction', value: '4.8/5' },
    { label: 'Tickets Resolved Daily', value: '10K+' },
    { label: 'Active Users', value: '50K+' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6">
              AI-Powered Customer
              <span className="gradient-text block">Support Platform</span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-8 max-w-3xl mx-auto">
              Transform your customer support with intelligent ticket classification, real-time chat, 
              and AI-powered response suggestions. Built with Next.js, Supabase, and Google Gemini AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Powerful Features for Modern Support
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-elevated transition-shadow">
                <CardContent className="p-6">
                  <div className="text-primary-600 dark:text-primary-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Loved by Support Teams Worldwide
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
              See what our customers say about their experience with SupportAI
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-secondary-700 dark:text-secondary-300 mb-4">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-secondary-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Support?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using SupportAI to deliver exceptional customer experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SupportAI</span>
              </div>
              <p className="text-secondary-400">
                AI-powered customer support platform for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400">
              © 2024 SupportAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-secondary-400 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-secondary-400 hover:text-white">Terms</Link>
              <Link href="/cookies" className="text-secondary-400 hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
