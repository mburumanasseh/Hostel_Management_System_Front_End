import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="app-layout">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="main-area">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className="page-content">
          {children}
        </main>

      </div>

    </div>
  );
}