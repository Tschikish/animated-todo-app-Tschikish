import React from "react";
import "./Header.css";

export type Theme = "dark" | "light";

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="headerRow">
      <h1 className="headerTitle">TODO</h1>

      <button
        type="button"
        className="themeToggle"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </header>
  );
}