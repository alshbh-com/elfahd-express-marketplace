export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string
          created_at: string | null
          icon: string
          id: string
          link: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string | null
          icon: string
          id?: string
          link: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          link?: string
          name?: string
        }
        Relationships: []
      }
      craftsmen: {
        Row: {
          area: string | null
          created_at: string | null
          description: string | null
          hourly_rate: number
          id: string
          image: string
          name: string
          phone: string | null
          profession: string
        }
        Insert: {
          area?: string | null
          created_at?: string | null
          description?: string | null
          hourly_rate: number
          id?: string
          image: string
          name: string
          phone?: string | null
          profession: string
        }
        Update: {
          area?: string | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number
          id?: string
          image?: string
          name?: string
          phone?: string | null
          profession?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          created_at: string | null
          education: string | null
          id: string
          image: string
          name: string
          price: number
          rating: number | null
          reviews: number | null
          specialty: string
        }
        Insert: {
          created_at?: string | null
          education?: string | null
          id?: string
          image: string
          name: string
          price: number
          rating?: number | null
          reviews?: number | null
          specialty: string
        }
        Update: {
          created_at?: string | null
          education?: string | null
          id?: string
          image?: string
          name?: string
          price?: number
          rating?: number | null
          reviews?: number | null
          specialty?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          image: string
          location: string
          name: string
          price: number
          rating: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image: string
          location: string
          name: string
          price: number
          rating: number
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image?: string
          location?: string
          name?: string
          price?: number
          rating?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image: string
          name: string
          price: number
          restaurant_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image: string
          name: string
          price: number
          restaurant_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string
          name?: string
          price?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_categories: {
        Row: {
          category_name: string
          created_at: string | null
          id: string
          restaurant_id: string | null
        }
        Insert: {
          category_name: string
          created_at?: string | null
          id?: string
          restaurant_id?: string | null
        }
        Update: {
          category_name?: string
          created_at?: string | null
          id?: string
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          created_at: string | null
          delivery_time: string | null
          description: string | null
          id: string
          image: string
          min_order: number | null
          name: string
          rating: number | null
          reviews: number | null
        }
        Insert: {
          created_at?: string | null
          delivery_time?: string | null
          description?: string | null
          id?: string
          image: string
          min_order?: number | null
          name: string
          rating?: number | null
          reviews?: number | null
        }
        Update: {
          created_at?: string | null
          delivery_time?: string | null
          description?: string | null
          id?: string
          image?: string
          min_order?: number | null
          name?: string
          rating?: number | null
          reviews?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
