export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      ingredients: {
        Row: {
          category_id: string | null;
          created_at: string;
          id: string;
          name: string;
          name_de: string | null;
          normalized_name: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          name_de?: string | null;
          normalized_name: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          name_de?: string | null;
          normalized_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ingredients_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      pantry_items: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          ingredient_id: string;
          quantity: number | null;
          unit: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          ingredient_id: string;
          quantity?: number | null;
          unit?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          ingredient_id?: string;
          quantity?: number | null;
          unit?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pantry_items_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
        ];
      };
      pantry_products: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          product_id: string;
          quantity: number | null;
          unit: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          product_id: string;
          quantity?: number | null;
          unit?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          product_id?: string;
          quantity?: number | null;
          unit?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pantry_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_ingredients: {
        Row: {
          confidence: number | null;
          ingredient_id: string;
          is_primary: boolean;
          notes: string | null;
          product_id: string;
        };
        Insert: {
          confidence?: number | null;
          ingredient_id: string;
          is_primary?: boolean;
          notes?: string | null;
          product_id: string;
        };
        Update: {
          confidence?: number | null;
          ingredient_id?: string;
          is_primary?: boolean;
          notes?: string | null;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          barcode: string;
          brand: string | null;
          created_at: string;
          id: string;
          name: string | null;
          name_de: string | null;
          off_product_id: string | null;
          off_raw: Json | null;
          quantity_text: string | null;
          updated_at: string;
        };
        Insert: {
          barcode: string;
          brand?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          name_de?: string | null;
          off_product_id?: string | null;
          off_raw?: Json | null;
          quantity_text?: string | null;
          updated_at?: string;
        };
        Update: {
          barcode?: string;
          brand?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          name_de?: string | null;
          off_product_id?: string | null;
          off_raw?: Json | null;
          quantity_text?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          ingredient_id: string;
          quantity: number | null;
          recipe_id: string;
          unit: string | null;
        };
        Insert: {
          ingredient_id: string;
          quantity?: number | null;
          recipe_id: string;
          unit?: string | null;
        };
        Update: {
          ingredient_id?: string;
          quantity?: number | null;
          recipe_id?: string;
          unit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      recipes: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          instructions: string | null;
          source: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          instructions?: string | null;
          source?: string;
          title: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          instructions?: string | null;
          source?: string;
          title?: string;
        };
        Relationships: [];
      };
      shopping_list_items: {
        Row: {
          added_from_recipe_id: string | null;
          created_at: string;
          id: string;
          ingredient_id: string;
          is_purchased: boolean;
          quantity: number | null;
          shopping_list_id: string;
          unit: string | null;
        };
        Insert: {
          added_from_recipe_id?: string | null;
          created_at?: string;
          id?: string;
          ingredient_id: string;
          is_purchased?: boolean;
          quantity?: number | null;
          shopping_list_id: string;
          unit?: string | null;
        };
        Update: {
          added_from_recipe_id?: string | null;
          created_at?: string;
          id?: string;
          ingredient_id?: string;
          is_purchased?: boolean;
          quantity?: number | null;
          shopping_list_id?: string;
          unit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_added_from_recipe_id_fkey";
            columns: ["added_from_recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shopping_list_items_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shopping_list_items_shopping_list_id_fkey";
            columns: ["shopping_list_id"];
            isOneToOne: false;
            referencedRelation: "shopping_lists";
            referencedColumns: ["id"];
          },
        ];
      };
      shopping_lists: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_pantry_item: {
        Args: {
          p_expires_at?: string;
          p_ingredient_id: string;
          p_quantity: number;
          p_unit: string;
        };
        Returns: string;
      };
      consume_pantry_item: {
        Args: { p_amount?: number; p_pantry_item_id: string };
        Returns: boolean;
      };
      create_shopping_list_from_recipe: {
        Args: { p_name?: string; p_recipe_id: string };
        Returns: string;
      };
      get_missing_ingredients: {
        Args: { p_recipe_id: string };
        Returns: {
          have_quantity: number;
          ingredient_id: string;
          missing_quantity: number;
          needed_quantity: number;
          unit: string;
        }[];
      };
      get_my_pantry_items: {
        Args: never;
        Returns: {
          category_name: string;
          created_at: string;
          expires_at: string;
          ingredient_id: string;
          ingredient_name: string;
          pantry_item_id: string;
          quantity: number;
          unit: string;
        }[];
      };
      get_pantry_expiring_soon: {
        Args: { p_days_ahead?: number };
        Returns: {
          category_name: string;
          days_left: number;
          expires_at: string;
          ingredient_id: string;
          ingredient_name: string;
          pantry_item_id: string;
          quantity: number;
          unit: string;
        }[];
      };
      remove_pantry_item: {
        Args: { p_pantry_item_id: string };
        Returns: boolean;
      };
      update_pantry_item: {
        Args: {
          p_expires_at?: string;
          p_pantry_item_id: string;
          p_quantity?: number;
          p_unit?: string;
        };
        Returns: boolean;
      };
      upsert_pantry_item: {
        Args: {
          p_expires_at?: string;
          p_ingredient_id: string;
          p_quantity: number;
          p_unit?: string;
        };
        Returns: {
          created_at: string;
          expires_at: string | null;
          id: string;
          ingredient_id: string;
          quantity: number | null;
          unit: string | null;
          user_id: string;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
  ? R
  : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
  }
  ? I
  : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
  }
  ? U
  : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
