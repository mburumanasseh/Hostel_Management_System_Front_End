import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const STORAGE_KEY = "hostelms_sidebar_collapsed";
const MOBILE_MQ = "(max-width: 768px)";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const apply = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setMobileOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
    document.body.classList.toggle("sidebar-is-collapsed", collapsed && !isMobile);
    document.body.classList.toggle("sidebar-mobile-open", mobileOpen);
  }, [collapsed, isMobile, mobileOpen]);

  // lock body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleDesktop = () => setCollapsed((c) => !c);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div
      className={[
        "app-layout",
        collapsed && !isMobile ? "app-layout--collapsed" : "",
        isMobile ? "app-layout--mobile" : "",
        mobileOpen ? "app-layout--mobile-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isMobile && mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <Sidebar
        collapsed={isMobile ? false : collapsed}
        onToggle={isMobile ? closeMobile : toggleDesktop}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onNavigate={isMobile ? closeMobile : undefined}
      />

      <div className="main-area">
        <Topbar
          isMobile={isMobile}
          onMenuClick={openMobile}
        />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
