
import { useState } from "react";

export default function Topbar({ onSearch }) {
  const [query, setQuery] = useState("");

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    "U";

  const handleChange = (e) => {
    const value = e.target.value;

    setQuery(value);

    if (onSearch) {
      onSearch(value);
    }
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

      <div className="user">

        <button
          className="icon"
          aria-label="Notifications"
        >
          🔔
        </button>

        <span
          className="profile"
          title={
            user
              ? `${firstName} ${lastName}`
              : "User"
          }
        >
          {initials}
        </span>

      </div>

    </div>
  );
}
