import { Link, useLocation } from "react-router-dom";
import { getLoggedInUser } from "../utils/auth";

const ICONS = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  bookRoom: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10h.01M15 10h.01" />
    </svg>
  ),
  roomAllocation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 20h20" />
      <path d="M4 20V10l8-5 8 5v10" />
      <path d="M9 20v-6h6v6" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  maintenance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  payments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  ),
  hostelFees: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  feeTracking: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 4-6" />
    </svg>
  ),
};

export default function Sidebar({ collapsed, onToggle, isMobile = false, mobileOpen = false, onNavigate }) {
  const location = useLocation();
  const user = getLoggedInUser();
  const role = user?.role;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "dashboard",
      roles: ["admin", "finance", "warden", "student"],
    },
    {
      name: "Book a Room",
      path: "/book-room",
      icon: "bookRoom",
      roles: ["student"],
    },
    {
      name: "Room Allocation",
      path: "/room-allocation",
      icon: "roomAllocation",
      roles: ["admin", "warden", "student"],
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: "maintenance",
      roles: ["admin", "warden", "student"],
    },
    {
      name: "Payments",
      path: "/payments",
      icon: "payments",
      roles: ["admin", "finance"],
    },
    {
      name: "Hostel Fees",
      path: "/hostel-fees",
      icon: "hostelFees",
      roles: ["admin", "finance"],
    },
    {
      name: "My Fees",
      path: "/student-fee-tracking",
      icon: "feeTracking",
      roles: ["student"],
    },
    {
      name: "Fee Tracking",
      path: "/fee-tracking",
      icon: "feeTracking",
      roles: ["admin", "finance", "warden"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "settings",
      roles: ["admin", "finance", "warden", "student"],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const getFullName = () => {
    if (!user) return "User";
    const full = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return full || "User";
  };

  const getRoleLabel = () => {
    switch (role) {
      case "student":
        return "Student";
      case "admin":
        return "Administrator";
      case "warden":
        return "Warden";
      case "finance":
        return "Finance Officer";
      default:
        return "User";
    }
  };

  const getInitials = () => {
    if (!user) return "U";
    const a = (user.first_name || "").charAt(0).toUpperCase();
    const b = (user.last_name || "").charAt(0).toUpperCase();
    return a + b || "U";
  };

  return (
    <aside
      className={[
        "sidebar",
        collapsed && !isMobile ? "sidebar--collapsed" : "",
        isMobile ? "sidebar--mobile" : "",
        isMobile && mobileOpen ? "sidebar--mobile-open" : "",
      ].filter(Boolean).join(" ")}
      aria-label="Main navigation"
    >
      <div className="sidebar-header">
        <div className="sidebar-brand">
          {collapsed && !isMobile ? (
            <img
              src="/logo-mark.jpg"
              alt="Zabe"
              className="sidebar-logo-mark"
            />
          ) : (
            <img
              src="/logo-wordmark.jpg"
              alt="Zabe Hostel Management System"
              className="sidebar-logo-wordmark"
            />
          )}
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={
            isMobile
              ? "Close menu"
              : collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
          }
          title={isMobile ? "Close" : collapsed ? "Expand" : "Collapse"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobile ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : collapsed ? (
              <path d="M4 6h16M4 12h16M4 18h16" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {visibleMenuItems.map((item) => (
            <li key={item.path} className={isActive(item.path) ? "active" : ""}>
              <Link
                to={item.path}
                title={item.name}
                onClick={() => onNavigate?.()}
              >
                <span className="sidebar-icon">{ICONS[item.icon]}</span>
                {(!collapsed || isMobile) && (
                  <span className="sidebar-label">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{getInitials()}</div>
          {(!collapsed || isMobile) && (
            <div className="sidebar-user-info">
              <strong>{getFullName()}</strong>
              <span>{getRoleLabel()}</span>
            </div>
          )}
        </div>
      </footer>
    </aside>
  );
}
