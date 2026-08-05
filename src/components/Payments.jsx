import { useEffect, useState } from "react";
import {
  getPayments,
  updatePaymentStatus,
} from "../api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPayments();

      setPayments(response.data.payments || []);
    } catch (err) {
      console.error("Failed to load payments:", err);

      setError(
        err.response?.data?.error ||
          "Failed to load payment records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleStatusChange = async (paymentId, status) => {
    try {
      await updatePaymentStatus(paymentId, {
        status,
      });

      await loadPayments();
    } catch (err) {
      console.error("Failed to update payment:", err);

      setError(
        err.response?.data?.error ||
          "Failed to update payment status."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="fee-page">
        <div className="empty-state">
          <p>Loading payment records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-page">

      <div className="page-header">
        <div>
          <h1>Payments</h1>
          <p>
            Manage student hostel fee payments.
          </p>
        </div>
      </div>

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      <div className="fee-table-card">

        <div className="table-header">
          <div>
            <h2>Payment Records</h2>
            <p>
              View and manage student payments.
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="empty-state">
            <h3>No payment records</h3>
            <p>
              No student payments have been recorded yet.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="fee-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student ID</th>
                  <th>Amount</th>
                  <th>Semester</th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>

                    <td>
                      {payment.id}
                    </td>

                    <td>
                      {payment.student_id}
                    </td>

                    <td>
                      KSh{" "}
                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}
                    </td>

                    <td>
                      {payment.semester || "-"}
                    </td>

                    <td>
                      {payment.reference_number || "-"}
                    </td>

                    <td>
                      {formatDate(
                        payment.payment_date
                      )}
                    </td>

                    <td>
                      <select
                        value={payment.status}
                        onChange={(event) =>
                          handleStatusChange(
                            payment.id,
                            event.target.value
                          )
                        }
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