import { useEffect, useState } from "react";

export const useDarkMode = () => {
  // Check local storage or fall back to system preference settings
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("erp_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("erp_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("erp_theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return { isDark, toggleDarkMode };
};
