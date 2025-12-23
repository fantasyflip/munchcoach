import { defineStore } from "pinia";
import type { PantryItemWithIngredient } from "~/types/database";

export const usePantryItemsStore = defineStore("pantryItems", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  const {
    data: items,
    refresh,
    status,
  } = useAsyncData("pantry-items", async () => {
    if (!user.value) return [];

    const { data, error } = await supabase
      .from("pantry_items")
      .select("*, ingredient:ingredients(*)")
      .eq("user_id", user.value.sub)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as PantryItemWithIngredient[];
  });

  // Check if an ingredient is in the pantry
  const hasIngredient = (ingredientId: string): boolean => {
    return (
      items.value?.some((item) => item.ingredient_id === ingredientId) ?? false
    );
  };

  // Get pantry item by ingredient ID
  const getByIngredientId = (
    ingredientId: string,
  ): PantryItemWithIngredient | undefined => {
    return items.value?.find((item) => item.ingredient_id === ingredientId);
  };

  async function addItem(item: {
    ingredient_id: string;
    quantity?: number | null;
    unit?: string | null;
    expires_at?: string | null;
  }): Promise<boolean> {
    if (!user.value) return false;

    const { error } = await supabase.from("pantry_items").insert([
      {
        user_id: user.value.sub,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity ?? null,
        unit: item.unit ?? null,
        expires_at: item.expires_at ?? null,
      },
    ]);

    if (error) {
      console.error("Error adding item to pantry:", error.message);
      return false;
    }
    await refresh();
    return true;
  }

  async function updateItem(
    itemId: string,
    updates: {
      quantity?: number | null;
      unit?: string | null;
      expires_at?: string | null;
    },
  ): Promise<boolean> {
    const { error } = await supabase
      .from("pantry_items")
      .update(updates)
      .eq("id", itemId);

    if (error) {
      console.error("Error updating pantry item:", error.message);
      return false;
    }
    await refresh();
    return true;
  }

  async function removeItem(itemId: string): Promise<boolean> {
    const { error } = await supabase
      .from("pantry_items")
      .delete()
      .eq("id", itemId);
    if (error) {
      console.error("Error removing item from pantry:", error.message);
      return false;
    }
    await refresh();
    return true;
  }

  return {
    items,
    refresh,
    status,
    hasIngredient,
    getByIngredientId,
    addItem,
    updateItem,
    removeItem,
  };
});
