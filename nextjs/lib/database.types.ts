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
      conversations: {
        Row: {
          id: string
          conversation_id: string
          agent_id: string | null
          voice_description: string | null
          agent_description: string | null
          transcript: string | null
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          agent_id?: string | null
          voice_description?: string | null
          agent_description?: string | null
          transcript?: string | null
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          agent_id?: string | null
          voice_description?: string | null
          agent_description?: string | null
          transcript?: string | null
          created_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_summaries: {
        Row: {
          id: string
          date: string
          summary: string
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          date: string
          summary: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          date?: string
          summary?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transcripts: {
        Row: {
          id: string
          conversation_id: string
          role: string
          message: string
          time_in_call_secs: number | null
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          message: string
          time_in_call_secs?: number | null
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          message?: string
          time_in_call_secs?: number | null
          created_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
  }
}
