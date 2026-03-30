import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Try to get stored theme
    const stored = window.localStorage.getItem("aegis-theme");
    return stored ? stored : "dark";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
    // Save to local storage
    window.localStorage.setItem("aegis-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return { theme, toggleTheme, setTheme };
}
