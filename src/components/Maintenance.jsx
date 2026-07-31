import { useEffect, useState } from "react";
import { getMaintenanceRequests, addMaintenanceRequest } from "../api";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [newIssue, setNewIssue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMaintenanceRequests()
      .then((res) => {
        if (isMounted) setRequests(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load maintenance requests");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdd = () => {
    const trimmed = newIssue.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);

    addMaintenanceRequest({ issue: trimmed })
      .then((res) => {
        setRequests((prev) => [...prev, res.data]);
        setNewIssue("");
      })
      .catch((err) => {
        setError(err.message || "Failed to add request");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="maintenance">
      <h2>Maintenance Requests</h2>

      {error && <p className="error">{error}</p>}

      <div className="new-request">
        <input
          value={newIssue}
          onChange={(e) => setNewIssue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe issue..."
          disabled={submitting}
        />
        <button onClick={handleAdd} disabled={submitting || !newIssue.trim()}>
          {submitting ? "Adding..." : "+ New Request"}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No maintenance requests yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Issue</th>
              <th>Status</th>
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
      )}
    </div>
  );
}
