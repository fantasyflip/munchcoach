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
          class="group cursor-pointer inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#5865F2]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-slate-950"
          @click="signIn('discord')"
        >
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full bg-white/10"
          >
            <!-- Discord logo (simplified) -->
            <Icon name="ic:baseline-discord" class="h-4 w-4 text-white" />
          </span>
          <span>{{ $t("login.button") }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const supabase = useSupabaseClient();
const { baseUrl } = useRuntimeConfig().public.i18n;

async function signIn(provider: string) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: baseUrl + "/auth/callback",
    },
  });
  if (error) console.log(error);
}

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

definePageMeta({
  middleware: "authed",
});
</script>
