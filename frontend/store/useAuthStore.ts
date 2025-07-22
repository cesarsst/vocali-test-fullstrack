import { defineStore } from "pinia";
import { getApiUrl } from "@/utils/api";
interface User {
  email: string;
  name?: string;
  [key: string]: any;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null,
    token: null as string | null,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const api = getApiUrl("NUXT_LAMBDA_FUNCTION_SIGNIN");
        const response = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const res = await response.json();
        if (!response.ok) throw new Error(res.error || "Error logging in");
        this.token = res.data.accessToken;
        this.isLoggedIn = true;

        localStorage.setItem("auth_token", res.token);
      } catch (error: any) {
        console.error("Login error:", error);
        throw error;
      }
    },
    async signup(
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) {
      try {
        const api = getApiUrl("NUXT_LAMBDA_FUNCTION_SIGNUP");
        const response = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName }),
        });

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Signup error:", error);
        throw error;
      }
    },
    async confirmSignup(email: string, code: string) {
      try {
        const runtimeConfig = useRuntimeConfig();
        const api = runtimeConfig.public
          .NUXT_LAMBDA_FUNCTION_CONFIRM_SIGNUP as string;
        const response = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Confirm signup error:", error);
        throw error;
      }
    },
    logout() {
      const router = useRouter();

      this.isLoggedIn = false;
      this.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      router.push("/");
    },
    checkSession() {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          this.token = token;
          this.isLoggedIn = true;
          return true; // Session is valid
        } else {
          this.logout();
        }
      }
      return false; // No valid session
    },
  },

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
});
