<template>
  <Teleport to="body">
    <Transition name="spotlight-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="close"
      />
    </Transition>

    <Transition name="spotlight">
      <div
        v-if="modelValue"
        class="fixed inset-x-4 top-[15%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-50"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <!-- Search input -->
          <div
            class="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700"
          >
            <Icon
              name="material-symbols:search"
              class="text-slate-400 dark:text-slate-500"
              size="20"
            />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="$t('spotlight.placeholder')"
              class="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              @input="handleSearch"
              @keydown.escape="close"
              @keydown.enter="selectFirst"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
            />
            <kbd
              class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded"
            >
              ESC
            </kbd>
          </div>

          <!-- Results -->
          <div class="max-h-80 overflow-y-auto">
            <!-- Loading state -->
            <div
              v-if="ingredientStore.searchStatus === 'pending'"
              class="flex items-center justify-center py-8"
            >
              <Icon
                name="svg-spinners:ring-resize"
                class="text-primary-500"
                size="24"
              />
            </div>

            <!-- Empty state - no query -->
            <div v-else-if="!searchQuery.trim()" class="py-8 px-4 text-center">
              <Icon
                name="material-symbols:lightbulb-outline"
                class="text-slate-300 dark:text-slate-600 mb-2"
                size="32"
              />
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ $t("spotlight.hint") }}
              </p>
            </div>

            <!-- No results -->
            <div
              v-else-if="
                ingredientStore.searchResults.length === 0 &&
                ingredientStore.searchStatus === 'success'
              "
              class="py-8 px-4 text-center"
            >
              <Icon
                name="material-symbols:search-off"
                class="text-slate-300 dark:text-slate-600 mb-2"
                size="32"
              />
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ $t("spotlight.noResults") }}
              </p>
            </div>

            <!-- Results list -->
            <ul v-else class="py-2">
              <li
                v-for="(ingredient, index) in ingredientStore.searchResults"
                :key="ingredient.id"
                :class="[
                  'px-4 py-2.5 cursor-pointer transition-colors',
                  selectedIndex === index
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                ]"
                @click="selectIngredient(ingredient)"
                @mouseenter="selectedIndex = index"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <!-- In pantry indicator -->
                    <div
                      :class="[
                        'shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                        isInPantry(ingredient.id)
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-slate-100 dark:bg-slate-800',
                      ]"
                    >
                      <Icon
                        v-if="isInPantry(ingredient.id)"
                        name="material-symbols:check"
                        class="text-green-600 dark:text-green-400"
                        size="14"
                      />
                      <Icon
                        v-else
                        name="material-symbols:add"
                        class="text-slate-400 dark:text-slate-500"
                        size="14"
                      />
                    </div>

                    <div class="min-w-0">
                      <p
                        class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate"
                      >
                        {{ getLocalizedName(ingredient) }}
                      </p>
                      <p
                        v-if="ingredient.category"
                        class="text-xs text-slate-500 dark:text-slate-400 truncate"
                      >
                        {{ ingredient.category.name }}
                      </p>
                    </div>
                  </div>

                  <!-- Badges -->
                  <div
                    class="flex items-center gap-2 shrink-0 flex-wrap justify-end"
                  >
                    <span
                      v-if="isInPantry(ingredient.id)"
                      class="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    >
                      {{ $t("spotlight.inPantry") }}
                    </span>
                    <template
                      v-if="
                        getShoppingListsForIngredient(ingredient.id).length > 0
                      "
                    >
                      <span
                        v-for="listInfo in getShoppingListsForIngredient(
                          ingredient.id,
                        )"
                        :key="listInfo.listId"
                        class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        :title="`${listInfo.quantity || ''}${listInfo.unit || ''}`"
                      >
                        {{ listInfo.listName }}
                        <span v-if="listInfo.quantity" class="opacity-70">
                          ({{ listInfo.quantity }}{{ listInfo.unit || "" }})
                        </span>
                      </span>
                    </template>
                  </div>
                </div>

                <!-- Quantity/Unit inputs when selected -->
                <div
                  v-if="selectedIngredient?.id === ingredient.id"
                  class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
                  @click.stop
                >
                  <!-- Show existing quantity notice -->
                  <div
                    v-if="getExistingItem(ingredient.id)"
                    :class="[
                      'mb-3 p-2 rounded-lg border',
                      isUnitCompatible(ingredient.id)
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                    ]"
                  >
                    <p
                      :class="[
                        'text-[11px] flex items-center gap-1',
                        isUnitCompatible(ingredient.id)
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-red-700 dark:text-red-300',
                      ]"
                    >
                      <Icon
                        :name="
                          isUnitCompatible(ingredient.id)
                            ? 'material-symbols:info'
                            : 'material-symbols:warning'
                        "
                        size="14"
                      />
                      <template v-if="isUnitCompatible(ingredient.id)">
                        {{ $t("spotlight.existingQuantity") }}:
                        {{ getExistingQuantityDisplay(ingredient.id) }} —
                        {{ $t("spotlight.willBeAdded") }}
                      </template>
                      <template v-else>
                        {{ $t("spotlight.existingQuantity") }}:
                        {{ getExistingQuantityDisplay(ingredient.id) }} —
                        {{ $t("spotlight.willOverwrite") }}
                      </template>
                    </p>
                  </div>
                  <!-- Validation error message -->
                  <div
                    v-if="validationError"
                    class="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <p
                      class="text-[11px] text-red-700 dark:text-red-300 flex items-center gap-1"
                    >
                      <Icon name="material-symbols:error" size="14" />
                      {{ validationError }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex-1">
                      <label
                        class="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                      >
                        {{ $t("spotlight.quantity") }}
                      </label>
                      <input
                        ref="quantityInputRef"
                        v-model.number="inputQuantity"
                        type="number"
                        min="0"
                        step="0.1"
                        class="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        @keydown.enter.prevent="addSelectedIngredient"
                        @keydown.escape="cancelSelection"
                      />
                    </div>
                    <div class="flex-1">
                      <label
                        class="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                      >
                        {{ $t("spotlight.unit") }}
                      </label>
                      <select
                        v-model="inputUnit"
                        class="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        @keydown.enter.prevent="addSelectedIngredient"
                        @keydown.escape="cancelSelection"
                      >
                        <option
                          v-for="unit in availableUnits"
                          :key="unit.value"
                          :value="unit.value"
                        >
                          {{ unit.label }}
                        </option>
                      </select>
                    </div>
                    <button
                      type="button"
                      class="mt-5 px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer"
                      @click="addSelectedIngredient"
                    >
                      {{
                        getExistingItem(ingredient.id)
                          ? $t("spotlight.update")
                          : $t("spotlight.add")
                      }}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          >
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ $t("spotlight.addingTo") }}
              <span class="font-medium text-slate-700 dark:text-slate-300">
                {{ currentListName }}
              </span>
            </p>
            <div
              class="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500"
            >
              <kbd class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded"
                >↑↓</kbd
              >
              <span>{{ $t("spotlight.navigate") }}</span>
              <kbd class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded"
                >↵</kbd
              >
              <span>{{ $t("spotlight.select") }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Product Selection Modal -->
    <ProductSelectModal
      v-model="isProductModalOpen"
      :ingredient-id="selectedIngredient?.id ?? ''"
      :ingredient-name="getLocalizedName(selectedIngredient)"
      @select="handleProductSelect"
    />
  </Teleport>
</template>

<script setup lang="ts">
import type { IngredientWithCategory, Product } from "~/types/database";
import { useIngredientStore } from "~/composables/storeIngredient";
import { usePantryItemsStore } from "~/composables/storePantryItems";
import { useShoppingListStore } from "~/composables/storeShoppingList";
import {
  areUnitsComparable,
  formatSmartQuantity,
} from "~/utils/unitConversion";

const props = defineProps<{
  modelValue: boolean;
  mode: "pantry" | "shopping";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const ingredientStore = useIngredientStore();
const pantryStore = usePantryItemsStore();
const shoppingListStore = useShoppingListStore();

const { t } = useI18n();
const { getLocalizedName } = useLocalizedName();

// Validation error message
const validationError = ref<string | null>(null);

const searchInputRef = ref<HTMLInputElement | null>(null);
const quantityInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref("");
const selectedIndex = ref(0);

// Selected ingredient for quantity/unit input
const selectedIngredient = ref<IngredientWithCategory | null>(null);
const inputQuantity = ref<number>(1);
const inputUnit = ref<string>("pcs");

// Product selection modal state (only for shopping mode)
const isProductModalOpen = ref(false);
const pendingProductId = ref<string | null>(null);

// Available units
const availableUnits = [
  { value: "pcs", label: t("units.pcs") },
  { value: "g", label: t("units.g") },
  { value: "kg", label: t("units.kg") },
  { value: "ml", label: t("units.ml") },
  { value: "l", label: t("units.l") },
  { value: "tbsp", label: t("units.tbsp") },
  { value: "tsp", label: t("units.tsp") },
];

const currentListName = computed(() => {
  if (props.mode === "pantry") {
    return t("list.tabs.pantry");
  }
  return shoppingListStore.selectedList?.name ?? "—";
});

// Focus input when opened
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        searchInputRef.value?.focus();
      });
    } else {
      searchQuery.value = "";
      selectedIndex.value = 0;
      selectedIngredient.value = null;
      inputQuantity.value = 1;
      inputUnit.value = "pcs";
      validationError.value = null;
      isProductModalOpen.value = false;
      pendingProductId.value = null;
      ingredientStore.clearSearch();
    }
  },
);

