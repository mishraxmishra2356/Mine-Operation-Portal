import React from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: "⛏" },
  { to: "/production", label: "Production", icon: "📦" },
  { to: "/equipment", label: "Equipment", icon: "🚛" },
  { to: "/blasting", label: "Blasting", icon: "💥" },
  { to: "/safety", label: "Safety", icon: "🦺" },
];

function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        MINE<span>SAFE</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
            onClick={onNavigate}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;