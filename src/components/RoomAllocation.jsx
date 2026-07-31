import { useEffect, useState } from "react";
import {
  getAllocations,
  createAllocation,
  getStudents,
  getRooms,
} from "../api";

export default function RoomAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [roomId, setRoomId] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getAllocations(),
      getStudents(),
      getRooms(),
    ])
      .then(([allocationRes, studentRes, roomRes]) => {
        setAllocations(allocationRes.data.allocations || []);
        setStudents(studentRes.data.students || studentRes.data || []);
        setRooms(roomRes.data.rooms || roomRes.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError(
          err.response?.data?.error ||
          "Failed to load allocation data"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAllocate = async () => {
    if (!studentId || !roomId) {
      setError("Please select a student and room.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await createAllocation({
        student_id: Number(studentId),
        room_id: Number(roomId),
      });

      setAllocations((prev) => [
        ...prev,
        response.data.allocation,
      ]);

      setStudentId("");
      setRoomId("");

      alert("Room allocated successfully!");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to allocate room"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading room allocation...</p>;
  }

  return (
    <div className="room-allocation">
      <h2>Room Allocation</h2>

      {error && (
        <p className="error">
          {typeof error === "object"
            ? JSON.stringify(error)
            : error}
        </p>
      )}

      <div className="allocate-form">
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={submitting}
        >
          <option value="">Select Student</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name ||
                `${student.first_name || ""} ${
                  student.last_name || ""
                }`.trim() ||
                `Student ${student.id}`}
            </option>
          ))}
        </select>

        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          disabled={submitting}
        >
          <option value="">Select Room</option>

          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room_number ||
                room.number ||
                `Room ${room.id}`}
            </option>
          ))}
        </select>

        <button
          onClick={handleAllocate}
          disabled={submitting || !studentId || !roomId}
        >
          {submitting
            ? "Allocating..."
            : "Allocate Room"}
        </button>
      </div>

      <h3>Current Allocations</h3>

      {allocations.length === 0 ? (
        <p>No room allocations yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Room</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {allocations.map((allocation) => (
              <tr key={allocation.id}>
                <td>{allocation.id}</td>
                <td>
                  {allocation.student?.name ||
                    allocation.student_id}
                </td>
                <td>
                  {allocation.room?.room_number ||
                    allocation.room_id}
                </td>
                <td>
                  {allocation.status || "Active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
