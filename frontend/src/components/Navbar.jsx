import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TITLES = {
  "/dashboard": "Overview",
  "/production": "Production",
  "/equipment": "Equipment",
  "/blasting": "Blasting",
  "/safety": "Safety",
};

function Navbar({ onToggleNav }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const title = TITLES[location.pathname] ?? "Overview";

  return (
    <header className="topbar">
      <button
        className="nav-toggle"
        onClick={onToggleNav}
        aria-label="Toggle navigation"
        type="button"
      >
        ☰
      </button>
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-user">
        <span className="topbar-user-name">{user?.name ?? user?.email ?? "Operator"}</span>
        <div className="topbar-user-avatar" aria-hidden="true">
          {(user?.email ?? "O").charAt(0).toUpperCase()}
        </div>
        <button className="sidebar-logout" onClick={handleLogout} type="button">
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;