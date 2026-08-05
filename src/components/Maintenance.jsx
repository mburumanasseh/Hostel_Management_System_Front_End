import { useEffect, useState } from "react";
import {
  getMaintenanceRequests,
  getMyMaintenanceRequests,
  addMaintenanceRequest,
} from "../api";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // GET LOGGED-IN USER
  // ==========================================================

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const role = user?.role;


  // ==========================================================
  // LOAD MAINTENANCE REQUESTS
  // ==========================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        let response;

        if (role === "student") {

          // Students only see their own requests.
          response = await getMyMaintenanceRequests();

        } else {

          // Admin and warden see all requests.
          response = await getMaintenanceRequests();

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

    loadData();

  }, [role]);


  // ==========================================================
  // SUBMIT REQUEST
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

          description:
            description.trim(),

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
  // RENDER
  // ==========================================================

  return (

    <div className="maintenance-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Maintenance Requests
          </h1>

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


      {/* FORM */}

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


            {/* ==================================================
                CURRENT USER
            ================================================== */}

            {role === "student" && (

              <div className="form-group full-width">

                <label>
                  Student
                </label>

                <input
                  type="text"
                  value={
                    user
                      ? `${user.first_name} ${user.last_name}`
                      : "Current user"
                  }
                  disabled
                />

                <small>
                  Your student account is automatically used.
                </small>

              </div>

            )}


            {/* ==================================================
                ISSUE TITLE
            ================================================== */}

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


            {/* ==================================================
                DESCRIPTION
            ================================================== */}

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


            {/* ==================================================
                PRIORITY
            ================================================== */}

            <div className="form-group">

              <label>
                Priority
              </label>

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


      {/* ======================================================
          REQUEST TABLE
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

                  {role !== "student" && (
                    <th>Student</th>
                  )}

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


                    {/* Student column only for staff */}

                    {role !== "student" && (

                      <td>
                        {request.student_name ||
                          request.student ||
                          request.student_id}
                      </td>

                    )}


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