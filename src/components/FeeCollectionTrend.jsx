
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getPayments } from "../api";

export default function FeeCollectionTrend() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPayments();

        const payments = response.data.payments || [];

        /*
         * Group payments by month.
         */
        const monthlyData = {};

        payments.forEach((payment) => {
          if (!payment.payment_date) {
            return;
          }

          const date = new Date(payment.payment_date);

          if (Number.isNaN(date.getTime())) {
            return;
          }

          const month = date.toLocaleDateString("en-US", {
            month: "short",
          });

          const year = date.getFullYear();

          const key = `${year}-${date.getMonth()}`;

          if (!monthlyData[key]) {
            monthlyData[key] = {
              month,
              year,
              Collected: 0,
              Pending: 0,
              Failed: 0,
              timestamp: date.getTime(),
            };
          }

          const amount = Number(payment.amount || 0);

          if (payment.status === "Paid") {
            monthlyData[key].Collected += amount;
          }

          if (payment.status === "Pending") {
            monthlyData[key].Pending += amount;
          }

          if (payment.status === "Failed") {
            monthlyData[key].Failed += amount;
          }
        });

        /*
         * Convert object to array and sort chronologically.
         */
        const chartData = Object.values(monthlyData)
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((item) => ({
            month: `${item.month} ${item.year}`,
            Collected: item.Collected,
            Pending: item.Pending,
            Failed: item.Failed,
          }));

        setData(chartData);

      } catch (err) {
        console.error(
          "Failed to load fee collection data:",
          err
        );

        setError(
          err.response?.data?.error ||
            "Failed to load fee collection data."
        );

      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="fee-trend">
        <h3>Fee Collection Trend</h3>

        <p>Loading fee collection data...</p>
      </div>
    );
  }

  /*
   * ERROR
   */
  if (error) {
    return (
      <div className="fee-trend">
        <h3>Fee Collection Trend</h3>

        <div className="login-error">
          {error}
        </div>
      </div>
    );
  }

  /*
   * NO DATA
   */
  if (data.length === 0) {
    return (
      <div className="fee-trend">
        <h3>Fee Collection Trend</h3>

        <div className="empty-state">
          <p>
            No payment data available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-trend">

      <h3>
        Fee Collection Trend
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
          />

          <YAxis
            tickFormatter={(value) =>
              `KSh ${value / 1000}K`
            }
          />

          <Tooltip
            formatter={(value, name) => [
              `KSh ${Number(value).toLocaleString()}`,
              name,
            ]}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="Collected"
            stroke="#2196f3"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="Pending"
            stroke="#ff9800"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="Failed"
            stroke="#f44336"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}
