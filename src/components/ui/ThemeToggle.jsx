import React, { useEffect, useState } from "react";

const getInitialTheme = () => {
  const stored = localStorage.getItem("unisphere_theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("unisphere_theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle dark mode"
      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/20 bg-white/70 dark:bg-white/10 backdrop-blur hover:scale-105 transition-transform"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;