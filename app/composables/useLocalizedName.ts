/**
 * Composable for getting localized names for ingredients and products.
 * Uses the German name (name_de) when the locale is set to German and
 * the field has a value, otherwise falls back to the default name.
 */
export function useLocalizedName() {
    const { locale } = useI18n();

    /**
     * Get the localized name for an ingredient or product.
     * @param item - Object with name and optional name_de fields
     * @returns The localized name string, or "Unknown" if item is null/undefined
     */
    function getLocalizedName(
        item: { name: string | null; name_de?: string | null } | null | undefined,
    ): string {
        if (!item) return "Unknown";

        // Use German name if locale is German and German name exists
        if (locale.value === "de" && item.name_de) {
            return item.name_de;
        }

        // Fall back to default name
        return item.name || "Unknown";
    }

    return { getLocalizedName };
}
