// src/components/Topbar.jsx
// Page title on the left; search, bell and the admin's name on the right.
// Submitting the search sends you to /menu?q=... where MenuPage filters the products.
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icons";

function titleFor(pathname) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/orders")) return "Orders";
  return "Menu";
}

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const q = text.trim();
    navigate(q ? `/menu?q=${encodeURIComponent(q)}` : "/menu");
  }

  return (
    <div className="topbar">
      <h1 className="topbar-title">{titleFor(pathname)}</h1>

      <div className="topbar-right">
        <form className="pill-search" onSubmit={handleSubmit} role="search">
          <Icon name="search" size={20} />
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search the menu"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </form>

        <button type="button" className="icon-btn" aria-label="Notifications">
          <Icon name="bell" />
        </button>

        <div className="user">
          <span className="avatar">AM</span>
          <div className="user-text">
            <strong>Anaya Martin</strong>
            <span>Store Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
