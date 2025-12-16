<template>
  <footer
    class="border-t border-slate-200 bg-white/90 text-slate-500 dark:border-slate-800/60 dark:bg-slate-950/90 dark:text-slate-400 text-xs sm:text-sm"
  >
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
    >
      <p class="text-center sm:text-left">
        © {{ new Date().getFullYear() }} {{ $t("app.brand.name") }}.
        {{ $t("app.footer.crafted") }}
      </p>
      <div class="flex items-center gap-3">
        <a
          href="#features"
          class="hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >{{ $t("app.nav.features") }}</a
        >
        <a
          href="#how-it-works"
          class="hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >{{ $t("app.nav.howItWorks") }}</a
        >
      </div>
    </div>
  </footer>
</template>
