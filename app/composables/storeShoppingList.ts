import { defineStore } from "pinia";
import type { ShoppingList, ShoppingListWithItems } from "~/types/database";

export const useShoppingListStore = defineStore("shoppingList", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  // Currently selected list ID (persisted to localStorage)
  const selectedListId = ref<string | null>(null);

  // Track if we've loaded persisted selection
  const hasLoadedPersistedSelection = ref(false);

  // Local reactive state for lists
  const lists = ref<ShoppingListWithItems[]>([]);
  const status = ref<"idle" | "pending" | "success" | "error">("idle");

  // Load selected list ID from localStorage
  const loadPersistedSelection = () => {
    if (import.meta.client && !hasLoadedPersistedSelection.value) {
      hasLoadedPersistedSelection.value = true;
      const saved = localStorage.getItem("munchcoach:selectedListId");
      if (saved) {
        selectedListId.value = saved;
      }
    }
  };

  // Save selected list ID to localStorage
  watch(selectedListId, (newId) => {
    if (import.meta.client) {
      if (newId) {
        localStorage.setItem("munchcoach:selectedListId", newId);
      } else {
        localStorage.removeItem("munchcoach:selectedListId");
      }
    }
  });

  const refresh = async () => {
    if (!user.value) {
      lists.value = [];
      return;
    }

    status.value = "pending";

    const { data, error } = await supabase
      .from("shopping_lists")
      .select("*, shopping_list_items(*, ingredient:ingredients(*))")
      .eq("user_id", user.value.sub)
      .order("created_at", { ascending: false });

    if (error) {
      status.value = "error";
      console.error("Error fetching shopping lists:", error.message);
      return;
    }

    lists.value = data as ShoppingListWithItems[];
    status.value = "success";

    // Load persisted selection AFTER lists are fetched
    loadPersistedSelection();

    // Auto-select first list if none selected or selected doesn't exist
    if (lists.value.length > 0) {
      const selectedExists = lists.value.some(
        (l) => l.id === selectedListId.value,
      );
      if (!selectedListId.value || !selectedExists) {
        selectedListId.value = lists.value[0]?.id ?? null;
      }
    }
  };

  // Initialize: Only load persisted selection after lists are fetched
  // The persistence is now loaded inside refresh()

  // Watch for user changes
  watch(
    user,
    async (newUser) => {
      if (newUser) {
        await refresh();
      } else {
        lists.value = [];
        selectedListId.value = null;
      }
    },
    { immediate: true },
  );

  // Get currently selected list
  const selectedList = computed(() => {
    if (!selectedListId.value || !lists.value) return null;
    return lists.value.find((list) => list.id === selectedListId.value) ?? null;
  });

  // Get items from selected list
  const selectedListItems = computed(() => {
    return selectedList.value?.shopping_list_items ?? [];
  });

  // Select a list
  const selectList = (listId: string) => {
    selectedListId.value = listId;
  };

  // Reset store to initial state
  const $reset = () => {
    lists.value = [];
    selectedListId.value = null;
    status.value = "idle";
    if (import.meta.client) {
      localStorage.removeItem("munchcoach:selectedListId");
    }
  };

  async function createNewList(name: string): Promise<ShoppingList | null> {
    console.log("Creating list - store", name, user.value);

    if (!user.value) return null;
    const { data, error } = await supabase
      .from("shopping_lists")
      .insert([
        {
          name,
          user_id: user.value.sub,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating new list:", error.message);
      return null;
    }
    await refresh();

    // Select the newly created list
    if (data) {
      selectedListId.value = data.id;
    }

    return data as ShoppingList;
  }

  async function deleteList(listId: string): Promise<boolean> {
    const { error } = await supabase
      .from("shopping_lists")
      .delete()
      .eq("id", listId);

    if (error) {
      console.error("Error deleting list:", error.message);
      return false;
    }

    // If deleted list was selected, select another one
    if (selectedListId.value === listId) {
      selectedListId.value = null;
    }

    await refresh();
    return true;
  }

  async function addItemToList(
    listId: string,
    item: {
      ingredient_id: string;
      quantity?: number | null;
      unit?: string | null;
    },
  ): Promise<boolean> {
    const { error } = await supabase.from("shopping_list_items").insert([
      {
        shopping_list_id: listId,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity ?? null,
        unit: item.unit ?? null,
        is_purchased: false,
      },
    ]);

    if (error) {
      console.error("Error adding item to list:", error.message);
      return false;
    }
    await refresh();
    return true;
  }

  // Get shopping list item by ingredient ID from selected list
  const getItemByIngredientId = (ingredientId: string) => {
    return selectedListItems.value.find(
      (item) => item.ingredient_id === ingredientId,
    );
  };

  // Update an existing shopping list item
  async function updateItemInList(
    itemId: string,
    updates: {
      quantity?: number | null;
      unit?: string | null;
    },
  ): Promise<boolean> {
    const { error } = await supabase
      .from("shopping_list_items")
      .update(updates)
      .eq("id", itemId);

    if (error) {
      console.error("Error updating shopping list item:", error.message);
      return false;
    }
    await refresh();
    return true;
  }

  // Add or update item - handles duplicates gracefully
  async function addOrUpdateItemInList(
    listId: string,
    item: {
      ingredient_id: string;
      quantity?: number | null;
      unit?: string | null;
    },
  ): Promise<{ success: boolean; action: "added" | "updated" | "error" }> {
    // Check if ingredient already exists in this list
    const list = lists.value.find((l) => l.id === listId);
    const existing = list?.shopping_list_items?.find(
      (i) => i.ingredient_id === item.ingredient_id,
    );

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

      const success = await updateItemInList(existing.id, {
        quantity: newQuantity || null,
        unit: newUnit,
      });

      return { success, action: success ? "updated" : "error" };
    }

    // Add new item
    const success = await addItemToList(listId, item);
    return { success, action: success ? "added" : "error" };
  }

  async function toggleItemPurchased(
    itemId: string,
    isPurchased: boolean,
  ): Promise<boolean> {
    // Find the list and item
    const listIndex = lists.value.findIndex((list) =>
      list.shopping_list_items?.some((i) => i.id === itemId),
    );
    if (listIndex === -1) return false;

    const items = lists.value[listIndex]?.shopping_list_items;
    if (!items) return false;

    const itemIndex = items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return false;

    const item = items[itemIndex];
    if (!item) return false;

    const previousValue = item.is_purchased;

    // Optimistically update - create new array reference for reactivity
    items[itemIndex] = { ...item, is_purchased: isPurchased };
    lists.value = [...lists.value];

    const { error } = await supabase
      .from("shopping_list_items")
      .update({ is_purchased: isPurchased })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating item:", error.message);
      // Revert on error
      items[itemIndex] = { ...items[itemIndex]!, is_purchased: previousValue };
      lists.value = [...lists.value];
      return false;
    }
    return true;
  }

  async function removeItemFromList(itemId: string): Promise<boolean> {
    const { error } = await supabase
      .from("shopping_list_items")
      .delete()
      .eq("id", itemId);
    if (error) {
      console.error("Error removing item from list:", error.message);
      return false;
    }
    await refresh();
    return true;
  }

  // Check if ingredient is in the selected list
  const hasIngredientInList = (ingredientId: string): boolean => {
    return selectedListItems.value.some(
      (item) => item.ingredient_id === ingredientId,
    );
  };

  // Get all lists that contain an ingredient (with quantities)
  const getListsContainingIngredient = (
    ingredientId: string,
  ): Array<{
    listId: string;
    listName: string;
    quantity: number | null;
    unit: string | null;
  }> => {
    const result: Array<{
      listId: string;
      listName: string;
      quantity: number | null;
      unit: string | null;
    }> = [];

    for (const list of lists.value) {
      const item = list.shopping_list_items?.find(
        (i) => i.ingredient_id === ingredientId,
      );
      if (item) {
        result.push({
          listId: list.id,
          listName: list.name,
          quantity: item.quantity,
          unit: item.unit,
        });
      }
    }

    return result;
  };

  // Get other lists (excluding current selected) that contain an ingredient
  const getOtherListsContainingIngredient = (
    ingredientId: string,
  ): Array<{
    listId: string;
    listName: string;
    quantity: number | null;
    unit: string | null;
  }> => {
    return getListsContainingIngredient(ingredientId).filter(
      (l) => l.listId !== selectedListId.value,
    );
  };

  return {
    lists,
    refresh,
    status,
    selectedListId,
    selectedList,
    selectedListItems,
    selectList,
    createNewList,
    deleteList,
    addItemToList,
    addOrUpdateItemInList,
    updateItemInList,
    getItemByIngredientId,
    toggleItemPurchased,
    removeItemFromList,
    hasIngredientInList,
    getListsContainingIngredient,
    getOtherListsContainingIngredient,
    $reset,
  };
});
