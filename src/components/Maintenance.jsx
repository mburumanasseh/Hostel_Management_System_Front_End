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

  // Load maintenance requests, students and rooms
  useEffect(() => {
    const loadData = async () => {
      try {
        const [maintenanceRes, studentsRes, roomsRes] =
          await Promise.all([
            getMaintenanceRequests(),
            getStudents(),
            getRooms(),
          ]);

        setRequests(
          maintenanceRes.data.requests || []
        );

        setStudents(
          studentsRes.data.students ||
          studentsRes.data ||
          []
        );

        setRooms(
          roomsRes.data.rooms ||
          roomsRes.data ||
          []
        );
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error ||
          "Failed to load maintenance data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !studentId ||
      !roomId ||
      !title.trim() ||
      !description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await addMaintenanceRequest({
        student_id: Number(studentId),
        room_id: Number(roomId),
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      const newRequest =
        response.data.request;

      setRequests((prev) => [
        newRequest,
        ...prev,
      ]);

      // Reset form
      setStudentId("");
      setRoomId("");
      setTitle("");
      setDescription("");
      setPriority("Medium");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to create maintenance request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="maintenance-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Maintenance Requests</h1>
          <p>
            Report and manage hostel maintenance issues.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="maintenance-error">
          {typeof error === "object"
            ? JSON.stringify(error)
            : error}
        </div>
      )}

      {/* REQUEST FORM */}
      <div className="maintenance-form-card">

        <div className="form-header">
          <h2>Submit Maintenance Request</h2>
          <p>
            Enter the details of the maintenance issue.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* STUDENT */}
            <div className="form-group">
              <label>
                Student <span>*</span>
              </label>

              <select
                value={studentId}
                onChange={(e) =>
                  setStudentId(e.target.value)
                }
                required
              >
                <option value="">
                  Select student
                </option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.first_name}{" "}
                    {student.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* ROOM */}
            <div className="form-group">
              <label>
                Room <span>*</span>
              </label>

              <select
                value={roomId}
                onChange={(e) =>
                  setRoomId(e.target.value)
                }
                required
              >
                <option value="">
                  Select room
                </option>

                {rooms.map((room) => (
                  <option
                    key={room.id}
                    value={room.id}
                  >
                    Room {room.room_number ||
                      room.number ||
                      room.id}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}
            <div className="form-group full-width">
              <label>
                Issue Title <span>*</span>
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Broken shower"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group full-width">
              <label>
                Description <span>*</span>
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the problem in detail..."
                rows="5"
                required
              />
            </div>

            {/* PRIORITY */}
            <div className="form-group">
              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Urgent">
                  Urgent
                </option>
              </select>
            </div>

          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Request"}
            </button>
          </div>

        </form>
      </div>

      {/* REQUESTS TABLE */}
      <div className="maintenance-table-card">

        <div className="table-header">
          <div>
            <h2>Maintenance Requests</h2>
            <p>
              Recent maintenance issues
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            No maintenance requests found.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="maintenance-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {requests.map((request) => (

                  <tr key={request.id}>

                    <td>
                      {request.id}
                    </td>

                    <td>
                      {request.student_name ||
                        request.student ||
                        request.student_id}
                    </td>

                    <td>
                      {request.room_number ||
                        request.room ||
                        request.room_id}
                    </td>

                    <td>
                      <strong>
                        {request.title}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`priority-badge ${String(
                          request.priority || "Medium"
                        ).toLowerCase()}`}
                      >
                        {request.priority ||
                          "Medium"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          request.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {request.status ||
                          "Pending"}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}