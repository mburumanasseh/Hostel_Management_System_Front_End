
import { useEffect, useState } from "react";

import {
  getMyPayments,
  getMyFinancialStatus,
  getHostelFees,
} from "../api";

export default function StudentFeeTracking() {
  const [payments, setPayments] = useState([]);
  const [financialStatus, setFinancialStatus] = useState(null);
  const [hostelFees, setHostelFees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD FINANCIAL INFORMATION
  |--------------------------------------------------------------------------
  */

  const loadFinancialInformation = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        paymentsResponse,
        financialResponse,
        feesResponse,
      ] = await Promise.all([
        getMyPayments(),
        getMyFinancialStatus(),
        getHostelFees(),
      ]);

      setPayments(
        paymentsResponse.data.payments || []
      );

      setFinancialStatus(
        financialResponse.data.financial_status || null
      );

      setHostelFees(
        feesResponse.data.hostel_fees ||
        feesResponse.data.fees ||
        []
      );

    } catch (err) {
      console.error(
        "Failed to load financial information:",
        err
      );

      setError(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          "Failed to load your financial information."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialInformation();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FIND CURRENT SEMESTER FEE
  |--------------------------------------------------------------------------
  |
  | The backend payment records contain the semester.
  | We use the most recent payment's semester to determine
  | which hostel fee applies.
  |
  */

  const currentSemester =
    payments.length > 0
      ? payments[0].semester
      : null;

  const currentHostelFee = hostelFees.find(
    (fee) =>
      fee.semester === currentSemester
  );

  /*
  |--------------------------------------------------------------------------
  | FINANCIAL VALUES
  |--------------------------------------------------------------------------
  */

  const requiredFee = currentHostelFee
    ? Number(currentHostelFee.amount || 0)
    : 0;

  const totalPaid = Number(
    financialStatus?.total_paid || 0
  );

  const totalPending = Number(
    financialStatus?.total_pending || 0
  );

  const totalFailed = Number(
    financialStatus?.total_failed || 0
  );

  /*
  |--------------------------------------------------------------------------
  | BALANCE
  |--------------------------------------------------------------------------
  */

  const balance = Math.max(
    requiredFee - totalPaid,
    0
  );

  /*
  |--------------------------------------------------------------------------
  | FINANCIAL STATUS
  |--------------------------------------------------------------------------
  */

  let status = "No Fee Set";
  let statusClass = "pending";

  if (requiredFee > 0) {

    if (balance <= 0) {
      status = "Paid";
      statusClass = "paid";

    } else if (totalPaid > 0) {
      status = "Partially Paid";
      statusClass = "pending";

    } else {
      status = "Pending";
      statusClass = "pending";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | PAYMENT STATUS CLASS
  |--------------------------------------------------------------------------
  */

  const getPaymentStatusClass = (paymentStatus) => {
    switch (paymentStatus) {
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
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="fee-page">

        <div className="empty-state">

          <p>
            Loading your financial information...
          </p>

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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <div>

          <h1>
            Fee Tracking
          </h1>

          <p>
            View your hostel fee balance and
            payment history.
          </p>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}


      {/* =====================================================
          FINANCIAL SUMMARY
      ===================================================== */}

      <div className="fee-summary">

        {/* REQUIRED FEE */}

        <div className="fee-card">

          <div className="fee-icon records">
            KSh
          </div>

          <div>

            <span>
              Required Fee
            </span>

            <h2>
              KSh{" "}
              {requiredFee.toLocaleString()}
            </h2>

            <small>
              {currentSemester ||
                "Current semester"}
            </small>

          </div>

        </div>


        {/* TOTAL PAID */}

        <div className="fee-card">

          <div className="fee-icon collected">
            ✓
          </div>

          <div>

            <span>
              Total Paid
            </span>

            <h2>
              KSh{" "}
              {totalPaid.toLocaleString()}
            </h2>

            <small>
              Successful payments
            </small>

          </div>

        </div>


        {/* BALANCE */}

        <div className="fee-card">

          <div className="fee-icon pending">
            !
          </div>

          <div>

            <span>
              Balance
            </span>

            <h2>
              KSh{" "}
              {balance.toLocaleString()}
            </h2>

            <small>
              Amount remaining
            </small>

          </div>

        </div>


        {/* FINANCIAL STATUS */}

        <div className="fee-card">

          <div className="fee-icon students">
            ✓
          </div>

          <div>

            <span>
              Financial Status
            </span>

            <h2>

              <span
                className={`payment-status ${statusClass}`}
              >
                {status}
              </span>

            </h2>

            <small>
              {totalPending > 0
                ? `KSh ${totalPending.toLocaleString()} pending`
                : "Account status"}
            </small>

          </div>

        </div>

      </div>


      {/* =====================================================
          FEE BREAKDOWN
      ===================================================== */}

      <div className="fee-table-card">

        <div className="table-header">

          <div>

            <h2>
              Fee Breakdown
            </h2>

            <p>
              Your current hostel fee status
            </p>

          </div>

        </div>


        <div className="table-wrapper">

          <table className="fee-table">

            <thead>

              <tr>

                <th>
                  Semester
                </th>

                <th>
                  Required Fee
                </th>

                <th>
                  Paid
                </th>

                <th>
                  Balance
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td>
                  {currentSemester || "-"}
                </td>

                <td>
                  KSh{" "}
                  {requiredFee.toLocaleString()}
                </td>

                <td>
                  KSh{" "}
                  {totalPaid.toLocaleString()}
                </td>

                <td>
                  KSh{" "}
                  {balance.toLocaleString()}
                </td>

                <td>

                  <span
                    className={`payment-status ${statusClass}`}
                  >
                    {status}
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          PAYMENT HISTORY
      ===================================================== */}

      <div className="fee-table-card">

        <div className="table-header">

          <div>

            <h2>
              My Payment History
            </h2>

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

                  <th>
                    ID
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Semester
                  </th>

                  <th>
                    Reference
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

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
                        className={`payment-status ${getPaymentStatusClass(
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


      {/* =====================================================
          FAILED PAYMENTS
      ===================================================== */}

      {totalFailed > 0 && (

        <div className="login-error">

          Failed payments:

          {" "}
          <strong>
            KSh {totalFailed.toLocaleString()}
          </strong>

          {" "}

          Please contact the finance office.

        </div>

      )}

    </div>
  );
}