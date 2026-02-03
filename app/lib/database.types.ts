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
            profiles: {
                Row: {
                    id: string
                    email: string
                    role: 'admin' | 'psychologist' | 'patient'
                    full_name: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role: 'admin' | 'psychologist' | 'patient'
                    full_name?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'admin' | 'psychologist' | 'patient'
                    full_name?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            psychologists: {
                Row: {
                    id: string
                    name: string
                    title: string
                    bio: string | null
                    specializations: string[]
                    education: string[]
                    years_of_experience: number
                    availability: string | null
                    price: number
                    image_url: string | null
                    location: string | null
                    languages: string[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    title: string
                    bio?: string | null
                    specializations?: string[]
                    education?: string[]
                    years_of_experience?: number
                    availability?: string | null
                    price: number
                    image_url?: string | null
                    location?: string | null
                    languages?: string[]
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    title?: string
                    bio?: string | null
                    specializations?: string[]
                    education?: string[]
                    years_of_experience?: number
                    availability?: string | null
                    price?: number
                    image_url?: string | null
                    location?: string | null
                    languages?: string[]
                    created_at?: string
                }
                Relationships: []
            }
            availability: {
                Row: {
                    id: string
                    psychologist_id: string
                    day_of_week: number
                    start_time: string
                    end_time: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    psychologist_id: string
                    day_of_week: number
                    start_time: string
                    end_time: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    psychologist_id?: string
                    day_of_week?: number
                    start_time?: string
                    end_time?: string
                    created_at?: string
                }
                Relationships: []
            }
            bookings: {
                Row: {
                    id: string
                    psychologist_id: string
                    user_name: string
                    user_email: string
                    user_phone: string
                    start_time: string
                    status: 'pending' | 'confirmed' | 'cancelled'
                    payment_id: string | null
                    payment_status: string | null
                    amount: number
                    meeting_link: string | null
                    calendar_event_id: string | null
                    created_at: string
                    user_job_status: string | null
                    user_is_physically_challenged: boolean | null
                    user_gender: string | null
                }
                Insert: {
                    id?: string
                    psychologist_id: string
                    user_name: string
                    user_email: string
                    user_phone: string
                    start_time: string
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    payment_id?: string | null
                    payment_status?: string | null
                    amount: number
                    meeting_link?: string | null
                    calendar_event_id?: string | null
                    created_at?: string
                    user_job_status?: string | null
                    user_is_physically_challenged?: boolean | null
                    user_gender?: string | null
                }
                Update: {
                    id?: string
                    psychologist_id?: string
                    user_name?: string
                    user_email?: string
                    user_phone?: string
                    start_time?: string
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    payment_id?: string | null
                    payment_status?: string | null
                    amount?: number
                    meeting_link?: string | null
                    calendar_event_id?: string | null
                    created_at?: string
                    user_job_status?: string | null
                    user_is_physically_challenged?: boolean | null
                    user_gender?: string | null
                }
                Relationships: []
            }
            sessions: {
                Row: {
                    id: string
                    booking_id: string
                    psychologist_id: string
                    patient_id: string | null
                    notes: string | null
                    tags: string[]
                    mood_rating: number | null
                    prescription: string | null
                    is_locked: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    psychologist_id: string
                    patient_id?: string | null
                    notes?: string | null
                    tags?: string[]
                    mood_rating?: number | null
                    prescription?: string | null
                    is_locked?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    booking_id?: string
                    psychologist_id?: string
                    patient_id?: string | null
                    notes?: string | null
                    tags?: string[]
                    mood_rating?: number | null
                    prescription?: string | null
                    is_locked?: boolean
                    created_at?: string
                }
                Relationships: []
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
