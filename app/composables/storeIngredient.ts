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

    // Search by name using ilike for case-insensitive matching
    const { data, error } = await supabase
      .from("ingredients")
      .select("*, category:categories(*)")
      .ilike("name", `%${query}%`)
      .limit(limit);

    if (error) {
      searchStatus.value = "error";
      console.error("Error searching ingredients:", error.message);
      return [];
    }

    searchResults.value = data as IngredientWithCategory[];
    searchStatus.value = "success";
    return data as IngredientWithCategory[];
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
