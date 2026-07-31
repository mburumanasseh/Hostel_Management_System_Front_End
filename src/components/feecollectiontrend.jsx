
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { month: "Feb", Collected: 120000, Pending: 30000 },
  { month: "Mar", Collected: 135000, Pending: 25000 },
  { month: "Apr", Collected: 140000, Pending: 20000 },
  { month: "May", Collected: 150000, Pending: 18000 },
  { month: "Jun", Collected: 160000, Pending: 15000 },
  { month: "Jul", Collected: 148000, Pending: 22000 },
];

export default function FeeCollectionTrend() {
  return (
    <div className="fee-trend">
      <h3>Fee Collection Trend (Feb – Jul 2026)</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => `KSh ${v/1000}K`} />
        <Tooltip formatter={(v) => `KSh ${v}`} />
        <Legend />
        <Line type="monotone" dataKey="Collected" stroke="#2196f3" strokeWidth={3} />
        <Line type="monotone" dataKey="Pending" stroke="#ff9800" strokeWidth={3} />
      </LineChart>
    </div>
  );
}

