<template>
  <div class="group fixed bottom-5 right-1 z-[100] flex gap-2">
    <div class="flex gap-2 group-hover:hidden">
      <div>User-Role:</div>
      <div v-if="user && user">{{ user.role }}</div>
      <div v-else>not authenticated</div>
      <div v-if="user && user.role === 'authenticated'">User:</div>
      <div v-if="user && user.role === 'authenticated'">{{ user.email }}</div>
    </div>
    <div>
      <NXW-Button
        v-if="user && user.role === 'authenticated'"
        dense
        @click="logout"
        >Logout</NXW-Button
      >
      <NXW-Button v-else :link="localePath('/auth/login')" dense
        >Login</NXW-Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

async function logout() {
  await supabase.auth.signOut();
}
</script>
