import { defineStore } from "pinia";
import type { PantryItemWithIngredient } from "~/types/database";

export const usePantryItemsStore = defineStore("pantryItems", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  // Local reactive state
  const items = ref<PantryItemWithIngredient[]>([]);
  const status = ref<"idle" | "pending" | "success" | "error">("idle");

  const refresh = async () => {
    if (!user.value) {
      items.value = [];
      return;
    }

    status.value = "pending";

    const { data, error } = await supabase
      .from("pantry_items")
      .select("*, ingredient:ingredients(*)")
      .eq("user_id", user.value.sub)
      .order("created_at", { ascending: false });

    if (error) {
      status.value = "error";
      console.error("Error fetching pantry items:", error.message);
      return;
    }

    items.value = data as PantryItemWithIngredient[];
    status.value = "success";
  };

  // Watch for user changes
  watch(
    user,
    async (newUser) => {
      if (newUser) {
        await refresh();
      } else {
        items.value = [];
      }
    },
    { immediate: true },
  );

  // Check if an ingredient is in the pantry
  const hasIngredient = (ingredientId: string): boolean => {
    return items.value.some((item) => item.ingredient_id === ingredientId);
  };

  // Get pantry item by ingredient ID
  const getByIngredientId = (
    ingredientId: string,
  ): PantryItemWithIngredient | undefined => {
    return items.value.find((item) => item.ingredient_id === ingredientId);
  };

  // Reset store to initial state
  const $reset = () => {
    items.value = [];
    status.value = "idle";
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

  // Add or update item - handles duplicates gracefully
  async function addOrUpdateItem(item: {
    ingredient_id: string;
    quantity?: number | null;
    unit?: string | null;
    expires_at?: string | null;
  }): Promise<{ success: boolean; action: "added" | "updated" | "error" }> {
    if (!user.value) return { success: false, action: "error" };

    // Check if ingredient already exists
    const existing = getByIngredientId(item.ingredient_id);

    if (existing) {
      // Update existing item - add quantities if same unit or convertible
      const { compareQuantities } = await import("~/utils/unitConversion");

      let newQuantity = item.quantity ?? 0;
      let newUnit = item.unit ?? existing.unit;

      // If both have quantities and compatible units, add them
      if (existing.quantity && item.quantity) {
        if (existing.unit === item.unit || !existing.unit || !item.unit) {
          newQuantity = existing.quantity + (item.quantity ?? 0);
          newUnit = item.unit ?? existing.unit;
        } else {
          // Try to convert and add
          const comparison = compareQuantities(
            item.quantity,
            item.unit,
            0,
            existing.unit,
          );
          if (comparison.convertedHaveQuantity !== null) {
            newQuantity = existing.quantity + comparison.convertedHaveQuantity;
            newUnit = existing.unit;
          } else {
            // Can't convert - just use new values
            newQuantity = item.quantity;
            newUnit = item.unit;
          }
        }
      }

      const success = await updateItem(existing.id, {
        quantity: newQuantity || null,
        unit: newUnit,
        expires_at: item.expires_at ?? existing.expires_at,
      });

      return { success, action: success ? "updated" : "error" };
    }

    // Add new item
    const success = await addItem(item);
    return { success, action: success ? "added" : "error" };
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
    addOrUpdateItem,
    updateItem,
    removeItem,
    $reset,
  };
});
