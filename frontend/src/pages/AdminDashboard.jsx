import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import societyHubLogo from "../assets/societyhub-logo.png";

function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    residents: 0,
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

  const paidBills = data.bills.filter(
    (bill) => bill.status === 2
  );

  const paidAmount = paidBills.reduce(
    (total, bill) => total + Number(bill.amount || 0),
    0
  );

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <h2>Loading admin dashboard...</h2>
          <p>Preparing your society overview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <img
            src={societyHubLogo}
            alt="SocietyHub"
          />
        </div>

        <div className="admin-role-card">
          <div className="admin-avatar">
            A
          </div>

          <div>
            <strong>Administrator</strong>
            <span>Society Management</span>
          </div>
        </div>

        <nav className="admin-nav">

          <Link
            to="/admin-dashboard"
            className="admin-nav-item active"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/admin-residents"
            className="admin-nav-item"
          >
            <span>👥</span>
            Residents
          </Link>

          
           

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-secure">
            <span className="secure-dot"></span>
            System operational
          </div>

          <button
            className="admin-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="admin-main">

        {/* TOP HEADER */}

        <header className="admin-topbar">

          <div>
            <p className="admin-eyebrow">
              SOCIETY ADMINISTRATION
            </p>

            <h1>
              Welcome back, Admin 👋
            </h1>

            <p className="admin-subtitle">
              Here's what's happening across your society today.
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-profile-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin Account</span>
            </div>

          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* STATISTICS */}

        <section className="admin-stats-grid">

          <div className="admin-stat-card blue">

            <div className="admin-stat-icon">
              👥
            </div>

            <div className="admin-stat-content">
              <span>Total Residents</span>
              <strong>{data.residents}</strong>
              <small>Registered residents</small>
            </div>

          </div>


          <div className="admin-stat-card orange">

            <div className="admin-stat-icon">
              !
            </div>

            <div className="admin-stat-content">
              <span>Open Complaints</span>
              <strong>{openComplaints.length}</strong>
              <small>Require attention</small>
            </div>

          </div>


          <div className="admin-stat-card green">

            <div className="admin-stat-icon">
              ₹
            </div>

            <div className="admin-stat-content">
              <span>Pending Bills</span>
              <strong>{pendingBills.length}</strong>
              <small>
                ₹{pendingAmount.toLocaleString("en-IN")} pending
              </small>
            </div>

          </div>


          <div className="admin-stat-card purple">

            <div className="admin-stat-icon">
              ◆
            </div>

            <div className="admin-stat-content">
              <span>Active Bookings</span>
              <strong>{confirmedBookings.length}</strong>
              <small>Confirmed reservations</small>
            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="admin-section">

          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">
                MANAGEMENT
              </p>

              <h2>Quick actions</h2>

              <p>
                Access the most frequently used administration tools.
              </p>
            </div>
          </div>


          <div className="admin-action-grid">

            <Link
              to="/admin-residents"
              className="admin-action-card"
            >
              <div className="admin-action-icon blue-icon">
                👥
              </div>

              <div>
                <h3>Manage Residents</h3>
                <p>
                  View residents and their flat information.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>


            <Link
              to="/complaints"
              className="admin-action-card"
            >
              <div className="admin-action-icon orange-icon">
                ✓
              </div>

              <div>
                <h3>Review Complaints</h3>
                <p>
                  Monitor and track society complaints.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>


            <Link
              to="/maintenance"
              className="admin-action-card"
            >
              <div className="admin-action-icon green-icon">
                ₹
              </div>

              <div>
                <h3>Maintenance</h3>
                <p>
                  Review society billing activity.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>


            <Link
              to="/amenities"
              className="admin-action-card"
            >
              <div className="admin-action-icon purple-icon">
                ◆
              </div>

              <div>
                <h3>Amenity Bookings</h3>
                <p>
                  Monitor facility reservations.
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

          </div>

        </section>


        {/* OVERVIEW */}

        <section className="admin-overview-grid">


          {/* FINANCE */}

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>
                <p className="admin-eyebrow">
                  FINANCE
                </p>

                <h2>Maintenance overview</h2>
              </div>

              <div className="panel-icon green-icon">
                ₹
              </div>

            </div>


            <div className="overview-list">

              <div className="overview-row">
                <span>Pending bills</span>
                <strong>
                  {pendingBills.length}
                </strong>
              </div>

              <div className="overview-row">
                <span>Pending amount</span>
                <strong>
                  ₹{pendingAmount.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="overview-row">
                <span>Paid bills</span>
                <strong>
                  {paidBills.length}
                </strong>
              </div>

              <div className="overview-row">
                <span>Total collected</span>
                <strong>
                  ₹{paidAmount.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="overview-row">
                <span>Total bills</span>
                <strong>
                  {data.bills.length}
                </strong>
              </div>

            </div>

          </div>


          {/* COMPLAINTS */}

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>
                <p className="admin-eyebrow">
                  SERVICES
                </p>

                <h2>Complaint overview</h2>
              </div>

              <div className="panel-icon orange-icon">
                !
              </div>

            </div>


            <div className="overview-list">

              <div className="overview-row">
                <span>Open / Active</span>
                <strong>
                  {openComplaints.length}
                </strong>
              </div>

              <div className="overview-row">
                <span>Total complaints</span>
                <strong>
                  {data.complaints.length}
                </strong>
              </div>

              <div className="overview-row">
                <span>Resolved / Closed</span>
                <strong>
                  {
                    data.complaints.filter(
                      (complaint) =>
                        complaint.status === 4 ||
                        complaint.status === 5
                    ).length
                  }
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* SOCIETY ACTIVITY */}

        <section className="admin-panel activity-panel">

          <div className="admin-panel-header">

            <div>
              <p className="admin-eyebrow">
                SOCIETY ACTIVITY
              </p>

              <h2>Platform overview</h2>

              <p>
                Current activity across SocietyHub modules.
              </p>
            </div>

            <div className="activity-status">
              <span></span>
              Live data
            </div>

          </div>


          <div className="activity-grid">

            <div className="activity-item">
              <div className="activity-icon blue-icon">
                👥
              </div>

              <div>
                <strong>
                  {data.residents} residents
                </strong>

                <p>
                  Registered in the society
                </p>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-icon orange-icon">
                ✓
              </div>

              <div>
                <strong>
                  {data.complaints.length} complaints
                </strong>

                <p>
                  Recorded in the system
                </p>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-icon green-icon">
                ₹
              </div>

              <div>
                <strong>
                  {data.bills.length} maintenance bills
                </strong>

                <p>
                  Generated for residents
                </p>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-icon purple-icon">
                ◆
              </div>

              <div>
                <strong>
                  {data.bookings.length} amenity bookings
                </strong>

                <p>
                  Recorded in the system
                </p>
              </div>
            </div>

          </div>

        </section>


        <footer className="admin-footer">
          <span>© 2026 SocietyHub</span>
          <span>Smart Society Management Platform</span>
        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;