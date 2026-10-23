import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Activity, ArrowUpRight, X } from "lucide-react";

const navItems: {
  to: string;
  label: string;
  end?: boolean;
}[] = [
  { to: "/", label: "Home", end: true },
  { to: "/results", label: "Results" },
  { to: "/history", label: "History" },
  { to: "/methodology", label: "Methodology" },
];

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Zevrith home">
        <span className="brand-mark">
          <Activity size={26} strokeWidth={2.2} />
        </span>

        <span>
          Zev<span className="brand-accent">rith</span>
        </span>
      </Link>

      <nav
        className={`nav-links ${menuOpen ? "nav-open" : ""}`}
        aria-label="Primary"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end ?? false}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <a
        className="top-cta"
        href="/#investigate"
        onClick={() => setMenuOpen(false)}
      >
        Start exploring
        <ArrowUpRight size={18} />
      </a>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={23} /> : <span>☰</span>}
      </button>
    </header>
  );
}