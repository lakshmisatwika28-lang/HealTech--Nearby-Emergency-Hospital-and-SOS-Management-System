import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.css";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <button
        className="navbar-menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div
        className="navbar-logo"
        onClick={() => navigate("/dashboard")}
      >
        <div className="navbar-logo-icon">✚</div>
        <span>HEALTECH</span>
      </div>

      <div className="navbar-actions">
        <button
          className="theme-button"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;