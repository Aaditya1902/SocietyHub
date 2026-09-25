import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [data, setData] = useState({
    residents: [],
    complaints: [],
    bills: [],
    bookings: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          residentsResponse,
          complaintsResponse,
          billsResponse,
          bookingsResponse,
        ] = await Promise.all([
          api.get("/Resident/count"),
          api.get("/Complaint"),
          api.get("/MaintenanceBill"),
          api.get("/AmenityBooking"),
        ]);

        setData({
  residents: residentsResponse.data.count,
  complaints: complaintsResponse.data,
  bills: billsResponse.data,
  bookings: bookingsResponse.data,
});
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const openComplaints = data.complaints.filter(
    (complaint) =>
      complaint.status === 1 ||
      complaint.status === 2 ||
      complaint.status === 3
  );

  const pendingBills = data.bills.filter(
    (bill) => bill.status === 1
  );

  const confirmedBookings = data.bookings.filter(
    (booking) => booking.status === 1
  );

  const pendingAmount = pendingBills.reduce(
    (total, bill) => total + Number(bill.amount || 0),
    0
  );

  if (loading) {
    return (
      <div className="module-page">
        <div className="module-header">
          <h1>Admin Dashboard</h1>
          <p>Loading society statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="module-page">

      <div className="module-header">
  <h1>Admin Dashboard</h1>

  <p>
    Monitor residents, complaints, maintenance and amenity bookings.
  </p>

  <div className="admin-actions">
    <Link to="/admin-residents" className="primary-button">
      👥 Manage Residents
    </Link>

    <Link to="/complaints" className="secondary-button">
      📝 View Complaints
    </Link>

    <Link to="/maintenance" className="secondary-button">
      💰 View Maintenance
    </Link>

    <Link to="/amenities" className="secondary-button">
      🏊 View Bookings
    </Link>
  </div>
</div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <span>👥</span>
          <p>Total Residents</p>
          <strong>{data.residents}</strong>
        </div>

        <div className="admin-stat-card">
          <span>📝</span>
          <p>Open Complaints</p>
          <strong>{openComplaints.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>💰</span>
          <p>Pending Bills</p>
          <strong>{pendingBills.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>🏊</span>
          <p>Active Bookings</p>
          <strong>{confirmedBookings.length}</strong>
        </div>

      </div>

      <div className="admin-summary-grid">

        <div className="module-card">
          <div className="card-title-row">
            <h2>Maintenance Overview</h2>
          </div>

          <div className="admin-summary-row">
            <span>Pending Bills</span>
            <strong>{pendingBills.length}</strong>
          </div>

          <div className="admin-summary-row">
            <span>Pending Amount</span>
            <strong>₹{pendingAmount.toLocaleString()}</strong>
          </div>

          <div className="admin-summary-row">
            <span>Total Bills</span>
            <strong>{data.bills.length}</strong>
          </div>
        </div>

        <div className="module-card">
          <div className="card-title-row">
            <h2>Complaint Overview</h2>
          </div>

          <div className="admin-summary-row">
            <span>Open / Active</span>
            <strong>{openComplaints.length}</strong>
          </div>

          <div className="admin-summary-row">
            <span>Total Complaints</span>
            <strong>{data.complaints.length}</strong>
          </div>
        </div>

      </div>

      <div className="module-card">

        <div className="card-title-row">
          <h2>Society Activity</h2>
        </div>

        <div className="activity-list">

          <div className="admin-activity">
            <span>👥</span>
            <div>
              <strong>{data.residents} residents</strong>
              <p>Registered in the society</p>
            </div>
          </div>

          <div className="admin-activity">
            <span>📝</span>
            <div>
              <strong>{data.complaints.length} complaints</strong>
              <p>Recorded in the system</p>
            </div>
          </div>

          <div className="admin-activity">
            <span>💰</span>
            <div>
              <strong>{data.bills.length} maintenance bills</strong>
              <p>Generated for residents</p>
            </div>
          </div>

          <div className="admin-activity">
            <span>🏊</span>
            <div>
              <strong>{data.bookings.length} amenity bookings</strong>
              <p>Recorded in the system</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;