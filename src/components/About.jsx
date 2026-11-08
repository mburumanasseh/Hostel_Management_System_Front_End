export default function About() {
  return (
    <div className="content-page">
      <header className="content-hero">
        <p className="hero-eyebrow">About Zabe</p>
        <h1>Built for modern hostel operations</h1>
        <p>
          Zabe helps hostels run day-to-day work online — from room allocation
          to fees and maintenance — so students and staff stay aligned.
        </p>
      </header>

      <section className="content-sections">
        <div>
          <h2>Our mission</h2>
          <p>
            Reduce paperwork and confusion around rooms, payments, and repairs.
            Everyone should know where they stand: which room they have, what
            they owe, and what is being fixed.
          </p>
        </div>
        <div>
          <h2>Who it is for</h2>
          <ul className="check-list">
            <li>
              <strong>Students</strong> — book rooms, view fees, submit maintenance requests
            </li>
            <li>
              <strong>Wardens</strong> — manage allocations and maintenance
            </li>
            <li>
              <strong>Finance</strong> — track fees and payment records
            </li>
            <li>
              <strong>Admins</strong> — full oversight of the hostel system
            </li>
          </ul>
        </div>
        <div>
          <h2>Why Zabe</h2>
          <p>
            Clean dashboards, clear roles, and mobile-friendly access mean you
            can manage hostel life from a phone or desktop without training
            overhead.
          </p>
        </div>
      </section>
    </div>
  );
}
