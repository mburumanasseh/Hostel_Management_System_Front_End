import { useMemo, useState } from "react";

const demoPayments = [
  {
    id: 1,
    student: "Manasseh Mburu",
    admission: "STU001",
    amount: 25000,
    date: "2026-07-28",
    status: "Paid",
  },
  {
    id: 2,
    student: "Brian Mwangi",
    admission: "STU002",
    amount: 18000,
    date: "2026-07-27",
    status: "Paid",
  },
  {
    id: 3,
    student: "Mary Wanjiku",
    admission: "STU003",
    amount: 12000,
    date: "2026-07-25",
    status: "Partial",
  },
  {
    id: 4,
    student: "Kevin Otieno",
    admission: "STU004",
    amount: 5000,
    date: "2026-07-20",
    status: "Pending",
  },
];

export default function FeeTracking() {
  const [payments] = useState(demoPayments);
  const [search, setSearch] = useState("");

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return payments;
    }

    return payments.filter(
      (payment) =>
        payment.student.toLowerCase().includes(query) ||
        payment.admission.toLowerCase().includes(query)
    );
  }, [payments, search]);

  const totalCollected = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingAmount = payments
    .filter((payment) => payment.status !== "Paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const paidCount = payments.filter(
    (payment) => payment.status === "Paid"
  ).length;

  return (
    <div className="fee-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Fee Tracking</h1>

          <p>
            Monitor student hostel fee payments and outstanding balances.
          </p>
        </div>

        <button className="primary-button">
          + Record Payment
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="fee-summary">

        <div className="fee-card">
          <div className="fee-icon collected">
            KSh
          </div>

          <div>
            <span>Total Collected</span>

            <h2>
              KSh {totalCollected.toLocaleString()}
            </h2>

            <small>
              Current academic term
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
              KSh {pendingAmount.toLocaleString()}
            </h2>

            <small>
              Requires follow-up
            </small>
          </div>
        </div>


        <div className="fee-card">
          <div className="fee-icon students">
            ✓
          </div>

          <div>
            <span>Paid Students</span>

            <h2>
              {paidCount}
            </h2>

            <small>
              Successful payments
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


      {/* PAYMENT TABLE */}
      <div className="fee-table-card">

        <div className="table-header">

          <div>
            <h2>Recent Payments</h2>

            <p>
              Latest hostel fee transactions
            </p>
          </div>


          <input
            type="text"
            placeholder="Search student..."
            className="fee-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        {filteredPayments.length === 0 ? (

          <div className="empty-state">
            No payment records found.
          </div>

        ) : (

          <div className="table-wrapper">

            <table className="fee-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Admission No.</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>


              <tbody>

                {filteredPayments.map((payment) => (

                  <tr key={payment.id}>

                    <td>
                      <strong>
                        {payment.student}
                      </strong>
                    </td>

                    <td>
                      {payment.admission}
                    </td>

                    <td>
                      KSh {payment.amount.toLocaleString()}
                    </td>

                    <td>
                      {payment.date}
                    </td>

                    <td>

                      <span
                        className={`payment-status ${payment.status.toLowerCase()}`}
                      >
                        {payment.status}
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