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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          messages: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alumni: {
        Row: {
          advice_quote: string | null
          avatar_url: string | null
          career_path_id: string | null
          company: string | null
          created_at: string | null
          graduation_year: number | null
          id: string
          is_available_for_chat: boolean | null
          job_title: string | null
          name: string
          story: string | null
          struggles_faced: string | null
        }
        Insert: {
          advice_quote?: string | null
          avatar_url?: string | null
          career_path_id?: string | null
          company?: string | null
          created_at?: string | null
          graduation_year?: number | null
          id?: string
          is_available_for_chat?: boolean | null
          job_title?: string | null
          name: string
          story?: string | null
          struggles_faced?: string | null
        }
        Update: {
          advice_quote?: string | null
          avatar_url?: string | null
          career_path_id?: string | null
          company?: string | null
          created_at?: string | null
          graduation_year?: number | null
          id?: string
          is_available_for_chat?: boolean | null
          job_title?: string | null
          name?: string
          story?: string | null
          struggles_faced?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_career_path_id_fkey"
            columns: ["career_path_id"]
            isOneToOne: false
            referencedRelation: "career_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      career_paths: {
        Row: {
          avg_salary_range: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          growth_outlook: string | null
          icon: string | null
          id: string
          name: string
          required_skills: string[] | null
        }
        Insert: {
          avg_salary_range?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          growth_outlook?: string | null
          icon?: string | null
          id?: string
          name: string
          required_skills?: string[] | null
        }
        Update: {
          avg_salary_range?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          growth_outlook?: string | null
          icon?: string | null
          id?: string
          name?: string
          required_skills?: string[] | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          is_read: boolean | null
          message: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_read?: boolean | null
          message: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_read?: boolean | null
          message?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      electives: {
        Row: {
          career_path_ids: string[] | null
          code: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          recommended_semester: number | null
          relevance_score: number | null
          skills_gained: string[] | null
        }
        Insert: {
          career_path_ids?: string[] | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          recommended_semester?: number | null
          relevance_score?: number | null
          skills_gained?: string[] | null
        }
        Update: {
          career_path_ids?: string[] | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          recommended_semester?: number | null
          relevance_score?: number | null
          skills_gained?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          career_clarity: Database["public"]["Enums"]["career_clarity"] | null
          created_at: string | null
          expertise_level: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          primary_struggle: string | null
          recommended_path_id: string | null
          semester_bucket: Database["public"]["Enums"]["semester_bucket"] | null
          semester_number: number | null
          stress_level: Database["public"]["Enums"]["stress_level"] | null
          updated_at: string | null
          user_id: string
          work_style: Database["public"]["Enums"]["work_style"] | null
        }
        Insert: {
          career_clarity?: Database["public"]["Enums"]["career_clarity"] | null
          created_at?: string | null
          expertise_level?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          primary_struggle?: string | null
          recommended_path_id?: string | null
          semester_bucket?:
            | Database["public"]["Enums"]["semester_bucket"]
            | null
          semester_number?: number | null
          stress_level?: Database["public"]["Enums"]["stress_level"] | null
          updated_at?: string | null
          user_id: string
          work_style?: Database["public"]["Enums"]["work_style"] | null
        }
        Update: {
          career_clarity?: Database["public"]["Enums"]["career_clarity"] | null
          created_at?: string | null
          expertise_level?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          primary_struggle?: string | null
          recommended_path_id?: string | null
          semester_bucket?:
            | Database["public"]["Enums"]["semester_bucket"]
            | null
          semester_number?: number | null
          stress_level?: Database["public"]["Enums"]["stress_level"] | null
          updated_at?: string | null
          user_id?: string
          work_style?: Database["public"]["Enums"]["work_style"] | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question_key: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question_key: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question_key?: string
          user_id?: string
        }
        Relationships: []
      }
      user_electives: {
        Row: {
          created_at: string | null
          elective_id: string
          id: string
          semester_taken: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          elective_id: string
          id?: string
          semester_taken?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          elective_id?: string
          id?: string
          semester_taken?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_electives_elective_id_fkey"
            columns: ["elective_id"]
            isOneToOne: false
            referencedRelation: "electives"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          progress_type: string
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          progress_type: string
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          progress_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roadmaps: {
        Row: {
          career_path_id: string | null
          chat_messages: Json | null
          created_at: string | null
          expertise_level: string
          id: string
          roadmap_content: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          career_path_id?: string | null
          chat_messages?: Json | null
          created_at?: string | null
          expertise_level: string
          id?: string
          roadmap_content: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          career_path_id?: string | null
          chat_messages?: Json | null
          created_at?: string | null
          expertise_level?: string
          id?: string
          roadmap_content?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roadmaps_career_path_id_fkey"
            columns: ["career_path_id"]
            isOneToOne: false
            referencedRelation: "career_paths"
            referencedColumns: ["id"]
          },
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
      career_clarity: "confused" | "exploring" | "narrowing" | "decided"
      semester_bucket: "early" | "mid" | "final"
      stress_level: "low" | "moderate" | "high" | "severe"
      work_style: "solo" | "collaborative" | "flexible"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      career_clarity: ["confused", "exploring", "narrowing", "decided"],
      semester_bucket: ["early", "mid", "final"],
      stress_level: ["low", "moderate", "high", "severe"],
      work_style: ["solo", "collaborative", "flexible"],
    },
  },
} as const
