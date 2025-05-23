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
      doctors: {
        Row: {
          id: string
          name: string
          surname: string
          weekly_hours: number
          is_specialist: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          surname: string
          weekly_hours: number
          is_specialist: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          surname?: string
          weekly_hours?: number
          is_specialist?: boolean
          created_at?: string
        }
      }
      doctor_services: {
        Row: {
          id: string
          doctor_id: string
          service_id: string
          is_preferred: boolean
          created_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          service_id: string
          is_preferred: boolean
          created_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          service_id?: string
          is_preferred?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          time_slot: string
          days: string[]
          doctors_required: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          time_slot: string
          days: string[]
          doctors_required: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          time_slot?: string
          days?: string[]
          doctors_required?: number
          created_at?: string
        }
      }
      unavailability: {
        Row: {
          id: string
          doctor_id: string
          date: string
          time_slot: string
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          date: string
          time_slot: string
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          date?: string
          time_slot?: string
          reason?: string
          created_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          doctor_id: string
          service_id: string
          date: string
          time_slot: string
          created_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          service_id: string
          date: string
          time_slot: string
          created_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          service_id?: string
          date?: string
          time_slot?: string
          created_at?: string
        }
      }
    }
  }
}