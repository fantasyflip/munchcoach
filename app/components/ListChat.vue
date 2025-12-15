<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 flex items-end justify-center sm:items-center bg-black/30 backdrop-blur-sm"
      @click.self="isOpen = false"
    >
      <div
        class="w-full sm:max-w-md md:max-w-lg mx-auto rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 flex flex-col max-h-[90vh] overflow-hidden dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-slate-950/80"
      >
        <header
          class="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3 dark:border-slate-800"
        >
          <div>
            <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {{ $t("list.chat.title") }}
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-500">
              {{ $t("list.chat.subtitle") }}
            </p>
          </div>
          <button
            type="button"
            class="h-8 w-8 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300"
            aria-label="Close chat"
            @click="isOpen = false"
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
          class="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
        >
          <div class="flex gap-2">
            <div
              class="shrink-0 h-7 w-7 rounded-full bg-primary-500/20 text-primary-700 dark:text-primary-200 flex items-center justify-center text-[11px] font-semibold"
            >
              You
            </div>
            <div
              class="flex-1 rounded-2xl bg-slate-100 px-3 py-2 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-700/80"
            >
              {{ $t("list.chat.userExample") }}
            </div>
          </div>

          <div class="flex gap-2">
            <div
              class="shrink-0 h-7 w-7 rounded-full bg-secondary-500/20 text-secondary-800 dark:text-secondary-200 flex items-center justify-center text-[11px] font-semibold"
            >
              AI
            </div>
            <div class="flex-1 space-y-2">
              <div
                class="rounded-2xl bg-slate-50 px-3 py-2 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-700/80"
              >
                {{ $t("list.chat.aiExampleIntro") }}
                <ol
                  class="mt-1 list-decimal list-inside text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 space-y-0.5"
                >
                  <li>{{ $t("list.chat.aiExampleStep1") }}</li>
                  <li>{{ $t("list.chat.aiExampleStep2") }}</li>
                  <li>{{ $t("list.chat.aiExampleStep3") }}</li>
                </ol>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700/80"
                >
                  + {{ $t("list.chat.chipAddMissing") }}
                </button>
                <button
                  type="button"
                  class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700/80"
                >
                  {{ $t("list.chat.chipMoreIdeas") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <form
          class="border-t border-slate-200 px-3 sm:px-4 py-3 flex items-end gap-2 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95"
          @submit.prevent
        >
          <div
            class="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-600 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100"
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
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
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
