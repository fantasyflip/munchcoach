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
      <div
        class="text-[11px] sm:text-xs px-3 py-1.5 rounded-full border border-secondary-500/40 bg-secondary-500/10 text-secondary-900 dark:text-secondary-200 flex items-center gap-1.5"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-secondary-400 animate-pulse" />
        {{ $t("list.statusChip") }}
      </div>
    </header>

    <!-- Input to add ingredients -->
    <section
      class="rounded-2xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 backdrop-blur-md p-4 sm:p-5 space-y-4"
    >
      <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="handleAdd">
        <NXW-Textfield
          v-model="newItem"
          :label="$t('list.addSectionTitle')"
          :placeholder="$t('list.addPlaceholder')"
          outlined
          class="flex-1"
          :color="{
            bg: 'dark:bg-slate-900 bg-white',
          }"
        />
        <NXW-Button
          type="submit"
          class="w-full sm:w-auto flex items-center justify-center gap-2"
          rounded
          shadow
        >
          {{ $t("list.addButton") }}
        </NXW-Button>
      </form>
    </section>

    <!-- Grocery list -->
    <section
      class="mt-6 rounded-2xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 backdrop-blur-md p-4 sm:p-5"
    >
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-medium">{{ $t("list.listSectionTitle") }}</h2>
        <button
          type="button"
          class="text-[11px] text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300 transition-colors"
          @click="clearChecked"
        >
          {{ $t("list.clearChecked") }}
        </button>
      </div>

      <div
        v-if="items.length === 0"
        class="text-xs sm:text-sm text-slate-500 py-6 text-center"
      >
        {{ $t("list.emptyState") }}
      </div>

      <ul v-else class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/90 border border-slate-200 hover:border-primary-500/50 transition-colors dark:bg-slate-900/80 dark:border-slate-700/60"
        >
          <NXW-Checkbox
            v-model="item.checked"
            class="flex-1"
            :color="{
              label: 'text-slate-900 dark:text-slate-100',
              iconInactive: 'text-slate-500 dark:text-slate-400',
              iconActive: 'text-primary-600 dark:text-primary-400',
              hover:
                'group-hover:text-primary-600 dark:group-hover:text-primary-300',
            }"
          >
            <template #label>
              <span
                class="text-xs sm:text-sm"
                :class="{
                  'line-through text-slate-500 dark:text-slate-400':
                    item.checked,
                }"
              >
                {{ item.name }}
              </span>
            </template>
          </NXW-Checkbox>
          <button
            type="button"
            class="text-[11px] text-slate-500 hover:text-red-500 dark:hover:text-red-300"
            @click="removeItem(item.id)"
          >
            {{ $t("list.remove") }}
          </button>
        </li>
      </ul>
    </section>

    <!-- Floating chat button -->
    <button
      type="button"
      class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-500 text-slate-950 shadow-xl shadow-primary-600/40 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      :aria-label="$t('list.fabLabel')"
      @click="isChatOpen = true"
    >
      <svg
        class="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M7 11h6" />
        <path d="M7 15h4" />
        <path
          d="M5 5h14a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-5.6L9 21v-4.5H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        />
      </svg>
    </button>

    <ListChat v-model="isChatOpen" />
  </div>
</template>

<script setup lang="ts">
const newItem = ref("");

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

interface GroceryItem {
  id: number;
  name: string;
  checked: boolean;
}

const items = ref<GroceryItem[]>([
  { id: 1, name: t("list.sampleItems.spaghetti"), checked: false },
  { id: 2, name: t("list.sampleItems.cherryTomatoes"), checked: false },
  { id: 3, name: t("list.sampleItems.garlicCloves"), checked: true },
]);

const isChatOpen = ref(false);
let nextId = items.value.length + 1;

const handleAdd = () => {
  const trimmed = newItem.value.trim();
  if (!trimmed) return;

  items.value.push({
    id: nextId++,
    name: trimmed,
    checked: false,
  });

  newItem.value = "";
};

const clearChecked = () => {
  items.value = items.value.filter((i) => !i.checked);
};

const removeItem = (id: number) => {
  items.value = items.value.filter((i) => i.id !== id);
};
</script>
