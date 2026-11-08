import { useNavigate } from "react-router-dom";
import { logout } from "../api";
import { getLoggedInUser } from "../utils/auth";

export default function Topbar({ isMobile, onMenuClick }) {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const role = user?.role || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="topbar">
      {isMobile && (
        <button
          type="button"
          className="topbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <div className="topbar-brand-mobile">
        {isMobile && (
          <img src="/logo-mark.jpg" alt="Zabe" className="topbar-logo-mark" />
        )}
      </div>

      <div className="topbar-user">
        {user && (
          <span className="topbar-user-meta">
            <span className="topbar-user-name">
              {firstName} {lastName}
            </span>
            {role ? <span className="topbar-user-role">{role}</span> : null}
          </span>
        )}

        <span className="profile" title={user ? `${firstName} ${lastName}` : "User"}>
          {initials}
        </span>

        <button
          type="button"
          className="login-button topbar-logout"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
