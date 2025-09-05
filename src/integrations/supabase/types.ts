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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          created_at: string
          email_contato: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_contato: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_contato?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      human_chat_histories: {
        Row: {
          atendente_id: number | null
          cliente_id: string | null
          created_at: string
          id: number
          telefone: string | null
        }
        Insert: {
          atendente_id?: number | null
          cliente_id?: string | null
          created_at?: string
          id?: number
          telefone?: string | null
        }
        Update: {
          atendente_id?: number | null
          cliente_id?: string | null
          created_at?: string
          id?: number
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "human_chat_histories_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          chatwoot: string | null
          cliente_id: string | null
          criado_em: string | null
          data_qualificacao: string | null
          deal_id: string | null
          email: string | null
          event_id: string | null
          nome: string | null
          resumo_empresa: string | null
          rollout: boolean | null
          site_empresa: string | null
          status: string | null
          telefone: number
          ultima_mensagem_lead: string | null
        }
        Insert: {
          chatwoot?: string | null
          cliente_id?: string | null
          criado_em?: string | null
          data_qualificacao?: string | null
          deal_id?: string | null
          email?: string | null
          event_id?: string | null
          nome?: string | null
          resumo_empresa?: string | null
          rollout?: boolean | null
          site_empresa?: string | null
          status?: string | null
          telefone?: number
          ultima_mensagem_lead?: string | null
        }
        Update: {
          chatwoot?: string | null
          cliente_id?: string | null
          criado_em?: string | null
          data_qualificacao?: string | null
          deal_id?: string | null
          email?: string | null
          event_id?: string | null
          nome?: string | null
          resumo_empresa?: string | null
          rollout?: boolean | null
          site_empresa?: string | null
          status?: string | null
          telefone?: number
          ultima_mensagem_lead?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          cliente_id: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          cliente_id?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          cliente_id?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "n8n_chat_histories_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cliente_id: string | null
          created_at: string
          email: string
          id: string
          role: string
          tipo_usuario: string
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          email: string
          id: string
          role?: string
          tipo_usuario?: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          email?: string
          id?: string
          role?: string
          tipo_usuario?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_client_user: {
        Args: { client_name: string; user_email: string; user_password: string }
        Returns: Json
      }
      get_current_user_tipo: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
