import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Define constants with fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqczeidsvitoojqebecj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxY3plaWRzdml0b29qcWViZWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjQ4MzcsImV4cCI6MjA3Mzk0MDgzN30.Di8Fedun24cRzWQx6a20QgMVH4ETygiseeLn-Im8_J4'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Create a client for server-side rendering
export const createServerClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
