import { useEffect, useState } from "react";
import {
  getPayments,
  createPayment,
  updatePaymentStatus,
  deletePayment,
} from "../api";

export default function FeeTracking() {
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    amount: "",
    semester: "",
    reference_number: "",
  });

  const [submitting, setSubmitting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD PAYMENTS
  |--------------------------------------------------------------------------
  */

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPayments();

      setPayments(
        response.data.payments || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FORM INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE PAYMENT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);
      setError("");

      await createPayment({
        student_id: Number(formData.student_id),
        amount: Number(formData.amount),
        semester: formData.semester,
        reference_number:
          formData.reference_number,
      });

      setFormData({
        student_id: "",
        amount: "",
        semester: "",
        reference_number: "",
      });

      setShowForm(false);

      await loadPayments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to record payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    paymentId,
    status
  ) => {
    try {
      await updatePaymentStatus(
        paymentId,
        { status }
      );

      await loadPayments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to update payment status."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE PAYMENT
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (paymentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) return;

    try {
      await deletePayment(paymentId);

      setPayments((prev) =>
        prev.filter(
          (payment) =>
            payment.id !== paymentId
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to delete payment."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const totalCollected = payments
    .filter(
      (payment) =>
        payment.status === "Paid"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );

  const outstanding = payments
    .filter(
      (payment) =>
        payment.status === "Pending"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );

  const paidCount = payments.filter(
    (payment) =>
      payment.status === "Paid"
  ).length;

  return (
    <div className="fee-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Fee Tracking</h1>

          <p>
            Monitor student hostel fee
            payments and outstanding
            balances.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? "Cancel"
            : "+ Record Payment"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      {/* SUMMARY */}

      <div className="fee-summary">

        <div className="fee-card">
          <div className="fee-icon collected">
            KSh
          </div>

          <div>
            <span>Total Collected</span>

            <h2>
              KSh{" "}
              {totalCollected.toLocaleString()}
            </h2>

            <small>
              Successful payments
            </small>
          </div>
        </div>


        <div className="fee-card">
          <div className="fee-icon pending">
            !
          </div>

          <div>
            <span>Outstanding</span>

            <h2>
              KSh{" "}
              {outstanding.toLocaleString()}
            </h2>

            <small>
              Pending payments
            </small>
          </div>
        </div>


        <div className="fee-card">
          <div className="fee-icon students">
            ✓
          </div>

          <div>
            <span>Paid Payments</span>

            <h2>
              {paidCount}
            </h2>

            <small>
              Completed transactions
            </small>
          </div>
        </div>


        <div className="fee-card">
          <div className="fee-icon records">
            #
          </div>

          <div>
            <span>Total Records</span>

            <h2>
              {payments.length}
            </h2>

            <small>
              Payment transactions
            </small>
          </div>
        </div>

      </div>


      {/* RECORD PAYMENT FORM */}

      {showForm && (

        <div className="fee-form-card">

          <h2>Record Payment</h2>

          <p>
            Enter the student's payment
            information.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Student ID
                </label>

                <input
                  type="number"
                  name="student_id"
                  value={
                    formData.student_id
                  }
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Amount (KSh)
                </label>

                <input
                  type="number"
                  name="amount"
                  value={
                    formData.amount
                  }
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="1"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Semester
                </label>

                <input
                  type="text"
                  name="semester"
                  value={
                    formData.semester
                  }
                  onChange={handleChange}
                  placeholder="e.g. Semester 1"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Reference Number
                </label>

                <input
                  type="text"
                  name="reference_number"
                  value={
                    formData.reference_number
                  }
                  onChange={handleChange}
                  placeholder="e.g. MPESA12345"
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : "Save Payment"}
            </button>

          </form>

        </div>
      )}


      {/* PAYMENTS TABLE */}

      <div className="fee-table-card">

        <div className="table-header">

          <div>
            <h2>
              Recent Payments
            </h2>

            <p>
              Latest hostel fee
              transactions
            </p>
          </div>

        </div>


        {loading ? (

          <div className="empty-state">
            Loading payments...
          </div>

        ) : payments.length === 0 ? (

          <div className="empty-state">

            <h3>
              No payment records
            </h3>

            <p>
              No payments have been
              recorded yet.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="fee-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Student</th>

                  <th>Amount</th>

                  <th>Semester</th>

                  <th>Reference</th>

                  <th>Date</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {payments.map(
                  (payment) => (

                    <tr
                      key={payment.id}
                    >

                      <td>
                        {payment.id}
                      </td>

                      <td>
                        Student #
                        {payment.student_id}
                      </td>

                      <td>
                        KSh{" "}
                        {Number(
                          payment.amount
                        ).toLocaleString()}
                      </td>

                      <td>
                        {payment.semester}
                      </td>

                      <td>
                        {
                          payment.reference_number
                        }
                      </td>

                      <td>
                        {payment.payment_date
                          ? new Date(
                              payment.payment_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>

                        <select
                          value={
                            payment.status
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              payment.id,
                              e.target.value
                            )
                          }
                          className={`payment-status ${payment.status.toLowerCase()}`}
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Paid">
                            Paid
                          </option>

                          <option value="Failed">
                            Failed
                          </option>

                        </select>

                      </td>

                      <td>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              payment.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}