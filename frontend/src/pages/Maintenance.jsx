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
    (total, bill) => total + bill.amount,
    0
  );

  const totalPending = pendingBills.reduce(
    (total, bill) => total + bill.amount,
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

  return (
    <div className="module-page">

      <div className="module-header">

        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>

        <h1>Maintenance Bills</h1>

        <p>
          View and track your society maintenance payments.
        </p>

      </div>

      {/* SUMMARY */}

      <div className="billing-summary">

        <div className="billing-stat">
          <span>Total Bills</span>
          <strong>{bills.length}</strong>
        </div>

        <div className="billing-stat">
          <span>Pending Amount</span>
          <strong>₹{totalPending}</strong>
        </div>

        <div className="billing-stat">
          <span>Paid Amount</span>
          <strong>₹{totalPaid}</strong>
        </div>

      </div>

      {/* BILLS */}

      <div className="module-card">

        <div className="card-title-row">
          <h2>My Bills</h2>

          <span className="count-badge">
            {bills.length}
          </span>
        </div>

        {loading ? (
          <p>Loading maintenance bills...</p>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : bills.length === 0 ? (
          <div className="empty-state">
            <p>No maintenance bills found.</p>
          </div>
        ) : (
          <div className="bill-list">

            {bills.map((bill) => (

              <div
                className="bill-item"
                key={bill.id}
              >

                <div className="bill-main">

                  <div>
                    <h3>{bill.billingMonth}</h3>

                    <p>
                      Flat {bill.flatNumber}
                    </p>
                  </div>

                  <div className="bill-amount">
                    ₹{bill.amount}
                  </div>

                </div>

                <div className="bill-details">

                  <span>
                    Due:{" "}
                    {new Date(
                      bill.dueDate
                    ).toLocaleDateString()}
                  </span>

                  <span
                    className={`bill-status bill-status-${bill.status}`}
                  >
                    {getStatusLabel(bill.status)}
                  </span>

                </div>

                {bill.paidAt && (
                  <div className="paid-date">
                    Paid on{" "}
                    {new Date(
                      bill.paidAt
                    ).toLocaleDateString()}
                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Maintenance;