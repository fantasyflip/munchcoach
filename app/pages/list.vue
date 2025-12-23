<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
    <header
      class="mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
    >
      <div class="space-y-1">
        <h1
          class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          {{ $t("list.title") }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {{ $t("list.subtitle") }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Spotlight search trigger -->
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-500/50 transition-colors whitespace-nowrap cursor-pointer"
          @click="isSpotlightOpen = true"
        >
          <Icon name="material-symbols:search" size="18" class="shrink-0" />
          <span class="hidden sm:inline">{{
            $t("list.searchIngredients")
          }}</span>
          <kbd
            class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 rounded"
          >
            <span>⌘</span>K
          </kbd>
        </button>
        <!-- Chat CTA button -->
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          @click="isChatOpen = true"
        >
          <Icon
            name="material-symbols:chat-bubble-outline"
            size="18"
            class="shrink-0"
          />
          <span class="hidden sm:inline">{{ $t("list.fabLabel") }}</span>
        </button>
        <!-- AI connection status - subtle -->
        <div
          class="hidden md:flex text-[10px] px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 items-center gap-1"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span class="hidden lg:inline">AI</span>
        </div>
      </div>
    </header>

    <!-- Tabs for Pantry/Shopping List -->
    <div
      class="flex items-center gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit"
    >
      <button
        type="button"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
          activeTab === 'pantry'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        ]"
        @click="activeTab = 'pantry'"
      >
        <span class="flex items-center gap-2">
          <Icon name="material-symbols:kitchen" size="18" />
          {{ $t("list.tabs.pantry") }}
        </span>
      </button>
      <button
        type="button"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
          activeTab === 'shopping'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        ]"
        @click="activeTab = 'shopping'"
      >
        <span class="flex items-center gap-2">
          <Icon name="material-symbols:shopping-cart-outline" size="18" />
          {{ $t("list.tabs.shopping") }}
        </span>
      </button>
    </div>

    <!-- Pantry Section -->
    <section
      v-if="activeTab === 'pantry'"
      class="rounded-2xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 backdrop-blur-md p-4 sm:p-5"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium flex items-center gap-2">
          <Icon
            name="material-symbols:kitchen"
            size="18"
            class="text-primary-500"
          />
          {{ $t("list.pantry.title") }}
        </h2>
        <button
          type="button"
          class="text-[11px] text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center gap-1 cursor-pointer"
          @click="isSpotlightOpen = true"
        >
          <Icon name="material-symbols:add" size="14" />
          {{ $t("list.pantry.addItem") }}
        </button>
      </div>

      <!-- Loading state -->
      <div
        v-if="pantryStore.status === 'pending'"
        class="flex items-center justify-center py-8"
      >
        <Icon
          name="svg-spinners:ring-resize"
          class="text-primary-500"
          size="24"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!pantryStore.items?.length"
        class="text-xs sm:text-sm text-slate-500 py-8 text-center"
      >
        <Icon
          name="material-symbols:kitchen"
          class="text-slate-300 dark:text-slate-600 mb-2"
          size="40"
        />
        <p>{{ $t("list.pantry.emptyState") }}</p>
        <button
          type="button"
          class="mt-3 text-primary-600 dark:text-primary-400 hover:underline"
          @click="isSpotlightOpen = true"
        >
          {{ $t("list.pantry.addFirst") }}
        </button>
      </div>

      <!-- Pantry items list -->
      <ul v-else class="space-y-2 max-h-105 overflow-y-auto pr-1">
        <li
          v-for="item in pantryStore.items"
          :key="item.id"
          class="rounded-xl px-3 py-2 bg-white/90 border border-slate-200 hover:border-primary-500/50 transition-colors dark:bg-slate-900/80 dark:border-slate-700/60"
        >
          <div class="flex items-center gap-3">
            <div
              class="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
            >
              <Icon
                name="material-symbols:check"
                class="text-green-600 dark:text-green-400"
                size="16"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate"
              >
                {{ item.ingredient?.name || "Unknown" }}
              </p>
              <p
                v-if="item.quantity || item.unit"
                class="text-xs text-slate-500 dark:text-slate-400"
              >
                {{ item.quantity }} {{ item.unit }}
              </p>
            </div>
            <button
              type="button"
              class="text-[11px] text-slate-400 hover:text-red-500 dark:hover:text-red-300 transition-colors cursor-pointer"
              @click="removePantryItem(item.id)"
            >
              <Icon name="material-symbols:close" size="18" />
            </button>
          </div>

          <!-- Shopping list needs info -->
          <div
            v-if="
              item.ingredient_id &&
              getShoppingListsNeedingItem(item.ingredient_id).length > 0
            "
            class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <div
              class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-wrap"
            >
              <Icon name="material-symbols:shopping-cart-outline" size="14" />
              <span>{{ $t("list.pantry.neededIn") }}:</span>
              <button
                v-for="(listInfo, idx) in getShoppingListsNeedingItem(
                  item.ingredient_id,
                )"
                :key="listInfo.listId"
                type="button"
                class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                @click="
                  switchToList(listInfo.listId);
                  activeTab = 'shopping';
                "
              >
                {{ listInfo.listName }}
                <span v-if="listInfo.quantity" class="opacity-70"
                  >({{ listInfo.quantity }}{{ listInfo.unit || "" }})</span
                ><span
                  v-if="
                    idx <
                    getShoppingListsNeedingItem(item.ingredient_id).length - 1
                  "
                  >,
                </span>
              </button>
            </div>
            <!-- Remaining quantity after needs -->
            <div
              v-if="item.quantity"
              class="mt-1 text-[11px] flex items-center gap-1"
              :class="
                getRemainingAfterNeeds(
                  item.ingredient_id,
                  item.quantity,
                  item.unit,
                ).isNegative
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-green-600 dark:text-green-400'
              "
            >
              <Icon
                :name="
                  getRemainingAfterNeeds(
                    item.ingredient_id,
                    item.quantity,
                    item.unit,
                  ).isNegative
                    ? 'material-symbols:warning'
                    : 'material-symbols:check-circle'
                "
                size="14"
              />
              <template
                v-if="
                  getRemainingAfterNeeds(
                    item.ingredient_id,
                    item.quantity,
                    item.unit,
                  ).isNegative
                "
              >
                {{ $t("list.pantry.shortage") }}:
                {{
                  formatSmartQuantity(
                    getRemainingAfterNeeds(
                      item.ingredient_id,
                      item.quantity,
                      item.unit,
                    ).remaining,
                    getRemainingAfterNeeds(
                      item.ingredient_id,
                      item.quantity,
                      item.unit,
                    ).unit,
                  )
                }}
              </template>
              <template v-else>
                {{ $t("list.pantry.remaining") }}:
                {{
                  formatSmartQuantity(
                    getRemainingAfterNeeds(
                      item.ingredient_id,
                      item.quantity,
                      item.unit,
                    ).remaining,
                    getRemainingAfterNeeds(
                      item.ingredient_id,
                      item.quantity,
                      item.unit,
                    ).unit,
                  )
                }}
              </template>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- Shopping List Section -->
    <section v-if="activeTab === 'shopping'" class="space-y-4">
      <!-- Shopping list selector -->
      <div
        class="rounded-2xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 backdrop-blur-md p-4 sm:p-5"
      >
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <div class="flex items-center gap-2 flex-1">
            <Icon
              name="material-symbols:shopping-cart-outline"
              size="18"
              class="text-primary-500"
            />
            <label for="list-select" class="text-sm font-medium">
              {{ $t("list.shopping.selectList") }}
            </label>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <select
              id="list-select"
              v-model="shoppingListStore.selectedListId"
              class="flex-1 sm:flex-none px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option
                v-for="list in shoppingListStore.lists"
                :key="list.id"
                :value="list.id"
              >
                {{ list.name }} ({{ list.shopping_list_items?.length || 0 }})
              </option>
            </select>
            <button
              type="button"
              class="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors cursor-pointer"
              :title="$t('list.shopping.newList')"
              @click="showNewListModal = true"
            >
              <Icon name="material-symbols:add" size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Selected list items -->
      <div
        class="rounded-2xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 backdrop-blur-md p-4 sm:p-5"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium">
            {{
              shoppingListStore.selectedList?.name || $t("list.shopping.noList")
            }}
          </h2>
          <button
            v-if="
              shoppingListStore.selectedListItems.some((i) => i.is_purchased)
            "
            type="button"
            class="text-[11px] text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300 transition-colors cursor-pointer"
            @click="clearPurchased"
          >
            {{ $t("list.clearChecked") }}
          </button>
        </div>

        <!-- Loading state -->
        <div
          v-if="shoppingListStore.status === 'pending'"
          class="flex items-center justify-center py-8"
        >
          <Icon
            name="svg-spinners:ring-resize"
            class="text-primary-500"
            size="24"
          />
        </div>

        <!-- No list selected -->
        <div
          v-else-if="!shoppingListStore.selectedList"
          class="text-xs sm:text-sm text-slate-500 py-8 text-center"
        >
          <Icon
            name="material-symbols:list-alt"
            class="text-slate-300 dark:text-slate-600 mb-2"
            size="40"
          />
          <p>{{ $t("list.shopping.noListSelected") }}</p>
          <button
            type="button"
            class="mt-3 text-primary-600 dark:text-primary-400 hover:underline"
            @click="showNewListModal = true"
          >
            {{ $t("list.shopping.createFirst") }}
          </button>
        </div>

        <!-- Empty list -->
        <div
          v-else-if="!shoppingListStore.selectedListItems.length"
          class="text-xs sm:text-sm text-slate-500 py-8 text-center"
        >
          <Icon
            name="material-symbols:shopping-cart-outline"
            class="text-slate-300 dark:text-slate-600 mb-2"
            size="40"
          />
          <p>{{ $t("list.shopping.emptyList") }}</p>
          <button
            type="button"
            class="mt-3 text-primary-600 dark:text-primary-400 hover:underline"
            @click="isSpotlightOpen = true"
          >
            {{ $t("list.shopping.addFirst") }}
          </button>
        </div>

        <!-- Shopping list items -->
        <ul v-else class="space-y-2 max-h-105 overflow-y-auto pr-1">
          <li
            v-for="item in shoppingListStore.selectedListItems"
            :key="item.id"
            class="rounded-xl px-3 py-2 bg-white/90 border border-slate-200 hover:border-primary-500/50 transition-colors dark:bg-slate-900/80 dark:border-slate-700/60"
          >
            <div class="flex items-center gap-3">
              <NXW-Checkbox
                :model-value="item.is_purchased"
                class="flex-1"
                :color="{
                  label: 'text-slate-900 dark:text-slate-100',
                  iconInactive: 'text-slate-500 dark:text-slate-400',
                  iconActive: 'text-primary-600 dark:text-primary-400',
                  hover:
                    'group-hover:text-primary-600 dark:group-hover:text-primary-300',
                }"
                @update:model-value="togglePurchased(item.id, $event)"
              >
                <template #label>
                  <span
                    class="text-xs sm:text-sm"
                    :class="{
                      'line-through text-slate-500 dark:text-slate-400':
                        item.is_purchased,
                    }"
                  >
                    {{ item.ingredient?.name || "Unknown" }}
                    <span
                      v-if="item.quantity || item.unit"
                      class="text-slate-400 dark:text-slate-500"
                    >
                      · {{ formatQuantity(item.quantity, item.unit) }}
                    </span>
                  </span>
                </template>
              </NXW-Checkbox>
              <button
                type="button"
                class="text-[11px] text-slate-400 hover:text-red-500 dark:hover:text-red-300 cursor-pointer"
                @click="removeShoppingItem(item.id)"
              >
                {{ $t("list.remove") }}
              </button>
            </div>

            <!-- Show if item is also in other shopping lists -->
            <div
              v-if="
                item.ingredient_id &&
                getOtherListsForItem(item.ingredient_id).length > 0
              "
              class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <div
                class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-wrap"
              >
                <Icon name="material-symbols:format-list-bulleted" size="14" />
                <span>{{ $t("list.shopping.alsoInLists") }}:</span>
                <button
                  v-for="(listInfo, idx) in getOtherListsForItem(
                    item.ingredient_id,
                  )"
                  :key="listInfo.listId"
                  type="button"
                  class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  @click="switchToList(listInfo.listId)"
                >
                  {{ listInfo.listName }}
                  <span v-if="listInfo.quantity" class="opacity-70"
                    >({{ listInfo.quantity }}{{ listInfo.unit || "" }})</span
                  ><span
                    v-if="
                      idx < getOtherListsForItem(item.ingredient_id).length - 1
                    "
                    >,
                  </span>
                </button>
              </div>
            </div>

            <!-- Add to pantry suggestion when purchased and not in pantry -->
            <div
              v-if="item.is_purchased && !getPantryStatus(item)"
              class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1"
                >
                  <Icon name="material-symbols:inventory-2-outline" size="14" />
                  {{ $t("list.shopping.addToPantrySuggestion") }}
                </span>
                <button
                  type="button"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                  @click="addPurchasedToPantry(item)"
                >
                  {{ $t("list.shopping.addToPantry") }}
                </button>
              </div>
            </div>

            <!-- Update pantry suggestion when purchased and already in pantry -->
            <div
              v-else-if="item.is_purchased && getPantryStatus(item)"
              class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <div class="flex items-center justify-between">
                <span
                  class="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1"
                >
                  <Icon name="material-symbols:sync" size="14" />
                  {{ $t("list.shopping.updatePantrySuggestion") }}
                  ({{
                    formatSmartQuantity(
                      getPantryStatus(item)?.pantryQuantity,
                      getPantryStatus(item)?.pantryUnit,
                    )
                  }}
                  → +{{ formatSmartQuantity(item.quantity, item.unit) }})
                </span>
                <button
                  type="button"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                  @click="addPurchasedToPantry(item)"
                >
                  {{ $t("list.shopping.updatePantry") }}
                </button>
              </div>
            </div>

            <!-- Pantry status indicator (when not purchased) -->
            <div
              v-else-if="!item.is_purchased && getPantryStatus(item)"
              class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <div
                v-if="getPantryStatus(item)?.type === 'sufficient'"
                class="flex items-center justify-between"
              >
                <span
                  class="text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1"
                >
                  <Icon name="material-symbols:check-circle" size="14" />
                  {{ $t("list.shopping.inPantry") }}
                  ({{
                    formatSmartQuantity(
                      getPantryStatus(item)?.pantryQuantity,
                      getPantryStatus(item)?.pantryUnit,
                    )
                  }})
                </span>
                <button
                  type="button"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
                  @click="togglePurchased(item.id, true)"
                >
                  {{ $t("list.shopping.markAsBought") }}
                </button>
              </div>
              <div
                v-else-if="getPantryStatus(item)?.type === 'insufficient'"
                class="text-[11px] text-blue-600 dark:text-blue-400"
              >
                <div class="flex items-center gap-1">
                  <Icon name="material-symbols:info" size="14" />
                  {{ $t("list.shopping.partiallyInPantry") }}
                </div>
                <div class="mt-1 text-slate-500 dark:text-slate-400">
                  {{ $t("list.shopping.inPantryAmount") }}:
                  {{
                    formatSmartQuantity(
                      getPantryStatus(item)?.pantryQuantity,
                      getPantryStatus(item)?.pantryUnit,
                    )
                  }}, {{ $t("list.shopping.needed") }}:
                  {{ formatSmartQuantity(item.quantity, item.unit) }},
                  {{ $t("list.shopping.missing") }}:
                  {{
                    formatSmartQuantity(
                      getPantryStatus(item)?.missingQuantity,
                      getPantryStatus(item)?.missingUnit,
                    )
                  }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- New List Modal -->
    <Teleport to="body">
      <Transition name="modal-backdrop">
        <div
          v-if="showNewListModal"
          class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          @click="showNewListModal = false"
        />
      </Transition>
      <Transition name="modal">
        <div
          v-if="showNewListModal"
          class="fixed inset-x-4 top-[30%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50"
        >
          <div
            class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3
              class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4"
            >
              {{ $t("list.shopping.newListTitle") }}
            </h3>
            <form @submit.prevent="createNewList">
              <NXW-Textfield
                v-model="newListName"
                :label="$t('list.shopping.listNameLabel')"
                :placeholder="$t('list.shopping.listNamePlaceholder')"
                outlined
                class="mb-4"
                :color="{
                  bg: 'dark:bg-slate-800 bg-white',
                }"
              />
              <div class="flex justify-end gap-3">
                <NXW-Button
                  type="button"
                  outlined
                  rounded
                  @click="showNewListModal = false"
                >
                  {{ $t("list.shopping.cancel") }}
                </NXW-Button>
                <NXW-Button
                  type="submit"
                  rounded
                  shadow
                  :disabled="!newListName.trim()"
                >
                  {{ $t("list.shopping.create") }}
                </NXW-Button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Floating chat button -->
    <button
      type="button"
      class="group cursor-pointer fixed bottom-6 right-6 sm:bottom-8 sm:right-8 h-14 w-14 hover:w-64 px-0 hover:px-4 gap-0 hover:gap-2 rounded-full bg-primary-600 hover:bg-primary-500 text-slate-950 shadow-xl shadow-primary-600/40 flex items-center justify-center overflow-hidden transition-[width,padding,gap] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      :aria-label="$t('list.fabLabel')"
      @click="isChatOpen = true"
    >
      <div
        class="relative flex h-8 w-8 items-center justify-center leading-none"
      >
        <Icon name="material-symbols:chat-bubble-outline" size="32" />
        <AppLogoIcon class="absolute size-4 top-1.5 left-2" />
      </div>
      <div
        class="max-w-0 opacity-0 overflow-hidden whitespace-nowrap leading-none transition-[max-width,opacity] duration-200 group-hover:max-w-48 group-hover:opacity-100"
      >
        {{ $t("list.fabLabel") }}
      </div>
    </button>

    <ListChat v-model="isChatOpen" />
    <SpotlightSearch v-model="isSpotlightOpen" :mode="activeTab" />
  </div>
