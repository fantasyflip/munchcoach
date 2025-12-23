import { defineStore } from "pinia";
import type { ShoppingList, ShoppingListWithItems } from "~/types/database";

export const useShoppingListStore = defineStore("shoppingList", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient<any>();
  const user = useSupabaseUser();

  // Currently selected list ID
  const selectedListId = ref<string | null>(null);

  const {
    data: lists,
    refresh,
    status,
  } = useAsyncData("shopping-lists", async () => {
    if (!user.value) return [];

    const { data, error } = await supabase
      .from("shopping_lists")
      .select("*, shopping_list_items(*, ingredient:ingredients(*))")
      .eq("user_id", user.value.sub)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Auto-select first list if none selected
    if (data && data.length > 0 && !selectedListId.value && data[0]) {
      selectedListId.value = data[0].id;
    }

    return data as ShoppingListWithItems[];
  });

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

  async function toggleItemPurchased(
    itemId: string,
    isPurchased: boolean,
  ): Promise<boolean> {
    const { error } = await supabase
      .from("shopping_list_items")
      .update({ is_purchased: isPurchased })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating item:", error.message);
      return false;
    }
    await refresh();
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
    toggleItemPurchased,
    removeItemFromList,
    hasIngredientInList,
  };
});
