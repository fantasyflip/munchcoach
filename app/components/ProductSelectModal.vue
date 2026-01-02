<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
        @click="close"
      />
    </Transition>

    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-x-4 top-[20%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-60"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700"
          >
            <h3
              class="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              {{ $t("productSelect.title") }}
            </h3>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              @click="close"
            >
              <Icon name="material-symbols:close" size="20" />
            </button>
          </div>

          <!-- Search input -->
          <div
            class="px-4 py-3 border-b border-slate-200 dark:border-slate-700"
          >
            <div class="flex items-center gap-2">
              <Icon
                name="material-symbols:search"
                class="text-slate-400 dark:text-slate-500"
                size="18"
              />
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                :placeholder="$t('productSelect.searchPlaceholder')"
                class="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                @keydown.escape="close"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="max-h-64 overflow-y-auto">
            <!-- Loading state -->
            <div
              v-if="productStore.productsStatus === 'pending'"
              class="flex items-center justify-center py-8"
            >
              <Icon
                name="svg-spinners:ring-resize"
                class="text-primary-500"
                size="24"
              />
            </div>

            <template v-else>
              <!-- Generic option (always shown first) -->
              <button
                type="button"
                class="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800"
                @click="selectGeneric"
              >
                <div
                  class="shrink-0 w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols:category-outline"
                    class="text-primary-600 dark:text-primary-400"
                    size="20"
                  />
                </div>
                <div class="flex-1 min-w-0 text-left">
                  <p
                    class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate"
                  >
                    {{ ingredientName }}
                  </p>
                  <p class="text-xs text-primary-600 dark:text-primary-400">
                    {{ $t("productSelect.genericOption") }}
                  </p>
                </div>
                <Icon
                  name="material-symbols:arrow-forward"
                  class="text-slate-400"
                  size="18"
                />
              </button>

              <!-- Products list -->
              <div v-if="filteredProducts.length > 0" class="py-1">
                <button
                  v-for="product in filteredProducts"
                  :key="product.id"
                  type="button"
                  class="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  @click="selectProduct(product)"
                >
                  <div
                    class="shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                  >
                    <Icon
                      name="material-symbols:inventory-2-outline"
                      class="text-slate-500 dark:text-slate-400"
                      size="20"
                    />
                  </div>
                  <div class="flex-1 min-w-0 text-left">
                    <p
                      class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate"
                    >
                      {{ getLocalizedName(product) }}
                    </p>
                    <p
                      v-if="product.brand"
                      class="text-xs text-slate-500 dark:text-slate-400 truncate"
                    >
                      {{ product.brand }}
                    </p>
                  </div>
                  <Icon
                    name="material-symbols:arrow-forward"
                    class="text-slate-400"
                    size="18"
                  />
                </button>
              </div>

              <!-- No products message -->
              <div
                v-else-if="productStore.productsStatus === 'success'"
                class="py-6 px-4 text-center"
              >
                <Icon
                  name="material-symbols:search-off"
                  class="text-slate-300 dark:text-slate-600 mb-2"
                  size="32"
                />
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ $t("productSelect.noProducts") }}
                </p>
              </div>
            </template>
          </div>

          <!-- Footer hint -->
          <div
            class="px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          >
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ $t("productSelect.hint") }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Product } from "~/types/database";
import { useProductStore } from "~/composables/storeProduct";

const props = defineProps<{
  modelValue: boolean;
  ingredientId: string;
  ingredientName: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "select", product: Product | null): void;
}>();

const productStore = useProductStore();
const { getLocalizedName } = useLocalizedName();

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref("");

// Filtered products based on search
const filteredProducts = computed(() => {
  return productStore.filterProducts(searchQuery.value);
});

// Focus input and load products when opened
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      searchQuery.value = "";
      await productStore.getProductsForIngredient(props.ingredientId);
      nextTick(() => {
        searchInputRef.value?.focus();
      });
    } else {
      productStore.clearProducts();
    }
  },
);

const close = () => {
  emit("update:modelValue", false);
};

const selectGeneric = () => {
  emit("select", null);
  close();
};

const selectProduct = (product: Product) => {
  emit("select", product);
  close();
};
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}
</style>