// Global keyboard shortcut
onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});

const handleGlobalKeydown = (e: KeyboardEvent) => {
  // CMD/CTRL + K to open
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    emit("update:modelValue", !props.modelValue);
  }
};

const close = () => {
  emit("update:modelValue", false);
};

const handleSearch = () => {
  selectedIndex.value = 0;
  ingredientStore.debouncedSearch(searchQuery.value);
};

const isInPantry = (ingredientId: string): boolean => {
  return pantryStore.hasIngredient(ingredientId);
};

// Get all shopping lists that contain this ingredient
const getShoppingListsForIngredient = (ingredientId: string) => {
  return shoppingListStore.getListsContainingIngredient(ingredientId);
};

// Get existing item based on mode (pantry or shopping list)
const getExistingItem = (ingredientId: string) => {
  if (props.mode === "pantry") {
    return pantryStore.getByIngredientId(ingredientId);
  } else {
    return shoppingListStore.getItemByIngredientId(ingredientId);
  }
};

// Check if units are compatible for combining quantities
const isUnitCompatible = (ingredientId: string): boolean => {
  const existing = getExistingItem(ingredientId);
  if (!existing || !existing.unit || !inputUnit.value) return true;
  return areUnitsComparable(existing.unit, inputUnit.value);
};

// Get formatted existing quantity string
const getExistingQuantityDisplay = (ingredientId: string): string => {
  const existing = getExistingItem(ingredientId);
  if (!existing) return "";
  return formatSmartQuantity(existing.quantity, existing.unit);
};

