<template>
  <div
    class="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
  >
    <!-- App Header -->
    <header
      class="border-b border-slate-200 bg-white/90 dark:border-slate-800/60 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40"
    >
      <div
        class="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3"
      >
        <NuxtLink :to="localePath('/')" class="flex items-center gap-3 group">
          <div
            class="h-9 w-9 rounded-2xl bg-primary-500/90 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-primary-500/40 group-hover:scale-105 transition-transform"
          >
            AI
          </div>
          <div class="flex flex-col leading-tight">
            <span class="font-semibold tracking-tight text-sm sm:text-base">{{
              $t("app.brand.name")
            }}</span>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">{{
              $t("app.brand.tagline")
            }}</span>
          </div>
        </NuxtLink>

        <nav class="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <NuxtLink
            :to="localePath('/list')"
            class="px-3 py-1.5 rounded-full text-slate-700 hover:text-primary-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-primary-200 dark:hover:bg-slate-800/70 transition-colors"
          >
            {{ $t("app.nav.groceryList") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/auth/login')"
            class="px-3 py-1.5 rounded-full text-slate-700 hover:text-primary-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-primary-200 dark:hover:bg-slate-800/70 transition-colors"
          >
            {{ $t("app.nav.login") }}
          </NuxtLink>

          <!-- Language toggle (DE/EN) -->
          <button
            type="button"
            role="switch"
            class="ml-1 inline-flex items-center rounded-full border border-slate-300 bg-white p-0.5 text-[11px] font-semibold tracking-wide text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 dark:text-slate-200 dark:focus-visible:ring-offset-slate-950"
            :aria-checked="locale === 'en'"
            :aria-label="localeToggleLabel"
            :title="localeToggleLabel"
            @click="toggleLocale"
          >
            <span
              class="px-2 py-1 rounded-full"
              :class="
                locale === 'de'
                  ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300'
              "
              aria-hidden="true"
              >DE</span
            >
            <span
              class="px-2 py-1 rounded-full"
              :class="
                locale === 'en'
                  ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300'
              "
              aria-hidden="true"
              >EN</span
            >
          </button>

          <!-- Color mode toggle -->
          <button
            type="button"
            class="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm transition-colors dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 dark:text-slate-200"
            :aria-label="$t('app.darkMode.ariaToggle')"
            @click="toggleColorMode"
          >
            <span
              v-if="colorMode.value === 'dark'"
              class="i-lucide-moon h-4 w-4"
            >
              <!-- fallback icon -->
              <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 1 0 21 12.79z"
                />
              </svg>
            </span>
            <span v-else class="i-lucide-sun h-4 w-4">
              <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <g stroke="currentColor" stroke-width="1.5">
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                </g>
              </svg>
            </span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Page Content -->
    <main
      class="flex-1 bg-slate-50 dark:bg-slate-950 bg-linear-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <NuxtPage />
    </main>

    <!-- Footer -->
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
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n();

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const nextLocale = computed(() => (locale.value === "de" ? "en" : "de"));
const nextLocaleLabel = computed(() =>
  nextLocale.value === "de" ? t("app.language.de") : t("app.language.en")
);

const localeToggleLabel = computed(() =>
  t("app.language.ariaToggle", { language: nextLocaleLabel.value })
);

const toggleLocale = () => {
  const target = nextLocale.value;
  navigateTo(switchLocalePath(target) || localePath("/"));
};

const head = useLocaleHead({
  dir: true,
  seo: true,
});

const metaItems = computed(() => {
  const staticItems = [
    { name: "description", content: t("meta.description"), key: "description" },
  ];
  // merge with head.meta
  return [...staticItems, ...(head.value.meta ?? [])];
});

const linkItems = computed(() => {
  const staticItems = [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
  ];
  // merge with head.link
  return [...staticItems, ...(head.value.link ?? [])];
});
useHead({
  titleTemplate: "%s | MunchCoach",
  meta: metaItems.value,
  link: linkItems.value,
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang,
    dir: head.value.htmlAttrs?.dir as "ltr" | "rtl" | "auto" | undefined,
    style: "scroll-behavior: smooth;",
  },
});

const route = useRoute();

const ogPageKey = computed(() => {
  const normalizedPath = route.path.replace(/^\/(en|de)(?=\/|$)/, "");
  if (normalizedPath.startsWith("/list")) return "list";
  if (normalizedPath.startsWith("/auth/login")) return "login";
  return "home";
});

watchEffect(() => {
  defineOgImageComponent("OgImageBase", {
    title: t(`seo.pages.${ogPageKey.value}.title`),
    description: t(`seo.pages.${ogPageKey.value}.description`),
    headline: t("app.brand.tagline"),
  });
});

const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>
