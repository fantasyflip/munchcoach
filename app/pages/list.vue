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
        class="text-[11px] sm:text-xs px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {{ $t("list.statusChip") }}
      </div>
    </header>

    <!-- Input to add ingredients -->
    <section
      class="rounded-2xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 backdrop-blur-md p-4 sm:p-5 space-y-4"
    >
      <h2 class="text-sm font-medium">{{ $t("list.addSectionTitle") }}</h2>
      <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="handleAdd">
        <NXW-Textfield
          v-model="newItem"
          :label="$t('list.addSectionTitle')"
          :placeholder="$t('list.addPlaceholder')"
          filled
          class="flex-1"
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
          class="flex items-center gap-3 rounded-xl px-3 py-2 bg-slate-900/80 border border-slate-700/60 hover:border-primary-500/50 transition-colors"
        >
          <label class="inline-flex items-center gap-2 flex-1 cursor-pointer">
            <input
              v-model="item.checked"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-600 bg-slate-900 text-primary-500 focus:ring-primary-500"
            />
            <span
              class="text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              :class="{ 'line-through text-slate-500': item.checked }"
            >
              {{ item.name }}
            </span>
          </label>
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

    <!-- Chat interface -->
    <Transition name="fade">
      <div
        v-if="isChatOpen"
        class="fixed inset-0 z-40 flex items-end justify-center sm:items-center bg-black/30 backdrop-blur-sm"
        @click.self="isChatOpen = false"
      >
        <div
          class="w-full sm:max-w-md md:max-w-lg mx-auto rounded-t-3xl sm:rounded-3xl border border-slate-700/80 bg-slate-950/95 shadow-2xl shadow-slate-950/80 flex flex-col max-h-[90vh]"
        >
          <header
            class="px-4 sm:px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-3"
          >
            <div>
              <h2 class="text-sm font-semibold text-slate-50">
                {{ $t("list.chat.title") }}
              </h2>
              <p class="text-[11px] text-slate-500">
                {{ $t("list.chat.subtitle") }}
              </p>
            </div>
            <button
              type="button"
              class="h-8 w-8 inline-flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300"
              aria-label="Close chat"
              @click="isChatOpen = false"
            >
              <svg
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div
            class="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 text-xs sm:text-sm"
          >
            <div class="flex gap-2">
              <div
                class="shrink-0 h-7 w-7 rounded-full bg-primary-500/20 text-primary-200 flex items-center justify-center text-[11px] font-semibold"
              >
                You
              </div>
              <div
                class="flex-1 rounded-2xl bg-slate-900/90 px-3 py-2 border border-slate-700/80"
              >
                {{ $t("list.chat.userExample") }}
              </div>
            </div>

            <div class="flex gap-2">
              <div
                class="shrink-0 h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-200 flex items-center justify-center text-[11px] font-semibold"
              >
                AI
              </div>
              <div class="flex-1 space-y-2">
                <div
                  class="rounded-2xl bg-slate-900/90 px-3 py-2 border border-slate-700/80"
                >
                  {{ $t("list.chat.aiExampleIntro") }}
                  <ol
                    class="mt-1 list-decimal list-inside text-[11px] sm:text-xs text-slate-300 space-y-0.5"
                  >
                    <li>{{ $t("list.chat.aiExampleStep1") }}</li>
                    <li>{{ $t("list.chat.aiExampleStep2") }}</li>
                    <li>{{ $t("list.chat.aiExampleStep3") }}</li>
                  </ol>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] text-slate-100 border border-slate-700/80"
                  >
                    + {{ $t("list.chat.chipAddMissing") }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] text-slate-100 border border-slate-700/80"
                  >
                    {{ $t("list.chat.chipMoreIdeas") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form
            class="border-t border-slate-800 px-3 sm:px-4 py-3 flex items-end gap-2 bg-slate-950/95"
            @submit.prevent
          >
            <div
              class="flex-1 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-slate-100"
            >
              <p class="text-slate-500 text-[11px]">
                {{ $t("list.chat.inputHint") }}
              </p>
            </div>
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-600/70 text-slate-950 hover:bg-primary-500"
              disabled
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
