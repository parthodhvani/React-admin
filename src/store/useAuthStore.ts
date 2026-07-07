import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loginLoading: boolean;
  loginError: string;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  clearLoginError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loginLoading: false,
      loginError: "",

      login: async (email, password, remember) => {
        set({ loginLoading: true, loginError: "" });
        await new Promise((resolve) => setTimeout(resolve, 700));

        const normalizedEmail = email.trim().toLowerCase();
        const validCreds =
          (normalizedEmail === "demo@nova.ai" && password === "password123") ||
          (normalizedEmail.length > 4 && password.length >= 6);

        if (!validCreds) {
          set({ loginLoading: false, loginError: "Invalid credentials. Try demo@nova.ai / password123" });
          return false;
        }

        set({
          loginLoading: false,
          isAuthenticated: true,
          user: { name: "Sophia Lin", email: normalizedEmail },
          loginError: "",
        });

        if (!remember) {
          sessionStorage.setItem("nova-session-auth", "1");
        }

        return true;
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
        sessionStorage.removeItem("nova-session-auth");
      },

      clearLoginError: () => set({ loginError: "" }),
    }),
    {
      name: "nova-auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
