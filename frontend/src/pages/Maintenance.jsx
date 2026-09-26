import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Maintenance() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/MaintenanceBill/my");

      setBills(response.data);
    } catch (error) {
      console.error("Failed to load maintenance bills:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load maintenance bills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const paidBills = bills.filter((bill) => bill.status === 2);
  const pendingBills = bills.filter((bill) => bill.status === 1);

  const totalPaid = paidBills.reduce(
    (total, bill) => total + Number(bill.amount || 0),
    0
  );

  const totalPending = pendingBills.reduce(
    (total, bill) => total + Number(bill.amount || 0),
    0
  );

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Paid";
      default:
        return "Unknown";
    }
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const nextPendingBill = [...pendingBills].sort(
    (a, b) =>
      new Date(a.dueDate) - new Date(b.dueDate)
  )[0];

  return (
    <div className="module-page maintenance-page">

      {/* HEADER */}
      <div className="module-header">

        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>

        <div className="maintenance-header-content">

          <div>
            <p className="module-eyebrow">
              SOCIETY FINANCE
            </p>

            <h1>Maintenance</h1>

            <p className="module-description">
              View your society maintenance bills and
              track payment status in one place.
            </p>
          </div>

          <div className="maintenance-header-icon">
            ₹
          </div>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="maintenance-stats">

        <div className="maintenance-stat-card">

          <div className="maintenance-stat-icon blue">
            #
          </div>

          <div>
            <span>Total Bills</span>
            <strong>{bills.length}</strong>
          </div>

        </div>

        <div className="maintenance-stat-card">

          <div className="maintenance-stat-icon orange">
            ₹
          </div>

          <div>
            <span>Pending Amount</span>
            <strong>
              ₹{formatAmount(totalPending)}
            </strong>
          </div>

        </div>

        <div className="maintenance-stat-card">

          <div className="maintenance-stat-icon green">
            ✓
          </div>

          <div>
            <span>Paid Amount</span>
            <strong>
              ₹{formatAmount(totalPaid)}
            </strong>
          </div>

        </div>

        <div className="maintenance-stat-card">

          <div className="maintenance-stat-icon purple">
            ✓
          </div>

          <div>
            <span>Paid Bills</span>
            <strong>{paidBills.length}</strong>
          </div>

        </div>

      </div>

      {/* NEXT PAYMENT */}
      {nextPendingBill && (
        <div className="maintenance-alert">

          <div className="maintenance-alert-icon">
            ₹
          </div>

          <div className="maintenance-alert-content">

            <span>PAYMENT DUE</span>

            <strong>
              ₹{formatAmount(nextPendingBill.amount)}
            </strong>

            <p>
              {nextPendingBill.billingMonth} maintenance
              bill is due on{" "}
              {formatDate(nextPendingBill.dueDate)}.
            </p>

          </div>

          <span className="maintenance-alert-status">
            Pending
          </span>

        </div>
      )}

      {/* BILLS */}
      <div className="module-card maintenance-bills-card">

        <div className="maintenance-list-header">

          <div>
            <p className="module-eyebrow">
              PAYMENT HISTORY
            </p>

            <h2>My maintenance bills</h2>

            <p>
              Review your current and previous maintenance
              payments.
            </p>
          </div>

          <span className="count-badge">
            {bills.length}
          </span>

        </div>

        {loading ? (

          <div className="maintenance-loading">
            <span className="button-spinner"></span>
            <p>Loading maintenance bills...</p>
          </div>

        ) : error ? (

          <div className="maintenance-error">
            <span>!</span>
            {error}
          </div>

        ) : bills.length === 0 ? (

          <div className="maintenance-empty">

            <div className="maintenance-empty-icon">
              ₹
            </div>

            <h3>No maintenance bills</h3>

            <p>
              Your maintenance bills will appear here
              once they are generated.
            </p>

          </div>

        ) : (

          <div className="bill-list">

            {bills.map((bill) => (

              <div
                className="bill-item"
                key={bill.id}
              >

                <div className="bill-icon">
                  ₹
                </div>

                <div className="bill-main">

                  <div className="bill-heading">

                    <h3>
                      {bill.billingMonth}
                    </h3>

                    <span
                      className={`bill-status bill-status-${bill.status}`}
                    >
                      {getStatusLabel(bill.status)}
                    </span>

                  </div>

                  <p className="bill-flat">
                    Flat {bill.flatNumber}
                  </p>

                  <div className="bill-meta">

                    <span>
                      Due {formatDate(bill.dueDate)}
                    </span>

                    {bill.paidAt && (
                      <span>
                        Paid {formatDate(bill.paidAt)}
                      </span>
                    )}

                  </div>

                </div>

                <div className="bill-amount-section">

                  <span>Amount</span>

                  <strong>
                    ₹{formatAmount(bill.amount)}
                  </strong>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Maintenance;