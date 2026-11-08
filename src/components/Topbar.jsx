import { useNavigate } from "react-router-dom";
import { logout } from "../api";
import { getLoggedInUser } from "../utils/auth";

export default function Topbar() {
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
      <div className="topbar-spacer" />

      <div className="topbar-user">
        {user && (
          <span className="topbar-user-meta">
            {firstName} {lastName}
            {role ? ` · ${role}` : ""}
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
