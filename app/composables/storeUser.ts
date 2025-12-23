import { defineStore } from "pinia";

// JWT Claims type returned by useSupabaseUser in v2
interface UserClaims {
  sub: string;
  email?: string;
  role?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  // Add other JWT claims as needed
  user_metadata?: {
    full_name?: string;
    name?: string;
    global_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    provider?: string;
  };
}

export const useUserStore = defineStore("user", () => {
  const supabase = useSupabaseClient();
  // In v2, useSupabaseUser returns JWT claims, not the full User object
  const userClaims = useSupabaseUser();

  const isLoading = ref(true);

  // Sync with Supabase auth state
  const initializeAuth = async () => {
    isLoading.value = true;
    // In v2, the session is managed automatically by the module
    // We just need to check if user claims exist
    isLoading.value = false;
  };

  // Computed properties for user data
  const isLoggedIn = computed(() => !!userClaims.value);

  const userProfile = computed(() => {
    if (!userClaims.value) return null;

    const claims = userClaims.value as UserClaims;
    const metadata = claims.user_metadata;

    return {
      id: claims.sub,
      email: claims.email,
      name:
        metadata?.full_name || metadata?.name || metadata?.global_name || null,
      avatarUrl: metadata?.avatar_url || null,
      provider: claims.app_metadata?.provider || null,
    };
  });

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return {
    user: userClaims,
    isLoading,
    isLoggedIn,
    userProfile,
    initializeAuth,
    logout,
  };
});