const navigateDown = () => {
  if (selectedIndex.value < ingredientStore.searchResults.length - 1) {
    selectedIndex.value++;
  }
};

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

const selectFirst = () => {
  const selected = ingredientStore.searchResults[selectedIndex.value];
  if (selected) {
    selectIngredient(selected);
  }
};

// Select an ingredient to show quantity/unit inputs
const selectIngredient = (ingredient: IngredientWithCategory) => {
  if (selectedIngredient.value?.id === ingredient.id) {
    // Already selected, add it
    addSelectedIngredient();
  } else {
    // Select and show inputs
    selectedIngredient.value = ingredient;
    inputQuantity.value = 1;
    inputUnit.value = "pcs";
    nextTick(() => {
      quantityInputRef.value?.focus();
    });
  }
};

// Cancel selection and go back to search
const cancelSelection = () => {
  selectedIngredient.value = null;
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

// Add the selected ingredient with quantity/unit
const addSelectedIngredient = async () => {
  if (!selectedIngredient.value) return;

  // Validate input
  validationError.value = null;

  if (!inputQuantity.value || inputQuantity.value <= 0) {
    validationError.value = t("spotlight.errorInvalidQuantity");
    return;
  }

  if (!inputUnit.value) {
    validationError.value = t("spotlight.errorNoUnit");
    return;
  }

  // For shopping mode, open product selection modal first
  if (props.mode === "shopping") {
    isProductModalOpen.value = true;
    return;
  }

  // For pantry mode, add directly (no product selection)
  await doAddItem(null);
};

// Handle product selection from modal
const handleProductSelect = async (product: Product | null) => {
  pendingProductId.value = product?.id ?? null;
  await doAddItem(product?.id ?? null);
};

// Actually add the item with optional product_id
const doAddItem = async (productId: string | null) => {
  if (!selectedIngredient.value) return;

  let result: {
    success: boolean;
    action: "added" | "updated" | "error" | "frozen";
  };

  if (props.mode === "pantry") {
    // Add or update pantry item
    result = await pantryStore.addOrUpdateItem({
      ingredient_id: selectedIngredient.value.id,
      quantity: inputQuantity.value || null,
      unit: inputUnit.value || null,
    });
  } else {
    // Add or update shopping list item
    if (!shoppingListStore.selectedListId) {
      console.warn("No shopping list selected");
      return;
    }
    result = await shoppingListStore.addOrUpdateItemInList(
      shoppingListStore.selectedListId,
      {
        ingredient_id: selectedIngredient.value.id,
        product_id: productId,
        quantity: inputQuantity.value || null,
        unit: inputUnit.value || null,
      },
    );
  }

  if (result.action === "frozen") {
    // Show error for frozen list
    validationError.value = t("list.shopping.listFrozenError");
    return;
  }

  if (result.success) {
    // Clear inputs but keep spotlight open for adding more items
    selectedIngredient.value = null;
    inputQuantity.value = 1;
    inputUnit.value = "pcs";
    validationError.value = null;
    pendingProductId.value = null;
    // Focus back on search input for quick next search
    nextTick(() => {
      searchInputRef.value?.focus();
      searchInputRef.value?.select();
    });
  }
};
</script>

<style scoped>
/* Backdrop transition */
.spotlight-backdrop-enter-active,
.spotlight-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.spotlight-backdrop-enter-from,
.spotlight-backdrop-leave-to {
  opacity: 0;
}

/* Modal transition - simple fade */
.spotlight-enter-active,
.spotlight-leave-active {
  transition: opacity 0.2s ease;
}

.spotlight-enter-from,
.spotlight-leave-to {
  opacity: 0;
}
</style>
