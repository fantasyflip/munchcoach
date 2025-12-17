<template>
  <DevOnly>
    <DebugSupabaseDisplay />
    <DebugBreakpointDisplay />
  </DevOnly>
  <div
    class="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
  >
    <AppHeader />

    <!-- Page Content -->
    <main
      class="flex-1 bg-slate-50 dark:bg-slate-950 bg-linear-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

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
</script>
