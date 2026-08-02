import { Link } from "react-router-dom";
import {
  getLoggedInUser,
  getUserRole,
} from "../utils/auth";

export default function Sidebar() {
  const user = getLoggedInUser();
  const role = getUserRole();

  // Features available to everyone
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Room Allocation",
      path: "/room-allocation",
    },
    {
      name: "Maintenance",
      path: "/maintenance",
    },
  ];

  // Fee Tracking is available only to staff
  if (
    role === "admin" ||
    role === "warden" ||
    role === "finance"
  ) {
    menuItems.push({
      name: "Fee Tracking",
      path: "/fee-tracking",
    });
  }

  return (
    <div className="sidebar">

      {/* LOGO */}
      <h2>HostelMS</h2>

      {/* NAVIGATION */}
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* STAFF ALERTS */}
      {role !== "student" && (
        <div className="alerts">
          <p>
            2 overdue fees - 7 urgent maintenance requests
          </p>
        </div>
      )}

      {/* LOGGED-IN USER */}
      <footer>
        <small>
          {user
            ? `${user.first_name} ${user.last_name} (${user.role})`
            : "User"}
        </small>
      </footer>

    </div>
  );
}