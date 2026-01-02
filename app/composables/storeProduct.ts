import { defineStore } from "pinia";
import type { Product } from "~/types/database";

export interface ProductWithIngredientLink extends Product {
    is_primary: boolean;
    confidence: number | null;
}

export const useProductStore = defineStore("products", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = useSupabaseClient<any>();

    // Products for currently selected ingredient
    const productsForIngredient = ref<ProductWithIngredientLink[]>([]);
    const productsStatus = ref<"idle" | "pending" | "success" | "error">("idle");
    const currentIngredientId = ref<string | null>(null);

    // Fetch products linked to an ingredient via product_ingredients table
    const getProductsForIngredient = async (
        ingredientId: string,
    ): Promise<ProductWithIngredientLink[]> => {
        if (!ingredientId) {
            productsForIngredient.value = [];
            return [];
        }

        productsStatus.value = "pending";
        currentIngredientId.value = ingredientId;

        // Query product_ingredients joined with products
        const { data, error } = await supabase
            .from("product_ingredients")
            .select("is_primary, confidence, product:products(*)")
            .eq("ingredient_id", ingredientId)
            .order("is_primary", { ascending: false });

        if (error) {
            productsStatus.value = "error";
            console.error("Error fetching products for ingredient:", error.message);
            return [];
        }

        // Transform data to flat product structure with ingredient link info
        const products: ProductWithIngredientLink[] = (data || [])
            .filter((item) => item.product)
            .map((item) => ({
                ...(item.product as Product),
                is_primary: item.is_primary,
                confidence: item.confidence,
            }));

        productsForIngredient.value = products;
        productsStatus.value = "success";
        return products;
    };

    // Filter products by search query (name or brand)
    const filterProducts = (query: string): ProductWithIngredientLink[] => {
        if (!query.trim()) {
            return productsForIngredient.value;
        }

        const lowerQuery = query.toLowerCase();
        return productsForIngredient.value.filter(
            (product) =>
                product.name?.toLowerCase().includes(lowerQuery) ||
                product.brand?.toLowerCase().includes(lowerQuery),
        );
    };

    // Get product by ID
    const getProductById = async (id: string): Promise<Product | null> => {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching product:", error.message);
            return null;
        }

        return data as Product;
    };

    // Clear current products
    const clearProducts = () => {
        productsForIngredient.value = [];
        currentIngredientId.value = null;
        productsStatus.value = "idle";
    };

    // Reset store to initial state
    const $reset = () => {
        productsForIngredient.value = [];
        currentIngredientId.value = null;
        productsStatus.value = "idle";
    };

    return {
        productsForIngredient,
        productsStatus,
        currentIngredientId,
        getProductsForIngredient,
        filterProducts,
        getProductById,
        clearProducts,
        $reset,
    };
});
