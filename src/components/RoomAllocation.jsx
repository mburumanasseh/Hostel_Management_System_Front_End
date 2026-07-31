import { useEffect, useState } from "react";
import { getRoomAllocations, allocateRoom } from "../api";

export default function RoomAllocation() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getRoomAllocations()
      .then((res) => {
        if (isMounted) setRooms(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load room allocations");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAllocate = () => {
    const student = studentName.trim();
    const room = roomNumber.trim();
    if (!student || !room || submitting) return;

    setSubmitting(true);
    setError(null);

    allocateRoom({ student, room })
      .then((res) => {
        setRooms((prev) => [...prev, res.data]);
        setStudentName("");
        setRoomNumber("");
      })
      .catch((err) => {
        setError(err.message || "Failed to allocate room");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAllocate();
  };

  return (
    <div className="room-allocation">
      <h2>Room Allocation</h2>

      {error && <p className="error">{error}</p>}

      <div className="allocate-form">
        <input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Student name..."
          disabled={submitting}
        />
        <input
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Room number..."
          disabled={submitting}
        />
        <button
          onClick={handleAllocate}
          disabled={submitting || !studentName.trim() || !roomNumber.trim()}
        >
          {submitting ? "Allocating..." : "Allocate Room"}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : rooms.length === 0 ? (
        <p>No room allocations yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Room</th>
              <th>Block</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.student}</td>
                <td>{r.room}</td>
                <td>{r.block}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}