</template>

<script setup lang="ts">
import type { ShoppingListItemWithIngredient } from "~/types/database";
import { usePantryItemsStore } from "~/composables/storePantryItems";
import { useShoppingListStore } from "~/composables/storeShoppingList";
import {
  compareQuantities,
  convertUnit,
  areUnitsComparable,
  formatSmartQuantity,
  roundQuantity,
} from "~/utils/unitConversion";

const { t } = useI18n();

useHead(() => ({
  title: t("seo.pages.list.title"),
  meta: [
    {
      name: "description",
      content: t("seo.pages.list.description"),
      key: "description",
    },
  ],
}));

// Stores
const pantryStore = usePantryItemsStore();
const shoppingListStore = useShoppingListStore();

// UI State - with localStorage persistence
const activeTab = ref<"pantry" | "shopping">("pantry");
const isChatOpen = ref(false);
const isSpotlightOpen = ref(false);
const showNewListModal = ref(false);
const newListName = ref("");

// Load persisted tab from localStorage
onMounted(() => {
  if (import.meta.client) {
    const savedTab = localStorage.getItem("munchcoach:activeTab");
    if (savedTab === "pantry" || savedTab === "shopping") {
      activeTab.value = savedTab;
    }
  }
});

// Persist tab selection to localStorage
watch(activeTab, (newTab) => {
  if (import.meta.client) {
    localStorage.setItem("munchcoach:activeTab", newTab);
  }
});

