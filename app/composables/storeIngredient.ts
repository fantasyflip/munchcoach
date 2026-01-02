import { defineStore } from "pinia";
import type {
  Category,
  Ingredient,
  IngredientWithCategory,
} from "~/types/database";

export const useIngredientStore = defineStore("ingredients", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient<any>();

  // Categories
  const categories = ref<Category[]>([]);
  const categoriesStatus = ref<"idle" | "pending" | "success" | "error">(
    "idle",
  );

  const fetchCategories = async () => {
    if (categories.value.length > 0) return; // Already fetched

    categoriesStatus.value = "pending";
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      categoriesStatus.value = "error";
      console.error("Error fetching categories:", error.message);
      return;
    }

    categories.value = data as Category[];
    categoriesStatus.value = "success";
  };

  // Ingredient search
  const searchResults = ref<IngredientWithCategory[]>([]);
  const searchQuery = ref("");
  const searchStatus = ref<"idle" | "pending" | "success" | "error">("idle");

  const searchIngredients = async (
    query: string,
    limit = 20,
  ): Promise<IngredientWithCategory[]> => {
    if (!query.trim()) {
      searchResults.value = [];
      return [];
    }

    searchStatus.value = "pending";
    searchQuery.value = query;

    // Make two separate queries - one for name and one for name_de
    // This avoids issues with the Supabase `or` filter syntax
    const [nameResult, nameDeResult] = await Promise.all([
      supabase
        .from("ingredients")
        .select("*, category:categories(*)")
        .ilike("name", `%${query}%`)
        .limit(limit),
      supabase
        .from("ingredients")
        .select("*, category:categories(*)")
        .ilike("name_de", `%${query}%`)
        .limit(limit),
    ]);

    if (nameResult.error) {
      searchStatus.value = "error";
      console.error("Error searching ingredients by name:", nameResult.error.message);
      return [];
    }

    if (nameDeResult.error) {
      searchStatus.value = "error";
      console.error("Error searching ingredients by name_de:", nameDeResult.error.message);
      return [];
    }

    // Merge results and remove duplicates using a Map
    const resultsMap = new Map<string, IngredientWithCategory>();

    // Add name results first
    for (const item of (nameResult.data || []) as IngredientWithCategory[]) {
      resultsMap.set(item.id, item);
    }

    // Add name_de results (won't overwrite existing items with same ID)
    for (const item of (nameDeResult.data || []) as IngredientWithCategory[]) {
      if (!resultsMap.has(item.id)) {
        resultsMap.set(item.id, item);
      }
    }

    const mergedData = Array.from(resultsMap.values());

    // Sort results for better relevance:
    // 1. Exact matches first (in either name or name_de)
    // 2. Prefix matches (starts with query in either name or name_de)
    // 3. Other matches (contains query)
    const queryLower = query.toLowerCase();
    const sortedData = mergedData.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aNameDe = a.name_de?.toLowerCase() || "";
      const bNameDe = b.name_de?.toLowerCase() || "";

      const aExact = aName === queryLower || aNameDe === queryLower;
      const bExact = bName === queryLower || bNameDe === queryLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aPrefix =
        aName.startsWith(queryLower) || aNameDe.startsWith(queryLower);
      const bPrefix =
        bName.startsWith(queryLower) || bNameDe.startsWith(queryLower);
      if (aPrefix && !bPrefix) return -1;
      if (!aPrefix && bPrefix) return 1;

      // If both are the same type, sort alphabetically
      return aName.localeCompare(bName);
    });

    // Limit to requested number
    const limitedData = sortedData.slice(0, limit);

    searchResults.value = limitedData;
    searchStatus.value = "success";
    return limitedData;
  };

  // Debounced search for real-time input
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  const debouncedSearch = (query: string, delay = 300) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    return new Promise<IngredientWithCategory[]>((resolve) => {
      searchTimeout = setTimeout(async () => {
        const results = await searchIngredients(query);
        resolve(results);
      }, delay);
    });
  };

  // Get ingredient by ID
  const getIngredientById = async (
    id: string,
  ): Promise<IngredientWithCategory | null> => {
    const { data, error } = await supabase
      .from("ingredients")
      .select("*, category:categories(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching ingredient:", error.message);
      return null;
    }

    return data as IngredientWithCategory;
  };

  // Get ingredients by category
  const getIngredientsByCategory = async (
    categoryId: string,
    limit = 50,
  ): Promise<Ingredient[]> => {
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .eq("category_id", categoryId)
      .order("name", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching ingredients by category:", error.message);
      return [];
    }

    return data as Ingredient[];
  };

  // Clear search
  const clearSearch = () => {
    searchResults.value = [];
    searchQuery.value = "";
    searchStatus.value = "idle";
  };

  // Reset store to initial state
  const $reset = () => {
    categories.value = [];
    categoriesStatus.value = "idle";
    searchResults.value = [];
    searchQuery.value = "";
    searchStatus.value = "idle";
  };

  return {
    // Categories
    categories,
    categoriesStatus,
    fetchCategories,

    // Search
    searchResults,
    searchQuery,
    searchStatus,
    searchIngredients,
    debouncedSearch,
    clearSearch,

    // Utilities
    getIngredientById,
    getIngredientsByCategory,
    $reset,
  };
});
