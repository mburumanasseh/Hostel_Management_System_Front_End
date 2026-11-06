import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";
import { getLoggedInUser } from "../utils/auth";

export default function Topbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const role = user?.role || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="topbar">
      <input
        type="text"
        placeholder="Search..."
        className="search"
        value={query}
        onChange={handleChange}
      />

      <div className="user" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {user && (
          <span style={{ fontSize: "0.85rem", opacity: 0.85 }}>
            {firstName} {lastName}
            {role ? ` · ${role}` : ""}
          </span>
        )}

        <span
          className="profile"
          title={user ? `${firstName} ${lastName}` : "User"}
        >
          {initials}
        </span>

        <button
          type="button"
          className="login-button"
          onClick={handleLogout}
          style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem" }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
