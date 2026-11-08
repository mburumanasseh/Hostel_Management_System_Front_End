import { Link, NavLink, Outlet } from "react-router-dom";

const WHATSAPP_URL =
  "https://wa.me/254700532298?text=" +
  encodeURIComponent("Hello Zabe, I would like to know more about the hostel.");

export default function PublicLayout() {
  return (
    <div className="public-site">
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" className="public-brand">
            <img
              src="/logo-wordmark.jpg"
              alt="Zabe Hostel Management System"
              className="public-brand-logo"
            />
          </Link>

          <nav className="public-nav" aria-label="Main">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : undefined)}>
              About
            </NavLink>
            <NavLink to="/faqs" className={({ isActive }) => (isActive ? "active" : undefined)}>
              FAQs
            </NavLink>
          </nav>

          <div className="public-auth-actions">
            <Link to="/login" className="public-btn public-btn-ghost">
              Login
            </Link>
            <Link to="/register" className="public-btn public-btn-primary">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer-inner">
          <div>
            <img src="/logo-mark.jpg" alt="" className="public-footer-mark" />
            <strong>Zabe Hostel</strong>
            <p>Smart hostel management for students and staff.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/faqs">FAQs</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              WhatsApp: 0700 532 298
            </a>
          </div>
        </div>
        <p className="public-copy">
          © {new Date().getFullYear()} Zabe Hostel Management System
        </p>
      </footer>

      <a
        className="whatsapp-float"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <path
            fill="#fff"
            d="M16.1 3C9.3 3 3.8 8.5 3.8 15.3c0 2.2.6 4.3 1.7 6.1L3 29l7.8-2.4c1.7.9 3.6 1.4 5.5 1.4 6.8 0 12.3-5.5 12.3-12.3S22.9 3 16.1 3zm0 22.3c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-4.6 1.4 1.4-4.5-.2-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.5 4.5-10 10-10s10 4.5 10 10-4.4 10.2-9.8 10.2zm5.5-7.5c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6 0-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.2 2 3.1 4.9 4.3 1.7.7 2.4.8 3.3.7.5-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.2-.2-.3-.5-.4z"
          />
        </svg>
      </a>
    </div>
  );
}
