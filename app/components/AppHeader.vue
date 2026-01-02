<template>
  <header
    class="border-b border-slate-200 bg-white/90 dark:border-slate-800/60 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40"
  >
    <div
      class="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3"
    >
      <NuxtLink :to="localePath('/')" class="flex items-center gap-3 group">
        <div
          class="h-9 w-9 rounded-2xl bg-primary-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-primary-500/40 group-hover:scale-105 transition-transform"
        >
          <AppLogoIcon class="h-6 w-6" />
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

        <button
          v-if="isLoggedIn"
          type="button"
          class="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 pl-2 pr-1 py-0.5 text-xs text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:focus-visible:ring-offset-slate-950"
          :title="loggedInTitle"
          :aria-label="loggedInTitle"
          @click="logout"
        >
          <span class="hidden sm:grid max-w-36 truncate font-medium">
            <span
              class="col-start-1 row-start-1 group-hover:opacity-0 transition-opacity"
              >{{ displayName }}</span
            >
            <span
              class="col-start-1 row-start-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >{{ $t("app.nav.logout") }}</span
            >
          </span>

          <span
            class="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-200"
            aria-hidden="true"
          >
            <template v-if="avatarUrl">
              <img
                :src="avatarUrl"
                :alt="displayName"
                class="h-full w-full object-cover group-hover:hidden"
                referrerpolicy="no-referrer"
              />
              <Icon
                name="lucide:log-out"
                class="hidden h-4 w-4 group-hover:block"
              />
            </template>
            <template v-else>
              <Icon name="lucide:user" class="h-4 w-4 group-hover:hidden" />
              <Icon
                name="lucide:log-out"
                class="hidden h-4 w-4 group-hover:block"
              />
            </template>
          </span>
        </button>
        <NuxtLink
          v-else
          :to="localePath('/auth/login')"
          class="px-3 py-1.5 rounded-full text-slate-700 hover:text-primary-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-primary-200 dark:hover:bg-slate-800/70 transition-colors"
        >
          {{ $t("app.nav.login") }}
        </NuxtLink>

        <!-- Language toggle (DE/EN) -->
        <button
          type="button"
          role="switch"
          class="ml-1 inline-flex h-8 items-center rounded-full border border-slate-300 bg-white p-0 text-xs font-semibold tracking-wide text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 dark:text-slate-200 dark:focus-visible:ring-offset-slate-950"
          :aria-checked="locale === 'en'"
          :aria-label="localeToggleLabel"
          :title="localeToggleLabel"
          @click="toggleLocale"
        >
          <span
            class="inline-flex h-full items-center rounded-full px-2"
            :class="
              locale === 'de'
                ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-300'
            "
            aria-hidden="true"
            >DE</span
          >
          <span
            class="inline-flex h-full items-center rounded-full px-2"
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
          <span v-if="colorMode.value === 'dark'" class="i-lucide-moon h-4 w-4">
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
</template>

<script lang="ts" setup>
const { t, locale } = useI18n();

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const nextLocale = computed(() => (locale.value === "de" ? "en" : "de"));
const nextLocaleLabel = computed(() =>
  nextLocale.value === "de" ? t("app.language.de") : t("app.language.en"),
);

const localeToggleLabel = computed(() =>
  t("app.language.ariaToggle", { language: nextLocaleLabel.value }),
);

const toggleLocale = () => {
  const target = nextLocale.value;
  navigateTo(switchLocalePath(target) || localePath("/"));
};

const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const isLoggedIn = computed(
  () => !!user.value && user.value.role === "authenticated",
);

const displayName = computed(() => {
  const currentUser = user.value;
  if (!currentUser) return "";

  const metadata = (currentUser.user_metadata ?? {}) as Record<string, unknown>;
  const nameFromMetadata =
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    (typeof metadata.name === "string" && metadata.name.trim()) ||
    (typeof metadata.preferred_username === "string" &&
      metadata.preferred_username.trim());

  if (nameFromMetadata) return nameFromMetadata;

  const email = currentUser.email?.trim();
  if (!email) return "Account";

  return email.split("@")[0] || "Account";
});

const avatarUrl = computed(() => {
  const currentUser = user.value;
  if (!currentUser) return "";

  const metadata = (currentUser.user_metadata ?? {}) as Record<string, unknown>;
  const url =
    (typeof metadata.avatar_url === "string" && metadata.avatar_url.trim()) ||
    (typeof metadata.picture === "string" && metadata.picture.trim());

  return url || "";
});

const loggedInTitle = computed(() =>
  t("app.nav.logoutTitle", { name: displayName.value }),
);

async function logout() {
  await supabase.auth.signOut();
  await navigateTo(localePath("/"));
}
</script>
