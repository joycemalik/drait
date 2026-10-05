// Generated from the live Supabase schema. Regenerate after migrations with: npm run db:types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      academic_resources: {
        Row: {
          created_at: string
          department: string
          id: string
          kind: string
          semester: number
          subject: string
          submitted_by: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          department: string
          id?: string
          kind?: string
          semester: number
          subject: string
          submitted_by?: string | null
          title: string
          url: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          kind?: string
          semester?: number
          subject?: string
          submitted_by?: string | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_resources_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          achieved_on: string
          category: string
          club_id: string | null
          created_at: string
          description: string
          id: string
          link: string | null
          people: string
          submitted_by: string | null
          team: string | null
          title: string
          verified: boolean
        }
        Insert: {
          achieved_on: string
          category?: string
          club_id?: string | null
          created_at?: string
          description?: string
          id?: string
          link?: string | null
          people: string
          submitted_by?: string | null
          team?: string | null
          title: string
          verified?: boolean
        }
        Update: {
          achieved_on?: string
          category?: string
          club_id?: string | null
          created_at?: string
          description?: string
          id?: string
          link?: string | null
          people?: string
          submitted_by?: string | null
          team?: string | null
          title?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "achievements_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string
          club_id: string
          created_at: string
          id: string
          pinned: boolean
          priority: string
          title: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body?: string
          club_id: string
          created_at?: string
          id?: string
          pinned?: boolean
          priority?: string
          title: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string
          club_id?: string
          created_at?: string
          id?: string
          pinned?: boolean
          priority?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          club_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          club_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          category: string
          color: string
          created_at: string
          description: string
          external_link: string | null
          featured: boolean
          founded_year: number | null
          id: string
          instagram_link: string | null
          leads: Json
          member_count: number
          name: string
          short_name: string
          slug: string
          tagline: string
          tags: string[]
        }
        Insert: {
          category: string
          color?: string
          created_at?: string
          description?: string
          external_link?: string | null
          featured?: boolean
          founded_year?: number | null
          id?: string
          instagram_link?: string | null
          leads?: Json
          member_count?: number
          name: string
          short_name: string
          slug: string
          tagline?: string
          tags?: string[]
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          description?: string
          external_link?: string | null
          featured?: boolean
          founded_year?: number | null
          id?: string
          instagram_link?: string | null
          leads?: Json
          member_count?: number
          name?: string
          short_name?: string
          slug?: string
          tagline?: string
          tags?: string[]
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          author_id: string
          body: string
          created_at: string
          discussion_id: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          discussion_id: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          discussion_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions_view"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_votes: {
        Row: {
          created_at: string
          discussion_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_votes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_votes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          author_id: string | null
          author_name: string | null
          author_year: string | null
          body: string
          category: string
          created_at: string
          id: string
          pinned: boolean
          solved: boolean
          subcategory: string
          tags: string[]
          title: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          author_year?: string | null
          body?: string
          category?: string
          created_at?: string
          id?: string
          pinned?: boolean
          solved?: boolean
          subcategory?: string
          tags?: string[]
          title: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          author_year?: string | null
          body?: string
          category?: string
          created_at?: string
          id?: string
          pinned?: boolean
          solved?: boolean
          subcategory?: string
          tags?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          club_id: string
          created_at: string
          created_by: string | null
          description: string
          ends_at: string | null
          featured: boolean
          id: string
          image_url: string | null
          max_seats: number | null
          registration_link: string | null
          starts_at: string
          tags: string[]
          title: string
          type: string
          venue: string
        }
        Insert: {
          club_id: string
          created_at?: string
          created_by?: string | null
          description?: string
          ends_at?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          max_seats?: number | null
          registration_link?: string | null
          starts_at: string
          tags?: string[]
          title: string
          type?: string
          venue?: string
        }
        Update: {
          club_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          ends_at?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          max_seats?: number | null
          registration_link?: string | null
          starts_at?: string
          tags?: string[]
          title?: string
          type?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          created_at: string
          deadline: string
          description: string
          eligibility: string
          featured: boolean
          id: string
          link: string
          organizer: string
          prize: string | null
          stipend: string | null
          tags: string[]
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          deadline: string
          description?: string
          eligibility?: string
          featured?: boolean
          id?: string
          link?: string
          organizer: string
          prize?: string | null
          stipend?: string | null
          tags?: string[]
          title: string
          type: string
        }
        Update: {
          created_at?: string
          deadline?: string
          description?: string
          eligibility?: string
          featured?: boolean
          id?: string
          link?: string
          organizer?: string
          prize?: string | null
          stipend?: string | null
          tags?: string[]
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch: string | null
          created_at: string
          full_name: string | null
          id: string
          is_site_admin: boolean
          is_verified_student: boolean
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_site_admin?: boolean
          is_verified_student?: boolean
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_site_admin?: boolean
          is_verified_student?: boolean
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      achievements_view: {
        Row: {
          achieved_on: string | null
          category: string | null
          club_color: string | null
          club_id: string | null
          club_name: string | null
          club_slug: string | null
          created_at: string | null
          description: string | null
          id: string | null
          link: string | null
          people: string | null
          submitted_by: string | null
          team: string | null
          title: string | null
          verified: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements_view: {
        Row: {
          author_display: string | null
          author_id: string | null
          author_name: string | null
          body: string | null
          club_color: string | null
          club_id: string | null
          club_name: string | null
          club_slug: string | null
          created_at: string | null
          id: string | null
          pinned: boolean | null
          priority: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions_view: {
        Row: {
          author_display: string | null
          author_id: string | null
          author_name: string | null
          author_year: string | null
          author_year_display: string | null
          body: string | null
          category: string | null
          created_at: string | null
          id: string | null
          pinned: boolean | null
          reply_count: number | null
          solved: boolean | null
          subcategory: string | null
          tags: string[] | null
          title: string | null
          upvotes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events_view: {
        Row: {
          club_color: string | null
          club_id: string | null
          club_name: string | null
          club_slug: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          ends_at: string | null
          featured: boolean | null
          id: string | null
          image_url: string | null
          max_seats: number | null
          registration_link: string | null
          rsvp_count: number | null
          starts_at: string | null
          tags: string[] | null
          title: string | null
          type: string | null
          venue: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
