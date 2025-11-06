import { useThemeStore } from "../store/themeStore";
import { useState } from "react";

export function FloatingThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50 group">
      <button
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-16 h-16 bg-gradient-to-br from-yellow-300 to-green-500 dark:from-zinc-800 dark:to-zinc-900 border-2 border-black dark:border-zinc-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(34,197,94,0.8)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(34,197,94,0.8)] transition-all duration-300 flex items-center justify-center overflow-hidden"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-yellow-400/30 to-green-500/30 dark:from-green-500/40 dark:via-yellow-400/40 dark:to-green-600/40 blur-md animate-pulse"></div>
        </div>

        {/* Icon container with rotation animation */}
        <div
          className={`relative z-10 transition-transform duration-700 ${
            isHovered ? "rotate-180 scale-110" : "rotate-0 scale-100"
          }`}
        >
          {theme === "light" ? (
            // Moon icon for light mode (click to go dark)
            <svg
              className="w-8 h-8 text-black transition-transform duration-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            // Sun icon for dark mode (click to go light)
            <svg
              className="w-8 h-8 text-yellow-400 transition-transform duration-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-150">
          <div className="absolute inset-0 bg-white dark:bg-green-400 opacity-30 animate-ping"></div>
        </div>
      </button>

      {/* Tooltip */}
      <div
        className={`absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-semibold border-2 border-black dark:border-zinc-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(63,63,70,1)]">
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-black dark:border-l-white"></div>
        </div>
      </div>
    </div>
  );
}
