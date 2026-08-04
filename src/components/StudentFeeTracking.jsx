
import { useEffect, useState } from "react";
import { getMyPayments } from "../api";

export default function StudentFeeTracking() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD MY PAYMENTS
  |--------------------------------------------------------------------------
  */

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyPayments();

      setPayments(response.data.payments || []);
    } catch (err) {
      console.error("Failed to load student payments:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          "Failed to load your payment information."
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
  | SUMMARY CALCULATIONS
  |--------------------------------------------------------------------------
  */

  const totalPaid = payments
    .filter((payment) => payment.status === "Paid")
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  const totalPending = payments
    .filter((payment) => payment.status === "Pending")
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

  const paidCount = payments.filter(
    (payment) => payment.status === "Paid"
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | STATUS CLASS
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "paid";

      case "Pending":
        return "pending";

      case "Failed":
        return "failed";

      default:
        return "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString();
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="fee-page">
        <div className="empty-state">
          <p>Loading your fee information...</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="fee-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Fee Tracking</h1>

          <p>
            View your hostel fee payments and
            payment history.
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      {/* SUMMARY */}

      <div className="fee-summary">

        {/* TOTAL PAID */}

        <div className="fee-card">
          <div className="fee-icon collected">
            KSh
          </div>

          <div>
            <span>Total Paid</span>

            <h2>
              KSh {totalPaid.toLocaleString()}
            </h2>

            <small>
              Successful payments
            </small>
          </div>
        </div>

        {/* PENDING */}

        <div className="fee-card">
          <div className="fee-icon pending">
            !
          </div>

          <div>
            <span>Pending</span>

            <h2>
              KSh {totalPending.toLocaleString()}
            </h2>

            <small>
              Pending payments
            </small>
          </div>
        </div>

        {/* PAID COUNT */}

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

        {/* PENDING COUNT */}

        <div className="fee-card">
          <div className="fee-icon records">
            #
          </div>

          <div>
            <span>Pending Payments</span>

            <h2>
              {pendingCount}
            </h2>

            <small>
              Awaiting confirmation
            </small>
          </div>
        </div>

      </div>

      {/* PAYMENT HISTORY */}

      <div className="fee-table-card">

        <div className="table-header">
          <div>
            <h2>My Payment History</h2>

            <p>
              Your hostel fee transactions
            </p>
          </div>
        </div>

        {payments.length === 0 ? (

          <div className="empty-state">

            <h3>
              No payment records
            </h3>

            <p>
              You do not have any hostel fee
              payments recorded yet.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="fee-table">

              <thead>
                <tr>
                  <th>ID</th>
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
                      <span
                        className={`payment-status ${getStatusClass(
                          payment.status
                        )}`}
                      >
                        {payment.status || "Unknown"}
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
