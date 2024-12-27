export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          certifications: string[] | null
          created_at: string
          current_company: string | null
          current_position: string | null
          education: Json[] | null
          email: string | null
          experience_years: number | null
          first_name: string
          id: string
          image_url: string | null
          languages: string[] | null
          last_name: string
          location: string | null
          project_id: string
          skills: string[] | null
          summary: string | null
          updated_at: string
          work_history: Json[] | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          education?: Json[] | null
          email?: string | null
          experience_years?: number | null
          first_name: string
          id?: string
          image_url?: string | null
          languages?: string[] | null
          last_name: string
          location?: string | null
          project_id: string
          skills?: string[] | null
          summary?: string | null
          updated_at?: string
          work_history?: Json[] | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          education?: Json[] | null
          email?: string | null
          experience_years?: number | null
          first_name?: string
          id?: string
          image_url?: string | null
          languages?: string[] | null
          last_name?: string
          location?: string | null
          project_id?: string
          skills?: string[] | null
          summary?: string | null
          updated_at?: string
          work_history?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["company_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["company_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["company_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          brand_sentiment: number | null
          cover_image_url: string | null
          cover_url: string | null
          created_at: string
          culture_score: number | null
          culture_type: string | null
          description: string | null
          employee_count_max: number | null
          employee_count_min: number | null
          funding_amount: number | null
          funding_stage: string | null
          headquarters: string | null
          headquarters_city: string | null
          headquarters_country: string | null
          id: string
          industry: string | null
          logo_image_url: string | null
          logo_url: string | null
          name: string
          other_locations: string[] | null
          revenue_growth: number | null
          revenue_growth_percentage: number | null
          size_range: number | null
          specialties: string[] | null
          team_growth: number | null
          team_growth_percentage: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          brand_sentiment?: number | null
          cover_image_url?: string | null
          cover_url?: string | null
          created_at?: string
          culture_score?: number | null
          culture_type?: string | null
          description?: string | null
          employee_count_max?: number | null
          employee_count_min?: number | null
          funding_amount?: number | null
          funding_stage?: string | null
          headquarters?: string | null
          headquarters_city?: string | null
          headquarters_country?: string | null
          id?: string
          industry?: string | null
          logo_image_url?: string | null
          logo_url?: string | null
          name: string
          other_locations?: string[] | null
          revenue_growth?: number | null
          revenue_growth_percentage?: number | null
          size_range?: number | null
          specialties?: string[] | null
          team_growth?: number | null
          team_growth_percentage?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          brand_sentiment?: number | null
          cover_image_url?: string | null
          cover_url?: string | null
          created_at?: string
          culture_score?: number | null
          culture_type?: string | null
          description?: string | null
          employee_count_max?: number | null
          employee_count_min?: number | null
          funding_amount?: number | null
          funding_stage?: string | null
          headquarters?: string | null
          headquarters_city?: string | null
          headquarters_country?: string | null
          id?: string
          industry?: string | null
          logo_image_url?: string | null
          logo_url?: string | null
          name?: string
          other_locations?: string[] | null
          revenue_growth?: number | null
          revenue_growth_percentage?: number | null
          size_range?: number | null
          specialties?: string[] | null
          team_growth?: number | null
          team_growth_percentage?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      global_queries: {
        Row: {
          created_at: string
          current_version_number: number
          parameters: Json
          query_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_version_number?: number
          parameters: Json
          query_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_version_number?: number
          parameters?: Json
          query_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      global_query_versions: {
        Row: {
          candidate_ids: string[]
          created_at: string
          query_hash: string
          version_number: number
        }
        Insert: {
          candidate_ids: string[]
          created_at?: string
          query_hash: string
          version_number: number
        }
        Update: {
          candidate_ids?: string[]
          created_at?: string
          query_hash?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "global_query_versions_query_hash_fkey"
            columns: ["query_hash"]
            isOneToOne: false
            referencedRelation: "global_queries"
            referencedColumns: ["query_hash"]
          },
        ]
      }
      outreach_status: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          project_id: string
          status: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_status_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_status_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          background_cover_image_url: string | null
          birth_date: string | null
          city: string | null
          connections: number | null
          country: string | null
          country_full_name: string | null
          crawler_name: string | null
          first_name: string | null
          follower_count: number | null
          headline: string | null
          id: string
          last_name: string | null
          occupation: string | null
          profile_pic_url: string | null
          state: string | null
          summary: string | null
        }
        Insert: {
          background_cover_image_url?: string | null
          birth_date?: string | null
          city?: string | null
          connections?: number | null
          country?: string | null
          country_full_name?: string | null
          crawler_name?: string | null
          first_name?: string | null
          follower_count?: number | null
          headline?: string | null
          id: string
          last_name?: string | null
          occupation?: string | null
          profile_pic_url?: string | null
          state?: string | null
          summary?: string | null
        }
        Update: {
          background_cover_image_url?: string | null
          birth_date?: string | null
          city?: string | null
          connections?: number | null
          country?: string | null
          country_full_name?: string | null
          crawler_name?: string | null
          first_name?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: string
          last_name?: string | null
          occupation?: string | null
          profile_pic_url?: string | null
          state?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      profile_activity: {
        Row: {
          activity_status: string | null
          id: number
          link: string | null
          profile_id: string | null
          title: string | null
        }
        Insert: {
          activity_status?: string | null
          id?: number
          link?: string | null
          profile_id?: string | null
          title?: string | null
        }
        Update: {
          activity_status?: string | null
          id?: number
          link?: string | null
          profile_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_activity_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_article: {
        Row: {
          author: string | null
          id: number
          image_url: string | null
          link: string | null
          profile_id: string | null
          published_date: number | null
          title: string | null
        }
        Insert: {
          author?: string | null
          id?: number
          image_url?: string | null
          link?: string | null
          profile_id?: string | null
          published_date?: number | null
          title?: string | null
        }
        Update: {
          author?: string | null
          id?: number
          image_url?: string | null
          link?: string | null
          profile_id?: string | null
          published_date?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_article_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_certification: {
        Row: {
          authority: string | null
          display_source: string | null
          ends_at: number | null
          id: number
          license_number: string | null
          name: string | null
          profile_id: string | null
          starts_at: number | null
          url: string | null
        }
        Insert: {
          authority?: string | null
          display_source?: string | null
          ends_at?: number | null
          id?: number
          license_number?: string | null
          name?: string | null
          profile_id?: string | null
          starts_at?: number | null
          url?: string | null
        }
        Update: {
          authority?: string | null
          display_source?: string | null
          ends_at?: number | null
          id?: number
          license_number?: string | null
          name?: string | null
          profile_id?: string | null
          starts_at?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_certification_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_contacts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_course: {
        Row: {
          id: number
          name: string | null
          number: string | null
          profile_id: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          number?: string | null
          profile_id?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          number?: string | null
          profile_id?: string | null
        }
        Relationships: []
      }
      profile_education: {
        Row: {
          activities_and_societies: string | null
          degree_name: string | null
          description: string | null
          ends_at: number | null
          field_of_study: string | null
          grade: string | null
          id: number
          logo_url: string | null
          profile_id: string | null
          school: string | null
          school_profile_url: string | null
          starts_at: number | null
        }
        Insert: {
          activities_and_societies?: string | null
          degree_name?: string | null
          description?: string | null
          ends_at?: number | null
          field_of_study?: string | null
          grade?: string | null
          id?: never
          logo_url?: string | null
          profile_id?: string | null
          school?: string | null
          school_profile_url?: string | null
          starts_at?: number | null
        }
        Update: {
          activities_and_societies?: string | null
          degree_name?: string | null
          description?: string | null
          ends_at?: number | null
          field_of_study?: string | null
          grade?: string | null
          id?: never
          logo_url?: string | null
          profile_id?: string | null
          school?: string | null
          school_profile_url?: string | null
          starts_at?: number | null
        }
        Relationships: []
      }
      profile_experience: {
        Row: {
          company: string | null
          company_profile_url: string | null
          company_urn: string | null
          description: string | null
          ends_at: number | null
          id: number
          location: string | null
          logo_url: string | null
          normalized_company: string | null
          profile_id: string | null
          starts_at: number | null
          title: string | null
        }
        Insert: {
          company?: string | null
          company_profile_url?: string | null
          company_urn?: string | null
          description?: string | null
          ends_at?: number | null
          id?: never
          location?: string | null
          logo_url?: string | null
          normalized_company?: string | null
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
        }
        Update: {
          company?: string | null
          company_profile_url?: string | null
          company_urn?: string | null
          description?: string | null
          ends_at?: number | null
          id?: never
          location?: string | null
          logo_url?: string | null
          normalized_company?: string | null
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
        }
        Relationships: []
      }
      profile_group: {
        Row: {
          id: number
          name: string | null
          profile_id: string | null
          profile_pic_url: string | null
          url: string | null
        }
        Insert: {
          id?: never
          name?: string | null
          profile_id?: string | null
          profile_pic_url?: string | null
          url?: string | null
        }
        Update: {
          id?: never
          name?: string | null
          profile_id?: string | null
          profile_pic_url?: string | null
          url?: string | null
        }
        Relationships: []
      }
      profile_honour_award: {
        Row: {
          description: string | null
          id: number
          issued_on: number | null
          issuer: string | null
          profile_id: string | null
          title: string | null
        }
        Insert: {
          description?: string | null
          id?: never
          issued_on?: number | null
          issuer?: string | null
          profile_id?: string | null
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: never
          issued_on?: number | null
          issuer?: string | null
          profile_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_honour_award_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_language: {
        Row: {
          id: number
          name: string | null
          proficiency: string | null
          profile_id: string | null
        }
        Insert: {
          id?: never
          name?: string | null
          proficiency?: string | null
          profile_id?: string | null
        }
        Update: {
          id?: never
          name?: string | null
          proficiency?: string | null
          profile_id?: string | null
        }
        Relationships: []
      }
      profile_organization: {
        Row: {
          description: string | null
          ends_at: number | null
          id: number
          name: string | null
          profile_id: string | null
          starts_at: number | null
          title: string | null
        }
        Insert: {
          description?: string | null
          ends_at?: number | null
          id?: never
          name?: string | null
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
        }
        Update: {
          description?: string | null
          ends_at?: number | null
          id?: never
          name?: string | null
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
        }
        Relationships: []
      }
      profile_patent: {
        Row: {
          id: number
        }
        Insert: {
          id?: never
        }
        Update: {
          id?: never
        }
        Relationships: []
      }
      profile_people_also_viewed: {
        Row: {
          id: number
          link: string | null
          location: string | null
          name: string | null
          profile_id: string | null
          summary: string | null
        }
        Insert: {
          id?: never
          link?: string | null
          location?: string | null
          name?: string | null
          profile_id?: string | null
          summary?: string | null
        }
        Update: {
          id?: never
          link?: string | null
          location?: string | null
          name?: string | null
          profile_id?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      profile_project: {
        Row: {
          description: string | null
          ends_at: number | null
          id: number
          profile_id: string | null
          starts_at: number | null
          title: string | null
          url: string | null
        }
        Insert: {
          description?: string | null
          ends_at?: number | null
          id?: never
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
          url?: string | null
        }
        Update: {
          description?: string | null
          ends_at?: number | null
          id?: never
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_project_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_publication: {
        Row: {
          description: string | null
          id: number
          name: string | null
          profile_id: string | null
          published_on: number | null
          publisher: string | null
          url: string | null
        }
        Insert: {
          description?: string | null
          id?: never
          name?: string | null
          profile_id?: string | null
          published_on?: number | null
          publisher?: string | null
          url?: string | null
        }
        Update: {
          description?: string | null
          id?: never
          name?: string | null
          profile_id?: string | null
          published_on?: number | null
          publisher?: string | null
          url?: string | null
        }
        Relationships: []
      }
      profile_recommendation: {
        Row: {
          content: string | null
          id: number
          profile_id: string | null
        }
        Insert: {
          content?: string | null
          id?: never
          profile_id?: string | null
        }
        Update: {
          content?: string | null
          id?: never
          profile_id?: string | null
        }
        Relationships: []
      }
      profile_similar_named: {
        Row: {
          id: number
          link: string | null
          location: string | null
          name: string | null
          profile_id: string | null
          summary: string | null
        }
        Insert: {
          id?: never
          link?: string | null
          location?: string | null
          name?: string | null
          profile_id?: string | null
          summary?: string | null
        }
        Update: {
          id?: never
          link?: string | null
          location?: string | null
          name?: string | null
          profile_id?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      profile_test_score: {
        Row: {
          date_on: number | null
          description: string | null
          id: number
          name: string | null
          profile_id: string | null
          score: string | null
        }
        Insert: {
          date_on?: number | null
          description?: string | null
          id?: never
          name?: string | null
          profile_id?: string | null
          score?: string | null
        }
        Update: {
          date_on?: number | null
          description?: string | null
          id?: never
          name?: string | null
          profile_id?: string | null
          score?: string | null
        }
        Relationships: []
      }
      profile_volunteering_experience: {
        Row: {
          cause: string | null
          company: string | null
          company_profile_url: string | null
          company_urn: string | null
          description: string | null
          ends_at: number | null
          id: number
          logo_url: string | null
          profile_id: string | null
          starts_at: number | null
          title: string | null
        }
        Insert: {
          cause?: string | null
          company?: string | null
          company_profile_url?: string | null
          company_urn?: string | null
          description?: string | null
          ends_at?: number | null
          id?: never
          logo_url?: string | null
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
        }
        Update: {
          cause?: string | null
          company?: string | null
          company_profile_url?: string | null
          company_urn?: string | null
          description?: string | null
          ends_at?: number | null
          id?: never
          logo_url?: string | null
          profile_id?: string | null
          starts_at?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_volunteering_experience_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          candidate_search: number | null
          comparison: number | null
          culture_fit: number | null
          id: string
          outreach: number | null
          project_id: string
          query_builder: number | null
          shortlist: number | null
          updated_at: string
        }
        Insert: {
          candidate_search?: number | null
          comparison?: number | null
          culture_fit?: number | null
          id?: string
          outreach?: number | null
          project_id: string
          query_builder?: number | null
          shortlist?: number | null
          updated_at?: string
        }
        Update: {
          candidate_search?: number | null
          comparison?: number | null
          culture_fit?: number | null
          id?: string
          outreach?: number | null
          project_id?: string
          query_builder?: number | null
          shortlist?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          position: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          companies: string[] | null
          created_at: string
          current_employer: string[] | null
          education_degrees: string[] | null
          education_majors: string[] | null
          excluded_companies: string[] | null
          gender: string | null
          id: string
          industries: string[] | null
          job_titles: string[] | null
          languages: string[] | null
          locations: string[] | null
          max_experience: number | null
          min_experience: number | null
          nationalities: string[] | null
          previous_employer: string[] | null
          project_id: string
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          companies?: string[] | null
          created_at?: string
          current_employer?: string[] | null
          education_degrees?: string[] | null
          education_majors?: string[] | null
          excluded_companies?: string[] | null
          gender?: string | null
          id?: string
          industries?: string[] | null
          job_titles?: string[] | null
          languages?: string[] | null
          locations?: string[] | null
          max_experience?: number | null
          min_experience?: number | null
          nationalities?: string[] | null
          previous_employer?: string[] | null
          project_id: string
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          companies?: string[] | null
          created_at?: string
          current_employer?: string[] | null
          education_degrees?: string[] | null
          education_majors?: string[] | null
          excluded_companies?: string[] | null
          gender?: string | null
          id?: string
          industries?: string[] | null
          job_titles?: string[] | null
          languages?: string[] | null
          locations?: string[] | null
          max_experience?: number | null
          min_experience?: number | null
          nationalities?: string[] | null
          previous_employer?: string[] | null
          project_id?: string
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sent_surveys: {
        Row: {
          candidate_id: string
          completed_at: string | null
          created_at: string
          email_sent_at: string | null
          email_status: string | null
          id: string
          last_accessed_at: string | null
          project_id: string
          sent_at: string
          status: string
          submission_count: number | null
          survey_status: string | null
          template_id: string
          unique_token: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          completed_at?: string | null
          created_at?: string
          email_sent_at?: string | null
          email_status?: string | null
          id?: string
          last_accessed_at?: string | null
          project_id: string
          sent_at?: string
          status?: string
          submission_count?: number | null
          survey_status?: string | null
          template_id: string
          unique_token?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          completed_at?: string | null
          created_at?: string
          email_sent_at?: string | null
          email_status?: string | null
          id?: string
          last_accessed_at?: string | null
          project_id?: string
          sent_at?: string
          status?: string
          submission_count?: number | null
          survey_status?: string | null
          template_id?: string
          unique_token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sent_surveys_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_surveys_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_surveys_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "survey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlisted_candidates: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlisted_candidates_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlisted_candidates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          project_id: string
          responses: Json
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          project_id: string
          responses: Json
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          project_id?: string
          responses?: Json
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          project_id: string
          questions: Json
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          project_id: string
          questions?: Json
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          questions?: Json
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_templates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_queries_history: {
        Row: {
          executed_at: string
          id: string
          number_of_results: number
          project_id: string
          query_hash: string | null
          user_id: string
          version_number: number
        }
        Insert: {
          executed_at?: string
          id?: string
          number_of_results: number
          project_id: string
          query_hash?: string | null
          user_id: string
          version_number: number
        }
        Update: {
          executed_at?: string
          id?: string
          number_of_results?: number
          project_id?: string
          query_hash?: string | null
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_queries_history_query_hash_fkey"
            columns: ["query_hash"]
            isOneToOne: false
            referencedRelation: "global_queries"
            referencedColumns: ["query_hash"]
          },
          {
            foreignKeyName: "user_queries_history_query_hash_version_number_fkey"
            columns: ["query_hash", "version_number"]
            isOneToOne: false
            referencedRelation: "global_query_versions"
            referencedColumns: ["query_hash", "version_number"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile_json: {
        Args: {
          p_profile_ids: string[]
        }
        Returns: Json
      }
      insert_profiles: {
        Args: {
          profiles: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      company_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
