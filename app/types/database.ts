// Auto-generated types based on Supabase schema

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category_id: string | null;
  created_at: string;
}

export interface IngredientWithCategory extends Ingredient {
  category?: Category;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  source: "ai" | "user" | "import";
  created_by: string | null;
  created_at: string;
}

export interface RecipeIngredient {
  recipe_id: string;
  ingredient_id: string;
  quantity: number | null;
  unit: string | null;
}

export interface PantryItem {
  id: string;
  user_id: string;
  ingredient_id: string;
  quantity: number | null;
  unit: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface PantryItemWithIngredient extends PantryItem {
  ingredient?: Ingredient;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  status: "open" | "archived";
  created_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  ingredient_id: string;
  product_id: string | null;
  quantity: number | null;
  unit: string | null;
  is_purchased: boolean;
  added_from_recipe_id: string | null;
  created_at: string;
}

export interface ShoppingListItemWithIngredient extends ShoppingListItem {
  ingredient?: Ingredient;
  product?: Product;
}

export interface ShoppingListWithItems extends ShoppingList {
  shopping_list_items: ShoppingListItemWithIngredient[];
}

export interface Product {
  id: string;
  barcode: string;
  off_product_id: string | null;
  name: string | null;
  brand: string | null;
  quantity_text: string | null;
  off_raw: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ProductIngredient {
  product_id: string;
  ingredient_id: string;
  is_primary: boolean;
  confidence: number | null;
  notes: string | null;
}

export interface PantryProduct {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number | null;
  unit: string | null;
  expires_at: string | null;
  created_at: string;
}
