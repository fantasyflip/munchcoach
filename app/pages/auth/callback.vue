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

watch(
  user,
  (newUser) => {
    if (newUser) {
      useRouter().push(localePath("/list"));
    }
  },
  { immediate: true },
);
</script>
