import { useAuthStore } from "~/store/useAuthStore";

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn && to.path !== "/login") {
    return navigateTo("/login");
  }
});
