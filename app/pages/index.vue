<template>
  <div
    class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 space-y-20"
  >
    <!-- Hero -->
    <section
      class="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-12"
      aria-labelledby="hero-heading"
    >
      <div class="space-y-6">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-3 py-1 text-[11px] font-medium tracking-wide text-primary-700 dark:text-primary-200"
        >
          <span
            class="h-1.5 w-1.5 rounded-full bg-secondary-400 animate-pulse"
          />
          {{ $t("landing.badge") }}
        </p>

        <h1
          id="hero-heading"
          class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          {{ $t("landing.hero.titlePart1") }}
          <span class="text-primary-600 dark:text-primary-300">{{
            $t("landing.hero.titleHighlight")
          }}</span
          >.
        </h1>

        <p
          class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl"
        >
          {{ $t("landing.hero.description") }}
        </p>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <NXW-Button
            class="w-full sm:w-auto flex items-center justify-center gap-2"
            rounded
            shadow
            grow
            @click="$router.push(localePath('/list'))"
          >
            {{ $t("landing.heroButtons.primary") }}
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </NXW-Button>

          <NXW-Button
            class="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:text-slate-100"
            rounded
            shadow
            @click="$router.push(localePath('/auth/login'))"
          >
            {{ $t("landing.heroButtons.secondary") }}
          </NXW-Button>
        </div>

        <dl
          class="mt-6 grid grid-cols-2 gap-4 max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-300"
        >
          <div>
            <dt class="font-semibold text-slate-900 dark:text-slate-100">
              {{ $t("landing.heroBullets.smartAwarenessTitle") }}
            </dt>
            <dd class="text-slate-500 dark:text-slate-400">
              {{ $t("landing.heroBullets.smartAwarenessBody") }}
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-slate-900 dark:text-slate-100">
              {{ $t("landing.heroBullets.chatDiscoveryTitle") }}
            </dt>
            <dd class="text-slate-500 dark:text-slate-400">
              {{ $t("landing.heroBullets.chatDiscoveryBody") }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Hero visual -->
      <div class="relative">
        <div
          class="absolute -inset-6 rounded-3xl bg-primary-500/15 dark:bg-primary-500/20 blur-3xl opacity-70"
          aria-hidden="true"
        />
        <div
          class="relative rounded-3xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-50 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-primary-900/40 space-y-4"
        >
          <header
            class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300"
          >
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-secondary-400" />
              <span class="font-medium">{{
                $t("landing.heroChat.title")
              }}</span>
            </div>
            <span class="text-[10px] text-slate-500">{{
              $t("landing.heroChat.subtitle")
            }}</span>
          </header>

          <div class="space-y-3 text-[11px] leading-relaxed">
            <div class="flex gap-2">
              <div
                class="shrink-0 h-7 w-7 rounded-full bg-primary-500/20 text-primary-700 dark:text-primary-200 flex items-center justify-center text-[11px] font-semibold"
              >
                You
              </div>
              <div
                class="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100"
              >
                {{ $t("landing.heroChat.userMessage") }}
              </div>
            </div>

            <div class="flex gap-2">
              <div
                class="shrink-0 h-7 w-7 rounded-full bg-secondary-500/20 text-secondary-200 flex items-center justify-center text-[11px] font-semibold"
              >
                AI
              </div>
              <div class="flex-1 space-y-2">
                <div
                  class="rounded-2xl bg-slate-50 px-3 py-2 border border-slate-200 text-slate-800 dark:bg-slate-900/80 dark:border-slate-700/70 dark:text-slate-100"
                >
                  {{ $t("landing.heroChat.aiIntro") }}
                  <ul
                    class="mt-1 list-disc list-inside text-[10px] text-slate-400 space-y-0.5"
                  >
                    <li>{{ $t("landing.heroChat.aiPoint1") }}</li>
                    <li>{{ $t("landing.heroChat.aiPoint2") }}</li>
                  </ul>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    class="inline-flex items-center rounded-full bg-slate-800/90 px-2 py-1 text-[10px] text-slate-200"
                  >
                    + {{ $t("landing.heroChat.chipAddMissing") }}
                  </span>
                  <span
                    class="inline-flex items-center rounded-full bg-slate-800/90 px-2 py-1 text-[10px] text-slate-200"
                  >
                    {{ $t("landing.heroChat.chipViewRecipe") }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300"
          >
            <div
              class="h-7 flex-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center px-3 text-[11px]"
            >
              {{ $t("landing.heroChat.inputPlaceholder") }}
            </div>
            <div
              class="h-7 w-7 rounded-full bg-primary-600 flex items-center justify-center text-slate-950"
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
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="space-y-6">
      <header class="space-y-2 text-center">
        <h2
          class="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          {{ $t("landing.features.title") }}
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {{ $t("landing.features.subtitle") }}
        </p>
      </header>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        <article
          class="rounded-2xl border border-slate-200 bg-white/90 p-4 flex flex-col gap-2 text-slate-800 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-50"
        >
          <h3 class="font-semibold">
            {{ $t("landing.features.cards.saveTimeTitle") }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {{ $t("landing.features.cards.saveTimeBody") }}
          </p>
        </article>
        <article
          class="rounded-2xl border border-slate-200 bg-white/90 p-4 flex flex-col gap-2 text-slate-800 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-50"
        >
          <h3 class="font-semibold">
            {{ $t("landing.features.cards.reduceWasteTitle") }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {{ $t("landing.features.cards.reduceWasteBody") }}
          </p>
        </article>
        <article
          class="rounded-2xl border border-slate-200 bg-white/90 p-4 flex flex-col gap-2 text-slate-800 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-50"
        >
          <h3 class="font-semibold">
            {{ $t("landing.features.cards.stayOrganizedTitle") }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {{ $t("landing.features.cards.stayOrganizedBody") }}
          </p>
        </article>
        <article
          class="rounded-2xl border border-slate-200 bg-white/90 p-4 flex flex-col gap-2 text-slate-800 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-50"
        >
          <h3 class="font-semibold">
            {{ $t("landing.features.cards.neverForgetTitle") }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {{ $t("landing.features.cards.neverForgetBody") }}
          </p>
        </article>
        <article
          class="rounded-2xl border border-slate-200 bg-white/90 p-4 flex flex-col gap-2 text-slate-800 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-50"
        >
          <h3 class="font-semibold">
            {{ $t("landing.features.cards.discoverNewTitle") }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {{ $t("landing.features.cards.discoverNewBody") }}
          </p>
        </article>
        <article
          class="rounded-2xl border border-slate-200 bg-white/90 p-4 flex flex-col gap-2 text-slate-800 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-50"
        >
          <h3 class="font-semibold">
            {{ $t("landing.features.cards.extraBenefitsTitle") }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {{ $t("landing.features.cards.extraBenefitsBody") }}
          </p>
        </article>
      </div>
    </section>

    <!-- Call to action -->
    <section
      id="how-it-works"
      class="rounded-3xl border border-slate-200 bg-linear-to-r from-primary-500/10 via-secondary-500/5 to-primary-500/10 px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 dark:border-primary-500/40 dark:from-primary-500/15 dark:via-secondary-500/10 dark:to-primary-500/15"
    >
      <div class="flex-1 space-y-2">
        <h2
          class="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          {{ $t("landing.cta.title") }}
        </h2>
        <p
          class="text-sm sm:text-base text-slate-800 dark:text-slate-200 max-w-xl"
        >
          {{ $t("landing.cta.body") }}
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <NXW-Button
          class="w-full sm:w-auto flex items-center justify-center gap-2"
          rounded
          shadow
          grow
          @click="$router.push(localePath('/list'))"
        >
          {{ $t("landing.cta.primary") }}
        </NXW-Button>
        <NXW-Button
          class="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-800/30 bg-slate-950/40 hover:bg-slate-900/70 text-slate-100"
          rounded
          shadow
          @click="$router.push(localePath('/auth/login'))"
        >
          {{ $t("landing.cta.secondary") }}
        </NXW-Button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const localePath = useLocalePath();

const { t } = useI18n();

useHead(() => ({
  title: t("seo.pages.home.title"),
  meta: [
    {
      name: "description",
      content: t("seo.pages.home.description"),
      key: "description",
    },
  ],
}));
</script>