// Check for openChat query param to auto-open chat after login redirect
const route = useRoute();
onMounted(() => {
  if (route.query.openChat === "true") {
    isChatOpen.value = true;
    // Clean up the query param from URL without triggering navigation
    const router = useRouter();
    router.replace({ query: {} });
  }
});

// Format quantity with unit
const formatQuantity = (
  quantity: number | null | undefined,
  unit: string | null | undefined,
): string => {
  if (!quantity && !unit) return "";
  if (!quantity) return unit || "";
  if (!unit) return String(quantity);
  return `${quantity}${unit}`;
};

// Get pantry status for a shopping list item
interface PantryStatus {
  type: "sufficient" | "insufficient";
  pantryQuantity: number | null;
  pantryUnit: string | null;
  missingQuantity: number | null;
  missingUnit: string | null;
  convertedPantryQuantity: number | null;
}

// Get other shopping lists containing an ingredient (excluding current)
const getOtherListsForItem = (ingredientId: string) => {
  return shoppingListStore.getOtherListsContainingIngredient(ingredientId);
};

// Switch to a different shopping list
const switchToList = (listId: string) => {
  shoppingListStore.selectList(listId);
};

// Get shopping lists that need a pantry item (for pantry view)
interface ShoppingListNeed {
  listId: string;
  listName: string;
  quantity: number | null;
  unit: string | null;
}

