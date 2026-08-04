
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  /*
  |--------------------------------------------------------------------------
  | GET LOGGED-IN USER
  |--------------------------------------------------------------------------
  */

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Failed to read logged-in user:",
      error
    );
  }

  const role = user?.role;


  /*
  |--------------------------------------------------------------------------
  | MENU ITEMS
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | STUDENT FEE TRACKING
  |--------------------------------------------------------------------------
  */

  if (role === "student") {
    menuItems.push({
      name: "Fee Tracking",
      path: "/student-fee-tracking",
    });
  }


  /*
  |--------------------------------------------------------------------------
  | STAFF FEE TRACKING
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | ACTIVE LINK
  |--------------------------------------------------------------------------
  */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path;
  };


  /*
  |--------------------------------------------------------------------------
  | FULL NAME
  |--------------------------------------------------------------------------
  */

  const getFullName = () => {
    if (!user) {
      return "User";
    }

    const firstName =
      user.first_name?.trim() || "";

    const lastName =
      user.last_name?.trim() || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return fullName || "User";
  };


  /*
  |--------------------------------------------------------------------------
  | ROLE / STATUS
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | USER INITIALS
  |--------------------------------------------------------------------------
  */

  const getInitials = () => {
    if (!user) {
      return "U";
    }

    const firstName =
      user.first_name?.trim() || "";

    const lastName =
      user.last_name?.trim() || "";

    const firstInitial =
      firstName.charAt(0).toUpperCase();

    const lastInitial =
      lastName.charAt(0).toUpperCase();

    if (firstInitial && lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }

    if (firstInitial) {
      return firstInitial;
    }

    if (lastInitial) {
      return lastInitial;
    }

    return "U";
  };


  /*
  |--------------------------------------------------------------------------
  | SIDEBAR
  |--------------------------------------------------------------------------
  */

  return (
    <div className="sidebar">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <h2>HostelMS</h2>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <ul>

        {menuItems.map((item) => (

          <li
            key={item.path}
            className={
              isActive(item.path)
                ? "active"
                : ""
            }
          >

            <Link to={item.path}>
              {item.name}
            </Link>

          </li>

        ))}

      </ul>


      {/* =====================================================
          LOGGED-IN USER
      ===================================================== */}

      <footer>

        <div className="sidebar-user">

          {/* INITIALS */}

          <div className="sidebar-avatar">
            {getInitials()}
          </div>


          {/* NAME + ROLE */}

          <div className="sidebar-user-info">

            <strong>
              {getFullName()}
            </strong>

            <span>
              {getRoleLabel()}
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}
