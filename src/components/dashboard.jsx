
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getDashboardStats } from "../api";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="metrics">
        <p>{stats.totalResidents} Total Residents (+{stats.newThisTerm} this term)</p>
        <p>{stats.occupancyRate}% Rooms Occupied ({stats.occupied}/{stats.totalRooms})</p>
        <p>{stats.pendingRequests} Pending Requests ({stats.urgentRequests} urgent)</p>
        <p>KSh {stats.feeCollected} Fee Collection (KSh {stats.outstanding} outstanding)</p>
      </div>

      <h3>Block Occupancy</h3>
      <BarChart width={500} height={300} data={stats.blocks}>
        <XAxis dataKey="block" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="occupied" fill="#2196f3" />
        <Bar dataKey="available" fill="#4caf50" />
      </BarChart>

      <h3>Maintenance Status</h3>
      <PieChart width={400} height={300}>
        <Pie data={stats.maintenance} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={100}>
          {stats.maintenance.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