const getShoppingListsNeedingItem = (
  ingredientId: string,
): ShoppingListNeed[] => {
  return shoppingListStore.getListsContainingIngredient(ingredientId);
};

// Calculate remaining quantity after fulfilling shopping list needs
const getRemainingAfterNeeds = (
  ingredientId: string,
  pantryQuantity: number | null,
  pantryUnit: string | null,
): { remaining: number | null; unit: string | null; isNegative: boolean } => {
  const needs = getShoppingListsNeedingItem(ingredientId);

  // If no pantry quantity or no needs, return the pantry quantity as-is
  if (pantryQuantity === null || pantryQuantity === undefined) {
    return { remaining: null, unit: pantryUnit, isNegative: false };
  }

  if (needs.length === 0) {
    return { remaining: pantryQuantity, unit: pantryUnit, isNegative: false };
  }

  let totalNeeded = 0;
  let hasIncompatibleUnits = false;

  for (const need of needs) {
    if (need.quantity && need.quantity > 0) {
      // Check if units are compatible
      if (
        need.unit &&
        pantryUnit &&
        areUnitsComparable(need.unit, pantryUnit)
      ) {
        // Convert the need quantity to pantry unit
        const converted = convertUnit(need.quantity, need.unit, pantryUnit);
        if (converted !== null) {
          totalNeeded += converted;
        } else {
          hasIncompatibleUnits = true;
        }
      } else if (
        need.unit === pantryUnit ||
        (!need.unit && !pantryUnit) ||
        !need.unit ||
        !pantryUnit
      ) {
        // Same unit or one/both are null - add directly
        totalNeeded += need.quantity;
      } else {
        // Units exist but are incompatible
        hasIncompatibleUnits = true;
      }
    }
  }

  // If we had incompatible units and couldn't convert anything, return null
  if (hasIncompatibleUnits && totalNeeded === 0) {
    return { remaining: null, unit: pantryUnit, isNegative: false };
  }

  const remaining = pantryQuantity - totalNeeded;
  return {
    remaining: roundQuantity(Math.abs(remaining)),
    unit: pantryUnit,
    isNegative: remaining < 0,
  };
};

