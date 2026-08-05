import { useEffect, useState } from "react";
import {
  getHostelFees,
  createHostelFee,
  updateHostelFee,
  deleteHostelFee,
} from "../api";

export default function HostelFees() {
  const [fees, setFees] = useState([]);

  const [semester, setSemester] = useState("");
  const [amount, setAmount] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getHostelFees();

      setFees(
        response.data.hostel_fees ||
          response.data.fees ||
          []
      );
    } catch (err) {
      console.error(
        "Failed to load hostel fees:",
        err
      );

      setError(
        err.response?.data?.error ||
          "Failed to load hostel fees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const resetForm = () => {
    setSemester("");
    setAmount("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!semester.trim()) {
      setError("Semester is required.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError(
        "Hostel fee must be greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      const data = {
        semester: semester.trim(),
        amount: Number(amount),
      };

      if (editingId) {
        await updateHostelFee(
          editingId,
          data
        );

        setSuccess(
          "Hostel fee updated successfully."
        );
      } else {
        await createHostelFee(data);

        setSuccess(
          "Hostel fee created successfully."
        );
      }

      resetForm();

      await loadFees();

    } catch (err) {
      console.error(
        "Failed to save hostel fee:",
        err
      );

      setError(
        err.response?.data?.error ||
          "Failed to save hostel fee."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (fee) => {
    setEditingId(fee.id);
    setSemester(fee.semester);
    setAmount(fee.amount);

    setError("");
    setSuccess("");
  };

  const handleDelete = async (feeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hostel fee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteHostelFee(feeId);

      setSuccess(
        "Hostel fee deleted successfully."
      );

      await loadFees();

    } catch (err) {
      console.error(
        "Failed to delete hostel fee:",
        err
      );

      setError(
        err.response?.data?.error ||
          "Failed to delete hostel fee."
      );
    }
  };

  if (loading) {
    return (
      <div className="fee-page">
        <div className="empty-state">
          <p>Loading hostel fees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Hostel Fees</h1>

          <p>
            Set and manage hostel accommodation
            fees for each semester.
          </p>
        </div>
      </div>


      {/* MESSAGES */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {/* FORM */}

      <div className="fee-table-card">

        <div className="table-header">

          <div>
            <h2>
              {editingId
                ? "Update Hostel Fee"
                : "Set Hostel Fee"}
            </h2>

            <p>
              Determine the required hostel fee
              for a semester.
            </p>
          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="hostel-fee-form"
        >

          <div className="form-group">

            <label>
              Semester
            </label>

            <input
              type="text"
              placeholder="e.g. Semester 1 2026"
              value={semester}
              onChange={(event) =>
                setSemester(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Hostel Fee (KSh)
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="login-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Fee"
                : "Set Fee"}
            </button>


            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-button"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* EXISTING FEES */}

      <div className="fee-table-card">

        <div className="table-header">

          <div>
            <h2>
              Semester Hostel Fees
            </h2>

            <p>
              Currently configured hostel fees.
            </p>
          </div>

        </div>


        {fees.length === 0 ? (

          <div className="empty-state">

            <h3>
              No hostel fees configured
            </h3>

            <p>
              Add a semester fee using the form
              above.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="fee-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Semester</th>
                  <th>Hostel Fee</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {fees.map((fee) => (

                  <tr key={fee.id}>

                    <td>
                      {fee.id}
                    </td>

                    <td>
                      {fee.semester}
                    </td>

                    <td>
                      KSh{" "}
                      {Number(
                        fee.amount || 0
                      ).toLocaleString()}
                    </td>

                    <td>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(fee)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(fee.id)
                        }
                      >
                        Delete
                      </button>

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