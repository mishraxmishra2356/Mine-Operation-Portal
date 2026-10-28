import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      <div className="main-column">
        <Navbar onToggleNav={() => setNavOpen((open) => !open)} />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;