const getPantryStatus = (
  item: ShoppingListItemWithIngredient,
): PantryStatus | null => {
  if (!item.ingredient_id) return null;

  const pantryItem = pantryStore.getByIngredientId(item.ingredient_id);
  if (!pantryItem) return null;

  // Use unit conversion for comparison
  const comparison = compareQuantities(
    pantryItem.quantity,
    pantryItem.unit,
    item.quantity,
    item.unit,
  );

  return {
    type: comparison.sufficient ? "sufficient" : "insufficient",
    pantryQuantity: pantryItem.quantity,
    pantryUnit: pantryItem.unit,
    missingQuantity: comparison.missingQuantity,
    missingUnit: comparison.missingUnit,
    convertedPantryQuantity: comparison.convertedHaveQuantity,
  };
};

// Actions
const removePantryItem = async (itemId: string) => {
  await pantryStore.removeItem(itemId);
};

const removeShoppingItem = async (itemId: string) => {
  await shoppingListStore.removeItemFromList(itemId);
};

const togglePurchased = async (itemId: string, isPurchased: boolean) => {
  await shoppingListStore.toggleItemPurchased(itemId, isPurchased);
};

// Add purchased item to pantry
const addPurchasedToPantry = async (item: ShoppingListItemWithIngredient) => {
  if (!item.ingredient_id) return;

  await pantryStore.addOrUpdateItem({
    ingredient_id: item.ingredient_id,
    quantity: item.quantity,
    unit: item.unit,
  });
};

const clearPurchased = async () => {
  const purchasedItems = shoppingListStore.selectedListItems.filter(
    (item) => item.is_purchased,
  );
  for (const item of purchasedItems) {
    await shoppingListStore.removeItemFromList(item.id);
  }
};

const createNewList = async () => {
  console.log("Creating new list - list.vue");

  if (!newListName.value.trim()) return;

  await shoppingListStore.createNewList(newListName.value.trim());
  newListName.value = "";
  showNewListModal.value = false;
};
</script>

<style scoped>
/* Modal transitions */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
