export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const localePath = useLocalePath();

  if (user.value) {
    return navigateTo(localePath("/list"));
  }

  const codeParam = to.query.code;
  const errorParam = to.query.error;

  const code = typeof codeParam === "string" ? codeParam : codeParam?.[0];
  const error = typeof errorParam === "string" ? errorParam : errorParam?.[0];

  if (error) {
    return navigateTo(localePath("/auth/login"));
  }

  if (code) {
    return;
  }

  return navigateTo(localePath("/auth/login"));
});
