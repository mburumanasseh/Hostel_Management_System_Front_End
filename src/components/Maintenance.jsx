import { useEffect, useState } from "react";
import {
  getMaintenanceRequests,
  addMaintenanceRequest,
  getStudents,
  getRooms,
} from "../api";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getMaintenanceRequests(),
      getStudents(),
      getRooms(),
    ])
      .then(([maintenanceRes, studentRes, roomRes]) => {
        setRequests(
          maintenanceRes.data.requests || []
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
      })
      .catch((err) => {
        console.error(err);

        setError(
          err.response?.data?.error ||
          "Failed to load maintenance data"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAdd = async () => {
    if (
      !studentId ||
      !roomId ||
      !title.trim() ||
      !description.trim()
    ) {
      setError(
        "Please fill in student, room, title and description."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await addMaintenanceRequest({
        student_id: Number(studentId),
        room_id: Number(roomId),
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      setRequests((prev) => [
        ...prev,
        response.data.request,
      ]);

      setStudentId("");
      setRoomId("");
      setTitle("");
      setDescription("");
      setPriority("Medium");

      alert("Maintenance request created!");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to create maintenance request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading maintenance...</p>;
  }

  return (
    <div className="maintenance">
      <h2>Maintenance Requests</h2>

      {error && (
        <p className="error">
          {typeof error === "object"
            ? JSON.stringify(error)
            : error}
        </p>
      )}

      <div className="new-request">
        <select
          value={studentId}
          onChange={(e) =>
            setStudentId(e.target.value)
          }
        >
          <option value="">Select Student</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name ||
                `Student ${student.id}`}
            </option>
          ))}
        </select>

        <select
          value={roomId}
          onChange={(e) =>
            setRoomId(e.target.value)
          }
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

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Issue title..."
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Describe the issue..."
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <button
          onClick={handleAdd}
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "+ New Request"}
        </button>
      </div>

      {requests.length === 0 ? (
        <p>No maintenance requests yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.title}</td>
                <td>{request.description}</td>
                <td>{request.priority}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
