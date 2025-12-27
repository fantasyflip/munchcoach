export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser();

    if (!user.value) {
        const langParam = getLangByRouteName(to.name);
        if (langParam) {
            return navigateTo(`/${langParam}/auth/login`);
        }
        return navigateTo("/auth/login");
    }
});
