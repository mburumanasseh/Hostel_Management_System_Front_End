import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getDashboardStats } from "../api";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#795548"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getDashboardStats()
      .then((res) => {
        if (isMounted) setStats(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load dashboard data");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) return <p className="error">Error: {error}</p>;
  if (!stats) return <p>Loading...</p>;

  const blocks = stats.blocks ?? [];
  const maintenance = stats.maintenance ?? [];

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
      {blocks.length > 0 ? (
        <BarChart width={500} height={300} data={blocks}>
          <XAxis dataKey="block" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="occupied" fill="#2196f3" />
          <Bar dataKey="available" fill="#4caf50" />
        </BarChart>
      ) : (
        <p>No block data available</p>
      )}

      <h3>Maintenance Status</h3>
      {maintenance.length > 0 ? (
        <PieChart width={400} height={300}>
          <Pie data={maintenance} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={100}>
            {maintenance.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      ) : (
        <p>No maintenance data available</p>
      )}
    </div>
  );
}