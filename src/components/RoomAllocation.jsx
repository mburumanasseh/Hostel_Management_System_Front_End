import { useEffect, useState } from "react";
import {
  getAllocations,
  createAllocation,
  getStudents,
  getRooms,
  getMyAllocation,
} from "../api";
import { getUserRole } from "../utils/auth";

export default function RoomAllocation() {
  const role = getUserRole();

  // =====================================================
  // STUDENT STATE
  // =====================================================

  const [myAllocation, setMyAllocation] = useState(null);

  // =====================================================
  // ADMIN / WARDEN STATE
  // =====================================================

  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [roomId, setRoomId] = useState("");

  // =====================================================
  // COMMON STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        // ===============================================
        // STUDENT
        // ===============================================

        if (role === "student") {
          const response = await getMyAllocation();

          setMyAllocation(
            response.data.allocation ||
            response.data
          );

          return;
        }

        // ===============================================
        // ADMIN / WARDEN
        // ===============================================

        const [
          allocationRes,
          studentRes,
          roomRes,
        ] = await Promise.all([
          getAllocations(),
          getStudents(),
          getRooms(),
        ]);

        setAllocations(
          allocationRes.data.allocations || []
        );

        setStudents(
          studentRes.data.students ||
          studentRes.data ||
          []
        );

        setRooms(
          roomRes.data.rooms ||
          roomRes.data ||
          []
        );

      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load allocation data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [role]);

  // =====================================================
  // ADMIN / WARDEN: ALLOCATE ROOM
  // =====================================================

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
        err.response?.data?.message ||
        "Failed to allocate room"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="room-allocation">
        <p>Loading room information...</p>
      </div>
    );
  }

  // =====================================================
  // STUDENT VIEW
  // =====================================================

  if (role === "student") {
    return (
      <div className="room-allocation">

        <h2>My Room</h2>

        <p>
          View your current hostel room allocation.
        </p>

        {error && (
          <p className="error">
            {typeof error === "object"
              ? JSON.stringify(error)
              : error}
          </p>
        )}

        {!myAllocation ? (
          <div className="empty-state">
            <h3>No Room Allocated</h3>

            <p>
              You currently do not have an active room
              allocation.
            </p>
          </div>
        ) : (
          <div className="my-room-card">

            <div className="room-card-header">
              <h3>Your Hostel Room</h3>

              <span className="room-status">
                {myAllocation.status || "Active"}
              </span>
            </div>

            <div className="room-details">

              <div className="room-detail">
                <span>Room</span>

                <strong>
                  {myAllocation.room?.room_number ||
                    `Room ${myAllocation.room_id}`}
                </strong>
              </div>

              <div className="room-detail">
                <span>Block</span>

                <strong>
                  {myAllocation.room?.block?.name ||
                    "Block information unavailable"}
                </strong>
              </div>

              <div className="room-detail">
                <span>Floor</span>

                <strong>
                  {myAllocation.room?.floor ??
                    "Not specified"}
                </strong>
              </div>

              <div className="room-detail">
                <span>Capacity</span>

                <strong>
                  {myAllocation.room?.capacity ??
                    "Not specified"}
                </strong>
              </div>

              <div className="room-detail">
                <span>Occupied</span>

                <strong>
                  {myAllocation.room?.occupied ??
                    "Not specified"}
                </strong>
              </div>

              <div className="room-detail">
                <span>Room Status</span>

                <strong>
                  {myAllocation.room?.status ||
                    "Not specified"}
                </strong>
              </div>

            </div>

          </div>
        )}

      </div>
    );
  }

  // =====================================================
  // ADMIN / WARDEN VIEW
  // =====================================================

  return (
    <div className="room-allocation">

      <h2>Room Allocation</h2>

      <p>
        Allocate rooms and manage current student
        allocations.
      </p>

      {error && (
        <p className="error">
          {typeof error === "object"
            ? JSON.stringify(error)
            : error}
        </p>
      )}

      {/* ===============================================
          ALLOCATION FORM
      =============================================== */}

      <div className="allocate-form">

        <select
          value={studentId}
          onChange={(e) =>
            setStudentId(e.target.value)
          }
          disabled={submitting}
        >
          <option value="">
            Select Student
          </option>

          {students.map((student) => (
            <option
              key={student.id}
              value={student.id}
            >
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
          onChange={(e) =>
            setRoomId(e.target.value)
          }
          disabled={submitting}
        >
          <option value="">
            Select Room
          </option>

          {rooms.map((room) => (
            <option
              key={room.id}
              value={room.id}
            >
              {room.room_number ||
                room.number ||
                `Room ${room.id}`}
            </option>
          ))}
        </select>

        <button
          onClick={handleAllocate}
          disabled={
            submitting ||
            !studentId ||
            !roomId
          }
        >
          {submitting
            ? "Allocating..."
            : "Allocate Room"}
        </button>

      </div>

      {/* ===============================================
          CURRENT ALLOCATIONS
      =============================================== */}

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

                <td>
                  {allocation.id}
                </td>

                <td>
                  {allocation.student?.name ||
                    allocation.student_id}
                </td>

                <td>
                  {allocation.room?.room_number ||
                    allocation.room_id}
                </td>

                <td>
                  {allocation.status ||
                    "Active"}
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}