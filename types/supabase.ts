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
          full_name: string | null
          avatar_url: string | null
          provider: string | null
          provider_id: string | null
          created_at: string
          updated_at: string
          email_verified: boolean
          last_sign_in: string | null
          subscription_status: string | null
          subscription_tier: string | null
          subscription_expires_at: string | null
          total_subscriptions_saved: number | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          provider_id?: string | null
          created_at?: string
          updated_at?: string
          email_verified?: boolean
          last_sign_in?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          subscription_expires_at?: string | null
          total_subscriptions_saved?: number | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          provider_id?: string | null
          created_at?: string
          updated_at?: string
          email_verified?: boolean
          last_sign_in?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          subscription_expires_at?: string | null
          total_subscriptions_saved?: number | null
        }
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
  }
} 