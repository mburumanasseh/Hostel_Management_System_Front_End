import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const STORAGE_KEY = "hostelms_sidebar_collapsed";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
    document.body.classList.toggle("sidebar-is-collapsed", collapsed);
  }, [collapsed]);

  const toggle = () => setCollapsed((c) => !c);

  return (
    <div className={`app-layout${collapsed ? " app-layout--collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      <div className="main-area">
        <Topbar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
