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
      admin_settings: {
        Row: {
          activation_fee: number | null
          id: string
          points_buy_rate: number | null
          points_sell_rate: number | null
          updated_at: string | null
        }
        Insert: {
          activation_fee?: number | null
          id?: string
          points_buy_rate?: number | null
          points_sell_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          activation_fee?: number | null
          id?: string
          points_buy_rate?: number | null
          points_sell_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          ayah_ref_end: number | null
          ayah_ref_start: number | null
          created_at: string | null
          description: string | null
          id: string
          owner_id: string
          price_naira: number | null
          price_points: number | null
          reciter_name: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          surah_ref: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          ayah_ref_end?: number | null
          ayah_ref_start?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id: string
          price_naira?: number | null
          price_points?: number | null
          reciter_name?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          surah_ref?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          ayah_ref_end?: number | null
          ayah_ref_start?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id?: string
          price_naira?: number | null
          price_points?: number | null
          reciter_name?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          surah_ref?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_premium: boolean | null
          referral_code: string | null
          referred_by: string | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_premium?: boolean | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_premium?: boolean | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quran_ayahs: {
        Row: {
          arabic_text: string
          ayah_number: number
          id: string
          normalized_text: string | null
          surah_name_ar: string | null
          surah_name_en: string | null
          surah_number: number
        }
        Insert: {
          arabic_text: string
          ayah_number: number
          id?: string
          normalized_text?: string | null
          surah_name_ar?: string | null
          surah_name_en?: string | null
          surah_number: number
        }
        Update: {
          arabic_text?: string
          ayah_number?: number
          id?: string
          normalized_text?: string | null
          surah_name_ar?: string | null
          surah_name_en?: string | null
          surah_number?: number
        }
        Relationships: []
      }
      recitation_attempts: {
        Row: {
          breakdown: Json | null
          confidence: number | null
          created_at: string | null
          id: string
          matched_ayah_end: number | null
          matched_ayah_start: number | null
          matched_surah: number | null
          score: number | null
          transcript: string | null
          user_id: string
        }
        Insert: {
          breakdown?: Json | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          matched_ayah_end?: number | null
          matched_ayah_start?: number | null
          matched_surah?: number | null
          score?: number | null
          transcript?: string | null
          user_id: string
        }
        Update: {
          breakdown?: Json | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          matched_ayah_end?: number | null
          matched_ayah_start?: number | null
          matched_surah?: number | null
          score?: number | null
          transcript?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_awarded: boolean | null
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          bonus_awarded?: boolean | null
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          bonus_awarded?: boolean | null
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_naira: number | null
          amount_points: number | null
          created_at: string | null
          description: string | null
          id: string
          reference: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount_naira?: number | null
          amount_points?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          reference?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount_naira?: number | null
          amount_points?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          reference?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      unlocks: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          paid_naira: number | null
          paid_points: number | null
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          paid_naira?: number | null
          paid_points?: number | null
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          paid_naira?: number | null
          paid_points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance_naira: number | null
          balance_points: number | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_naira?: number | null
          balance_points?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_naira?: number | null
          balance_points?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      content_status: "pending" | "approved" | "rejected"
      transaction_type:
        | "fund"
        | "buy_points"
        | "sell_points"
        | "unlock"
        | "referral_bonus"
        | "activation"
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
      app_role: ["admin", "user"],
      content_status: ["pending", "approved", "rejected"],
      transaction_type: [
        "fund",
        "buy_points",
        "sell_points",
        "unlock",
        "referral_bonus",
        "activation",
      ],
    },
  },
} as const
