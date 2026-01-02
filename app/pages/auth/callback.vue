<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="flex flex-col items-center">
      <Icon
        name="line-md:loading-loop"
        class="text-black/50 dark:text-white/50"
        size="64"
      />
      <h1 class="pb-2 pt-10 text-center text-5xl font-bold">
        {{ $t("callback.title") }}
      </h1>
      <p class="text-center text-primary-400">
        {{ $t("callback.description") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "supabase-callback",
});

const user = useSupabaseUser();

const localePath = useLocalePath();
const router = useRouter();

watch(
  user,
  (newUser) => {
    if (newUser) {
      // Check for redirect target in localStorage
      let redirectTo = "/list";
      let query: Record<string, string> = {};

      if (import.meta.client) {
        const storedRedirect = localStorage.getItem("munchcoach_redirect");
        if (storedRedirect === "chat") {
          query = { openChat: "true" };
          localStorage.removeItem("munchcoach_redirect");
        }
      }

      router.push({ path: localePath(redirectTo), query });
    }
  },
  { immediate: true },
);
</script>
