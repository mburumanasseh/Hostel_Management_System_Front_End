
import React from "react";

export default function Topbar() {
  return (
    <div className="topbar">
      <input type="text" placeholder="Search..." className="search" />
      <div className="user">
        <span className="icon">🔔</span>
        <span className="profile">HW</span>
      </div>
    </div>
  );
}

