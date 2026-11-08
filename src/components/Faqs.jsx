import { useState } from "react";

const ITEMS = [
  {
    q: "How do I create an account?",
    a: "Use Register on the top right. Students sign up with their details and registration number. Staff accounts are created by an administrator.",
  },
  {
    q: "How do I book a room?",
    a: "After logging in as a student, open Book a Room from the sidebar or dashboard. Pick a room with free space and confirm. You can only hold one active room at a time.",
  },
  {
    q: "Who can change room allocations?",
    a: "Students can book for themselves when rooms are available. Wardens and admins can manage allocations for any student.",
  },
  {
    q: "How do I report a maintenance issue?",
    a: "Go to Maintenance after login, describe the problem, and submit. Staff will update the status as it is handled.",
  },
  {
    q: "Where do I see my fees?",
    a: "Students use My Fees. Finance and admin users manage hostel fees and payment records from their menus.",
  },
  {
    q: "I forgot my password. What should I do?",
    a: "If you can still sign in, use Settings → Change password. For a full reset, contact hostel administration or reach us on WhatsApp.",
  },
  {
    q: "How can I contact support?",
    a: "Use the green WhatsApp button or message 0700 532 298. You can also use the contact details in the site footer.",
  },
];

export default function Faqs() {
  const [open, setOpen] = useState(0);

  return (
    <div className="content-page">
      <header className="content-hero">
        <p className="hero-eyebrow">Help centre</p>
        <h1>Frequently asked questions</h1>
        <p>Quick answers about booking, fees, accounts, and support.</p>
      </header>

      <div className="faq-list">
        {ITEMS.map((item, index) => {
          const isOpen = open === index;
          return (
            <div
              key={item.q}
              className={`faq-item${isOpen ? " open" : ""}`}
            >
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <span>{item.q}</span>
                <span className="faq-chevron">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && <div className="faq-a">{item.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
