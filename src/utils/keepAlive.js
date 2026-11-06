/**
 * Ping the Render backend on an interval so free-tier instances
 * stay awake while this frontend tab is open.
 */
const DEFAULT_ORIGIN =
  "https://hostel-management-system-back-end-1.onrender.com";

function resolveOrigin() {
  const api =
    import.meta.env.VITE_API_URL ||
    `${DEFAULT_ORIGIN}/api`;
  try {
    const u = new URL(api, window.location.origin);
    // strip trailing /api if present
    return u.origin;
  } catch {
    return DEFAULT_ORIGIN;
  }
}

export function startApiKeepAlive(intervalMs = 30000) {
  const origin = resolveOrigin();
  const url = `${origin}/`;

  const ping = () => {
    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    }).catch(() => {
      /* ignore network errors while sleeping/waking */
    });
  };

  // immediate wake
  ping();

  const id = window.setInterval(ping, intervalMs);

  return () => window.clearInterval(id);
}
