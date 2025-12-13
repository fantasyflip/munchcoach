<template>
  <div class="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
    <div class="mb-8 text-center space-y-2">
      <h1
        class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
      >
        {{ $t("login.title") }}
      </h1>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        {{ $t("login.subtitle") }}
      </p>
    </div>

    <section
      class="rounded-3xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-50 backdrop-blur-xl px-5 py-8 sm:px-6 sm:py-9 shadow-2xl shadow-slate-900/30 dark:shadow-slate-950/70"
      aria-labelledby="discord-login-heading"
    >
      <div class="space-y-4 text-center">
        <h2
          id="discord-login-heading"
          class="text-lg font-semibold text-slate-900 dark:text-slate-50"
        >
          {{ $t("login.sectionTitle") }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {{ $t("login.sectionSubtitle") }}
        </p>
      </div>

      <div class="mt-6">
        <button
          type="button"
          class="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#5865F2]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-slate-950"
        >
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10"
          >
            <!-- Discord logo (simplified) -->
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="h-4 w-4"
              fill="currentColor"
            >
              <path
                d="M19.36 5.34A18.32 18.32 0 0 0 15.93 4l-.17.33a16.55 16.55 0 0 1 2.06.78 7 7 0 0 0-6.64 0c.67-.32 1.35-.58 2.06-.78L13.07 4a18.32 18.32 0 0 0-3.43 1.34A13.34 13.34 0 0 0 6.5 17.7a13.66 13.66 0 0 0 4.2 1.36l.6-.86a7.1 7.1 0 0 1-1.82-.78l.23-.17a5.4 5.4 0 0 0 5.58 0l.23.17a7.1 7.1 0 0 1-1.82.78l.6.86a13.66 13.66 0 0 0 4.2-1.36 13.34 13.34 0 0 0 2.86-12.36ZM9.8 14.1c-.7 0-1.27-.63-1.27-1.4s.56-1.4 1.27-1.4 1.28.63 1.27 1.4-.56 1.4-1.27 1.4Zm4.4 0c-.7 0-1.27-.63-1.27-1.4s.56-1.4 1.27-1.4 1.28.63 1.27 1.4-.56 1.4-1.27 1.4Z"
              />
            </svg>
          </span>
          <span>{{ $t("login.button") }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead(() => ({
  title: t("seo.pages.login.title"),
  meta: [
    {
      name: "description",
      content: t("seo.pages.login.description"),
      key: "description",
    },
  ],
}));
</script>
