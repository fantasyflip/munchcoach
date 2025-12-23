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
                  'flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                  selectedIndex === index
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                ]"
                @click="addIngredient(ingredient)"
                @mouseenter="selectedIndex = index"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <!-- In pantry indicator -->
                  <div
                    :class="[
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
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
                      {{ ingredient.name }}
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
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span
                    v-if="isInPantry(ingredient.id)"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  >
                    {{ $t("spotlight.inPantry") }}
                  </span>
                  <span
                    v-if="isInShoppingList(ingredient.id)"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  >
                    {{ $t("spotlight.inList") }}
                  </span>
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
  </Teleport>
</template>

<script setup lang="ts">
import type { IngredientWithCategory } from "~/types/database";
import { useIngredientStore } from "~/composables/storeIngredient";
import { usePantryItemsStore } from "~/composables/storePantryItems";
import { useShoppingListStore } from "~/composables/storeShoppingList";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const ingredientStore = useIngredientStore();
const pantryStore = usePantryItemsStore();
const shoppingListStore = useShoppingListStore();

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref("");
const selectedIndex = ref(0);

const currentListName = computed(() => {
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

const isInShoppingList = (ingredientId: string): boolean => {
  return shoppingListStore.hasIngredientInList(ingredientId);
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
    addIngredient(selected);
  }
};

const addIngredient = async (ingredient: IngredientWithCategory) => {
  if (!shoppingListStore.selectedListId) {
    console.warn("No shopping list selected");
    return;
  }

  // Add to shopping list
  const success = await shoppingListStore.addItemToList(
    shoppingListStore.selectedListId,
    {
      ingredient_id: ingredient.id,
    },
  );

  if (success) {
    // Clear and close
    searchQuery.value = "";
    ingredientStore.clearSearch();
    close();
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

/* Modal transition */
.spotlight-enter-active,
.spotlight-leave-active {
  transition: all 0.2s ease;
}

.spotlight-enter-from,
.spotlight-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.98);
}
</style>
