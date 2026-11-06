import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../api";
import { clearAuth, getToken } from "../utils/auth";

/**
 * Requires a valid JWT. Checks /auth/me so expired or
 * forged tokens cannot keep the app open.
 */
export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking"); // checking | ok | deny

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const token = getToken();

      if (!token) {
        if (!cancelled) setStatus("deny");
        return;
      }

      try {
        const res = await getCurrentUser();
        const user = res.data?.user;

        if (!user) {
          clearAuth();
          if (!cancelled) setStatus("deny");
          return;
        }

        // Keep stored user in sync with server
        if (localStorage.getItem("access_token")) {
          localStorage.setItem("user", JSON.stringify(user));
        } else if (sessionStorage.getItem("access_token")) {
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        if (!cancelled) setStatus("ok");
      } catch {
        clearAuth();
        if (!cancelled) setStatus("deny");
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="dashboard-loading" style={{ padding: "2rem" }}>
        Checking session...
      </div>
    );
  }

  if (status === "deny") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
