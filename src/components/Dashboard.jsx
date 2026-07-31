import { useEffect, useState } from "react";
import {
  getStudents,
  getRooms,
  getAllocations,
  getMaintenanceRequests,
} from "../api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    rooms: 0,
    allocations: 0,
    maintenance: 0,
  });

  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const results = await Promise.allSettled([
          getStudents(),
          getRooms(),
          getAllocations(),
          getMaintenanceRequests(),
        ]);

        const students =
          results[0].status === "fulfilled"
            ? results[0].value.data.students ||
              results[0].value.data ||
              []
            : [];

        const rooms =
          results[1].status === "fulfilled"
            ? results[1].value.data.rooms ||
              results[1].value.data ||
              []
            : [];

        const allocations =
          results[2].status === "fulfilled"
            ? results[2].value.data.allocations || []
            : [];

        const maintenance =
          results[3].status === "fulfilled"
            ? results[3].value.data.requests || []
            : [];

        setStats({
          students: students.length,
          rooms: rooms.length,
          allocations: allocations.length,
          maintenance: maintenance.length,
        });

        setMaintenanceRequests(maintenance);

        if (
          results.every(
            (result) => result.status === "rejected"
          )
        ) {
          setError("Could not connect to the backend.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  /*
   * Maintenance statistics
   */

  const pending = maintenanceRequests.filter(
    (request) =>
      request.status?.toLowerCase() === "pending"
  ).length;

  const resolved = maintenanceRequests.filter(
    (request) =>
      request.status?.toLowerCase() === "resolved"
  ).length;

  const inProgress = maintenanceRequests.filter(
    (request) =>
      request.status?.toLowerCase() === "in progress" ||
      request.status?.toLowerCase() === "in_progress"
  ).length;

  const urgent = maintenanceRequests.filter(
    (request) =>
      request.priority?.toLowerCase() === "urgent"
  ).length;

  /*
   * Occupancy
   */

  const occupiedRooms = stats.allocations;

  const availableRooms = Math.max(
    stats.rooms - occupiedRooms,
    0
  );

  const occupancyRate =
    stats.rooms > 0
      ? ((occupiedRooms / stats.rooms) * 100).toFixed(1)
      : 0;

  /*
   * Chart data
   *
   * Your backend currently doesn't provide
   * occupancy grouped by block, so we don't
   * invent block numbers here.
   */

  const occupancyData = [
    {
      name: "Rooms",
      occupied: occupiedRooms,
      available: availableRooms,
    },
  ];

  const maintenanceData = [
    {
      name: "Resolved",
      value: resolved,
    },
    {
      name: "In Progress",
      value: inProgress,
    },
    {
      name: "Pending",
      value: pending,
    },
    {
      name: "Urgent",
      value: urgent,
    },
  ].filter((item) => item.value > 0);

  const COLORS = [
    "#159a94",
    "#f59e0b",
    "#64748b",
    "#dc2626",
  ];

  return (
    <div className="dashboard-page">

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Hostel management overview
          </p>
        </div>

        <div className="dashboard-actions">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search students, rooms..."
            />
          </div>

          <button className="notification-button">
            ♧
            {urgent > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>

          <div className="user-avatar">
            HW
          </div>

        </div>

      </div>


      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* ================================
          METRIC CARDS
      ================================= */}

      <div className="metrics-grid">

        {/* STUDENTS */}

        <div className="metric-card">

          <div className="metric-top">

            <div className="metric-icon blue">
              👥
            </div>

            <span className="metric-arrow">
              ↗
            </span>

          </div>

          <h2>
            {stats.students}
          </h2>

          <p>
            Total Residents
          </p>

          <span className="metric-subtext">
            Registered students
          </span>

        </div>


        {/* ROOMS */}

        <div className="metric-card">

          <div className="metric-top">

            <div className="metric-icon green">
              🚪
            </div>

            <span className="metric-arrow">
              ↗
            </span>

          </div>

          <h2>
            {occupancyRate}%
          </h2>

          <p>
            Rooms Occupied
          </p>

          <span className="metric-subtext">
            {occupiedRooms} / {stats.rooms} rooms
          </span>

        </div>


        {/* MAINTENANCE */}

        <div className="metric-card">

          <div className="metric-top">

            <div className="metric-icon orange">
              🔧
            </div>

            <span className="metric-arrow red">
              ↘
            </span>

          </div>

          <h2>
            {pending}
          </h2>

          <p>
            Pending Requests
          </p>

          <span className="metric-subtext">
            {urgent} urgent
          </span>

        </div>


        {/* ALLOCATIONS */}

        <div className="metric-card">

          <div className="metric-top">

            <div className="metric-icon purple">
              🛏
            </div>

            <span className="metric-arrow">
              ↗
            </span>

          </div>

          <h2>
            {stats.allocations}
          </h2>

          <p>
            Room Allocations
          </p>

          <span className="metric-subtext">
            Active allocations
          </span>

        </div>

      </div>


      {/* ================================
          CHARTS
      ================================= */}

      <div className="charts-grid">

        {/* BLOCK / ROOM OCCUPANCY */}

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h3>
                Room Occupancy
              </h3>

              <p>
                Current hostel capacity
              </p>
            </div>

            <div className="chart-legend">

              <span>
                <i className="legend-dot occupied"></i>
                Occupied
              </span>

              <span>
                <i className="legend-dot available"></i>
                Available
              </span>

            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <BarChart
                data={occupancyData}
              >

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="occupied"
                  name="Occupied"
                  fill="#159a94"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="available"
                  name="Available"
                  fill="#d8eeee"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* MAINTENANCE STATUS */}

        <div className="chart-card">

          <div className="chart-header">

            <div>

              <h3>
                Maintenance Status
              </h3>

              <p>
                {stats.maintenance} total requests
              </p>

            </div>

          </div>


          <div className="maintenance-chart-body">

            <div className="donut-container">

              {maintenanceData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={230}
                >

                  <PieChart>

                    <Pie
                      data={maintenanceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                    >

                      {maintenanceData.map(
                        (entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              ) : (

                <div className="empty-chart">
                  No requests
                </div>

              )}

            </div>


            <div className="maintenance-legend">

              {maintenanceData.map(
                (item, index) => (

                  <div
                    className="maintenance-item"
                    key={item.name}
                  >

                    <div>

                      <span
                        className="legend-dot"
                        style={{
                          backgroundColor:
                            COLORS[
                              index %
                                COLORS.length
                            ],
                        }}
                      ></span>

                      {item.name}

                    </div>

                    <strong>
                      {item.value}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>


      {/* ================================
          ALERTS
      ================================= */}

      <div className="alerts-card">

        <div className="alert-icon">
          !
        </div>

        <div>

          <strong>
            Alerts
          </strong>

          <p>
            {urgent > 0
              ? `${urgent} urgent maintenance request${
                  urgent > 1 ? "s" : ""
                } require attention.`
              : "No urgent maintenance requests."}
          </p>

        </div>

      </div>

    </div>
  );
}