/**
 * Ping the Render backend health endpoint so free-tier instances
 * stay awake while this frontend tab is open.
 */
const DEFAULT_ORIGIN =
  "https://hostel-management-system-back-end-1.onrender.com";

function resolveHealthUrl() {
  const api =
    import.meta.env.VITE_API_URL ||
    `${DEFAULT_ORIGIN}/api`;
  try {
    const u = new URL(api, window.location.origin);
    // Prefer /api/health when base already ends with /api
    const path = u.pathname.replace(/\/$/, "");
    if (path.endsWith("/api") || path === "/api") {
      return `${u.origin}/api/health`;
    }
    return `${u.origin}/api/health`;
  } catch {
    return `${DEFAULT_ORIGIN}/api/health`;
  }
}

export function startApiKeepAlive(intervalMs = 30000) {
  const url = resolveHealthUrl();

  const ping = () => {
    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    }).catch(() => {
      /* ignore network errors while sleeping/waking */
    });
  };

  ping();
  const id = window.setInterval(ping, intervalMs);
  return () => window.clearInterval(id);
}
