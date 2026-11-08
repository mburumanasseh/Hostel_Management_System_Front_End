import { Link } from "react-router-dom";
import InstallAppHint from "./InstallAppHint";

export default function Home() {
  return (
    <div className="home-page">
      <InstallAppHint />
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Zabe Hostel Management System</p>
          <h1>
            Hostel life,
            <span> managed simply.</span>
          </h1>
          <p className="hero-lead">
            Book rooms, track fees, raise maintenance requests, and stay
            organized — built for students, wardens, and finance teams.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="public-btn public-btn-primary">
              Get started
            </Link>
            <Link to="/about" className="public-btn public-btn-ghost">
              Learn more
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <img src="/logo-mark.jpg" alt="" className="hero-mark" />
          <h3>Everything in one place</h3>
          <ul>
            <li>Student room booking</li>
            <li>Allocations & occupancy</li>
            <li>Fees and payments</li>
            <li>Maintenance tracking</li>
          </ul>
        </div>
      </section>

      <section className="feature-grid">
        <article>
          <div className="feature-icon">🛏️</div>
          <h3>Room booking</h3>
          <p>Students choose available rooms and see free capacity in real time.</p>
        </article>
        <article>
          <div className="feature-icon">🧾</div>
          <h3>Fees & payments</h3>
          <p>Finance tracks dues; students view their fee status without guesswork.</p>
        </article>
        <article>
          <div className="feature-icon">🔧</div>
          <h3>Maintenance</h3>
          <p>Report issues fast and let wardens resolve them with clear status updates.</p>
        </article>
        <article>
          <div className="feature-icon">🔐</div>
          <h3>Role-based access</h3>
          <p>Admin, warden, finance, and student each see only what they need.</p>
        </article>
      </section>

      <section className="cta-band">
        <div>
          <h2>Ready to join the hostel system?</h2>
          <p>Create a student account or sign in to continue.</p>
        </div>
        <div className="hero-actions">
          <Link to="/register" className="public-btn public-btn-primary">
            Register
          </Link>
          <Link to="/login" className="public-btn public-btn-ghost light">
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}
