import { Link } from "react-router-dom";

export default function Sidebar() {
  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const role = user?.role;

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

  // Fee Tracking is available to admin, warden and finance.
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

      {/* LOGO / TITLE */}
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

      {/* USER */}
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