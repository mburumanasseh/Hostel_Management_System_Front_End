
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>HostelMS</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/room-allocation">Room Allocation</Link></li>
        <li><Link to="/maintenance">Maintenance</Link></li>
        <li><Link to="/fee-tracking">Fee Tracking</Link></li>
      </ul>
      <div className="alerts">
        <p>2 overdue fees - 7 urgent maintenance requests</p>
      </div>
      <footer>
        <small>Hostel Warden (warden@mwangaza.ac.ke)</small>
      </footer>
    </div>
  );
}

