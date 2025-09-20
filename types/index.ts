import { Database } from './database'

// Export database types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Organization = Database['public']['Tables']['organizations']['Row']
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']

export type Ticket = Database['public']['Tables']['tickets']['Row']
export type TicketInsert = Database['public']['Tables']['tickets']['Insert']
export type TicketUpdate = Database['public']['Tables']['tickets']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']

export type Attachment = Database['public']['Tables']['attachments']['Row']
export type AttachmentInsert = Database['public']['Tables']['attachments']['Insert']
export type AttachmentUpdate = Database['public']['Tables']['attachments']['Update']

// Extended types with relationships
export interface TicketWithRelations extends Ticket {
  customer: User
  agent?: User
  organization?: Organization
  messages?: MessageWithSender[]
  _count?: {
    messages: number
  }
}

export interface MessageWithSender extends Message {
  sender: User
  attachments?: Attachment[]
}

export interface UserWithStats extends User {
  _count?: {
    assignedTickets: number
    resolvedTickets: number
  }
  stats?: {
    averageResponseTime: number
    customerSatisfaction: number
  }
}

// Auth types
export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
}

export interface AuthContextType {
  user: User | null
  session: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, role?: User['role']) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserUpdate>) => Promise<void>
}

// Form types
export interface CreateTicketForm {
  title: string
  description: string
  category: string
  priority?: Ticket['priority']
  attachments?: File[]
}

export interface UpdateTicketForm {
  title?: string
  description?: string
  status?: Ticket['status']
  priority?: Ticket['priority']
  category?: string
  agent_id?: string
  tags?: string[]
}

export interface SendMessageForm {
  content: string
  message_type?: Message['message_type']
  attachments?: File[]
}

export interface UserRegistrationForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  role: User['role']
  department?: string
  phone?: string
}

export interface UserProfileForm {
  fullName: string
  email: string
  phone?: string
  department?: string
  timezone?: string
}

// Dashboard types
export interface DashboardStats {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  resolvedTickets: number
  averageResponseTime: number
  customerSatisfaction: number
  ticketsByPriority: {
    urgent: number
    high: number
    medium: number
    low: number
  }
  ticketsByCategory: Array<{
    category: string
    count: number
  }>
  recentActivity: Array<{
    id: string
    type: 'ticket_created' | 'ticket_updated' | 'message_sent'
    description: string
    timestamp: string
    user: User
  }>
}

export interface AgentStats extends DashboardStats {
  assignedTickets: number
  myResolvedTickets: number
  myAverageResponseTime: number
  myTicketsByStatus: {
    open: number
    inProgress: number
    waitingForCustomer: number
    resolved: number
  }
}

// Filter and sort types
export interface TicketFilters {
  status?: Ticket['status'][]
  priority?: Ticket['priority'][]
  category?: string[]
  agent_id?: string
  customer_id?: string
  date_range?: {
    start: string
    end: string
  }
  search?: string
}

export interface TicketSort {
  field: 'created_at' | 'updated_at' | 'priority' | 'status' | 'title'
  direction: 'asc' | 'desc'
}

export interface PaginationParams {
  page: number
  limit: number
}

// AI types
export interface AIClassification {
  priority: Ticket['priority']
  category: string
  estimatedResolutionTime: string
  confidence: number
}

export interface AISentiment {
  sentiment: 'positive' | 'neutral' | 'negative'
  score: number
  keywords: string[]
}

export interface AIResponse {
  content: string
  confidence: number
  suggestions: string[]
}

export interface AIAgentSuggestion {
  suggestedDepartment: string
  reasoning: string
  confidence: number
}

// Real-time types
export interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: any
  old_record?: any
}

export interface TypingIndicator {
  user_id: string
  ticket_id: string
  is_typing: boolean
  timestamp: string
}

export interface OnlineStatus {
  user_id: string
  is_online: boolean
  last_seen: string
}

// Notification types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  action?: {
    label: string
    url: string
  }
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

export interface ApiResponse<T = any> {
  data?: T
  error?: AppError
  success: boolean
  message?: string
}

// Search types
export interface SearchResult {
  tickets: TicketWithRelations[]
  users: User[]
  messages: MessageWithSender[]
  total: number
}

export interface SearchFilters {
  query: string
  type?: 'tickets' | 'users' | 'messages' | 'all'
  date_range?: {
    start: string
    end: string
  }
}

// Export all database types
export * from './database'
