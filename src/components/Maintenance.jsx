
import { useEffect, useState } from "react";

import {
  getMaintenanceRequests,
  getMyMaintenanceRequests,
  addMaintenanceRequest,
  updateMaintenanceStatus,
} from "../api";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState("");

  // ==========================================================
  // GET LOGGED-IN USER
  // ==========================================================

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (err) {
    console.error(
      "Failed to read logged-in user:",
      err
    );
  }

  const role = user?.role;

  // ==========================================================
  // LOAD MAINTENANCE REQUESTS
  // ==========================================================

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        let response;

        if (role === "student") {
          // Students see only their own requests.
          response =
            await getMyMaintenanceRequests();
        } else {
          // Admin and warden see all requests.
          response =
            await getMaintenanceRequests();
        }

        setRequests(
          response.data.requests || []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.error ||
            "Failed to load maintenance requests."
        );
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      loadRequests();
    }
  }, [role]);

  // ==========================================================
  // SUBMIT MAINTENANCE REQUEST
  // STUDENTS ONLY
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !title.trim() ||
      !description.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }

    setSubmitting(true);

    try {
      const response =
        await addMaintenanceRequest({
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

  // ==========================================================
  // UPDATE MAINTENANCE STATUS
  // ADMIN + WARDEN ONLY
  // ==========================================================

  const handleStatusUpdate = async (
    requestId,
    status
  ) => {
    setError("");
    setUpdatingStatus(requestId);

    try {
      const response =
        await updateMaintenanceStatus(
          requestId,
          {
            status,
          }
        );

      const updatedRequest =
        response.data.request;

      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? updatedRequest
            : request
        )
      );

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          "Failed to update maintenance status."
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="maintenance-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="page-header">

        <div>

          <h1>
            Maintenance Requests
          </h1>

          <p>
            {role === "student"
              ? "Report and track your hostel maintenance issues."
              : "View and manage hostel maintenance requests."}
          </p>

        </div>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="maintenance-error">
          {typeof error === "object"
            ? JSON.stringify(error)
            : error}
        </div>
      )}

      {/* ======================================================
          STUDENT MAINTENANCE FORM
      ====================================================== */}

      {role === "student" && (
        <div className="maintenance-form-card">

          <div className="form-header">

            <h2>
              Submit Maintenance Request
            </h2>

            <p>
              Enter the details of the maintenance issue.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* CURRENT STUDENT */}

              <div className="form-group full-width">

                <label>
                  Student
                </label>

                <input
                  type="text"
                  value={
                    user
                      ? `${user.first_name || ""} ${
                          user.last_name || ""
                        }`.trim()
                      : "Current user"
                  }
                  disabled
                />

                <small>
                  Your student account is automatically used.
                </small>

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
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe the problem in detail..."
                  rows="5"
                  required
                />

              </div>

              {/* PRIORITY */}

              <div className="form-group">

                <label>
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value
                    )
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

            {/* SUBMIT */}

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
      )}

      {/* ======================================================
          MAINTENANCE REQUEST TABLE
      ====================================================== */}

      <div className="maintenance-table-card">

        <div className="table-header">

          <div>

            <h2>
              Maintenance Requests
            </h2>

            <p>
              {role === "student"
                ? "Your maintenance requests"
                : "Recent maintenance issues"}
            </p>

          </div>

        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}

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

                  <th>
                    ID
                  </th>

                  {role !== "student" && (
                    <th>
                      Student
                    </th>
                  )}

                  <th>
                    Room
                  </th>

                  <th>
                    Title
                  </th>

                  <th>
                    Priority
                  </th>

                  <th>
                    Status
                  </th>

                  {/* ACTION COLUMN */}

                  {(role === "warden" ||
                    role === "admin") && (
                    <th>
                      Action
                    </th>
                  )}

                </tr>

              </thead>

              <tbody>

                {requests.map((request) => (

                  <tr key={request.id}>

                    {/* ID */}

                    <td>
                      {request.id}
                    </td>

                    {/* STUDENT */}

                    {role !== "student" && (
                      <td>
                        {request.student_name ||
                          request.student ||
                          request.student_id ||
                          "N/A"}
                      </td>
                    )}

                    {/* ROOM */}

                    <td>
                      {request.room_number ||
                        request.room ||
                        request.room_id ||
                        "N/A"}
                    </td>

                    {/* TITLE */}

                    <td>
                      <strong>
                        {request.title}
                      </strong>
                    </td>

                    {/* PRIORITY */}

                    <td>

                      <span
                        className={`priority-badge ${String(
                          request.priority ||
                            "Medium"
                        ).toLowerCase()}`}
                      >
                        {request.priority ||
                          "Medium"}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${String(
                          request.status ||
                            "Pending"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {request.status ||
                          "Pending"}
                      </span>

                    </td>

                    {/* ACTION */}

                    {(role === "warden" ||
                      role === "admin") && (

                      <td>

                        {request.status !==
                          "Resolved" ? (

                          <button
                            type="button"
                            className="status-update-button"
                            disabled={
                              updatingStatus ===
                              request.id
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                request.id,
                                "Resolved"
                              )
                            }
                          >
                            {updatingStatus ===
                            request.id
                              ? "Updating..."
                              : "Mark as Resolved"}
                          </button>

                        ) : (

                          <span className="completed-label">
                            Resolved
                          </span>

                        )}

                      </td>

                    )}

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
