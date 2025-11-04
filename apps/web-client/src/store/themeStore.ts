import { create } from "zustand";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      console.log("🎨 Theme toggling from", state.theme, "to", newTheme);

      localStorage.setItem("theme", newTheme);

      // Update document class
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      console.log("🎨 Document classes:", document.documentElement.className);
      console.log("🎨 localStorage theme:", localStorage.getItem("theme"));

      return { theme: newTheme };
    });
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    // Default to light theme instead of system preference
    const theme = savedTheme || "light";

    console.log("🎨 initTheme called", {
      savedTheme,
      finalTheme: theme,
    });

    // Update document class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    console.log(
      "🎨 Initial document classes:",
      document.documentElement.className
    );

    set({ theme });
  },
}));
