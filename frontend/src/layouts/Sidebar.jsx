import React from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/tasks", label: "Tasks", icon: "✅" },
  { to: "/calendar", label: "Calendar", icon: "📅" },
  { to: "/timer", label: "Timer", icon: "⏱️" },
  { to: "/notes", label: "Notes", icon: "📝" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-screen">
      <Link to="/" className="px-5 py-5 flex items-center gap-2 hover:opacity-80">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="UniSphere Logo" className="w-8 h-8" />
          <span className="font-semibold text-lg">UniSphere</span>
        </div>
      </Link>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-gray-400">
        UniSphere v1.0 — Academic Life, Organized
      </div>
    </aside>
  );
};

export default Sidebar;
