export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'customer' | 'agent' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_seen: string | null
          is_online: boolean
          department: string | null
          phone: string | null
          timezone: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'customer' | 'agent' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_seen?: string | null
          is_online?: boolean
          department?: string | null
          phone?: string | null
          timezone?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'customer' | 'agent' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_seen?: string | null
          is_online?: boolean
          department?: string | null
          phone?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          plan: 'starter' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          plan?: 'starter' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          plan?: 'starter' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
          settings?: Json | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          id: string
          ticket_id: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          category: string
          customer_id: string
          agent_id: string | null
          organization_id: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
          first_response_at: string | null
          tags: string[] | null
          metadata: Json | null
          estimated_resolution: string | null
        }
        Insert: {
          id?: string
          ticket_id: string
          title: string
          description: string
          status?: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          category: string
          customer_id: string
          agent_id?: string | null
          organization_id?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          first_response_at?: string | null
          tags?: string[] | null
          metadata?: Json | null
          estimated_resolution?: string | null
        }
        Update: {
          id?: string
          ticket_id?: string
          title?: string
          description?: string
          status?: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          category?: string
          customer_id?: string
          agent_id?: string | null
          organization_id?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          first_response_at?: string | null
          tags?: string[] | null
          metadata?: Json | null
          estimated_resolution?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          ticket_id: string
          sender_id: string
          content: string
          message_type: 'message' | 'note' | 'system'
          created_at: string
          updated_at: string
          attachments: Json | null
          metadata: Json | null
          is_ai_generated: boolean
          sentiment_score: number | null
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_id: string
          content: string
          message_type?: 'message' | 'note' | 'system'
          created_at?: string
          updated_at?: string
          attachments?: Json | null
          metadata?: Json | null
          is_ai_generated?: boolean
          sentiment_score?: number | null
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_id?: string
          content?: string
          message_type?: 'message' | 'note' | 'system'
          created_at?: string
          updated_at?: string
          attachments?: Json | null
          metadata?: Json | null
          is_ai_generated?: boolean
          sentiment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          }
        ]
      }
      attachments: {
        Row: {
          id: string
          message_id: string
          filename: string
          file_size: number
          file_type: string
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          filename: string
          file_size: number
          file_type: string
          file_url: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          filename?: string
          file_size?: number
          file_type?: string
          file_url?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_message_id_fkey"
            columns: ["message_id"]
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
