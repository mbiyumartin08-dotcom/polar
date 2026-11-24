import { NavLink, Link } from "react-router-dom";
import Icon from "./Icons";
import logo from "../assets/logo.png";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/menu", label: "Menu", icon: "tag" },
  { to: "/orders", label: "Orders", icon: "clipboard" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo" aria-label="Polar home">
        <img src={logo} alt="Polar" />
      </Link>
      <nav className="sidebar-nav" aria-label="Admin">
        {LINKS.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className="sidebar-link">
            <Icon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
