"use client";


import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl 
                 border transition-all duration-300 hover:scale-105
                 bg-white border-slate-200 shadow-sm hover:bg-slate-50
                 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 transition-transform duration-300" />
      )}
    </button>
  );
}
