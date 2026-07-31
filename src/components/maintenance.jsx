
import React, { useEffect, useState } from "react";
import { getMaintenanceRequests, addMaintenanceRequest } from "../api";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [newIssue, setNewIssue] = useState("");

  useEffect(() => {
    getMaintenanceRequests().then((res) => setRequests(res.data));
  }, []);

  const handleAdd = () => {
    addMaintenanceRequest({ issue: newIssue }).then((res) => {
      setRequests([...requests, res.data]);
      setNewIssue("");
    });
  };

  return (
    <div className="maintenance">
      <h2>Maintenance Requests</h2>
      <button onClick={handleAdd}>+ New Request</button>
      <input value={newIssue} onChange={(e) => setNewIssue(e.target.value)} placeholder="Describe issue..." />

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Student</th><th>Issue</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.student}</td>
              <td>{req.issue}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

