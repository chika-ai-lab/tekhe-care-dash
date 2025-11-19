import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  updateResolvedTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",

      setTheme: (theme: Theme) => {
        set({ theme });
        get().updateResolvedTheme();
      },

      updateResolvedTheme: () => {
        const state = get();
        let resolved: "light" | "dark";

        if (state.theme === "system") {
          resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        } else {
          resolved = state.theme;
        }

        set({ resolvedTheme: resolved });

        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Initialize theme on app start
if (typeof window !== "undefined") {
  useThemeStore.getState().updateResolvedTheme();

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const state = useThemeStore.getState();
      if (state.theme === "system") {
        state.updateResolvedTheme();
      }
    });
}
