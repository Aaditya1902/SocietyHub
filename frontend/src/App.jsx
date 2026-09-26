import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Maintenance from "./pages/Maintenance";
import Amenities from "./pages/Amenities";
import Visitors from "./pages/Visitors";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResidents from "./pages/AdminResidents";

import Login from "./pages/Login";
import Complaints from "./pages/Complaints";

import societyHubLogo from "./assets/societyhub-logo.png";

import {
  getMyVisitors,
  getMyComplaints,
  getMyBills,
  getMyBookings,
} from "./services/dashboardService";


function Dashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [visitors, setVisitors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [bills, setBills] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          visitorsData,
          complaintsData,
          billsData,
          bookingsData,
        ] = await Promise.all([
          getMyVisitors(),
          getMyComplaints(),
          getMyBills(),
          getMyBookings(),
        ]);

        setVisitors(visitorsData);
        setComplaints(complaintsData);
        setBills(billsData);
        setBookings(bookingsData);

      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);


  const logout = () => {
    localStorage.clear();
    navigate("/");
  };


  const pendingBills = bills.filter(
    (bill) => bill.status === 1
  );


  const pendingAmount = pendingBills.reduce(
    (total, bill) =>
      total + Number(bill.amount || 0),
    0
  );


  const openComplaints = complaints.filter(
    (complaint) =>
      complaint.status === 1 ||
      complaint.status === 2 ||
      complaint.status === 3
  );


  const recentComplaints = complaints.slice(0, 3);
  const recentBills = bills.slice(0, 3);
  const recentBookings = bookings.slice(0, 3);


  const getComplaintStatus = (status) => {
    const statuses = {
      1: "Open",
      2: "Assigned",
      3: "In Progress",
      4: "Resolved",
      5: "Closed",
    };

    return statuses[status] || "Unknown";
  };


  const getVisitorStatus = (status) => {
    const statuses = {
      1: "Pending",
      2: "Approved",
      3: "Rejected",
      4: "Entered",
      5: "Exited",
    };

    return statuses[status] || "Unknown";
  };


  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };


  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>

        <p>
          Loading your dashboard...
        </p>
      </div>
    );
  }


  return (
    <div className="app-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div>

          {/* Logo */}

          <div className="dashboard-brand">

            <img
              src={societyHubLogo}
              alt="SocietyHub"
              className="dashboard-logo"
            />

          </div>


          {/* Navigation */}

          <nav className="dashboard-nav">

            <Link
              to="/dashboard"
              className="dashboard-nav-link active"
            >
              <span>⌂</span>
              Dashboard
            </Link>


            <Link
              to="/visitors"
              className="dashboard-nav-link"
            >
              <span>◉</span>
              Visitors
            </Link>


            <Link
              to="/complaints"
              className="dashboard-nav-link"
            >
              <span>✓</span>
              Complaints
            </Link>


            <Link
              to="/maintenance"
              className="dashboard-nav-link"
            >
              <span>₹</span>
              Maintenance
            </Link>


            <Link
              to="/amenities"
              className="dashboard-nav-link"
            >
              <span>◆</span>
              Amenities
            </Link>

          </nav>

        </div>


        {/* Sidebar User */}

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="sidebar-avatar">
              {role === "Admin"
                ? "A"
                : "R"}
            </div>


            <div>

              <strong>
                {role || "Resident"}
              </strong>

              <span>
                SocietyHub account
              </span>

            </div>

          </div>


          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content dashboard-main">


        {/* ================= HEADER ================= */}

        <header className="dashboard-topbar">

          <div>

            <p className="dashboard-eyebrow">
              SOCIETY OVERVIEW
            </p>


            <h1>
              Welcome back 👋
            </h1>


            <p className="dashboard-subtitle">
              Here's what's happening in
              your society today.
            </p>

          </div>


          <div className="dashboard-role">

            <div className="role-avatar">
              {role === "Admin"
                ? "A"
                : "R"}
            </div>


            <div>

              <strong>
                {role || "Resident"}
              </strong>

              <span>
                Account
              </span>

            </div>

          </div>

        </header>


        {/* ================= STATS ================= */}

        <section className="dashboard-stats">


          {/* Visitors */}

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-blue">
                ◉
              </div>

              <span className="stat-label">
                VISITORS
              </span>

            </div>


            <div className="stat-value">
              {visitors.length}
            </div>


            <p>
              Total visitor requests
            </p>

          </div>


          {/* Complaints */}

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-orange">
                ✓
              </div>

              <span className="stat-label">
                COMPLAINTS
              </span>

            </div>


            <div className="stat-value">
              {openComplaints.length}
            </div>


            <p>
              Open complaints
            </p>

          </div>


          {/* Maintenance */}

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-green">
                ₹
              </div>

              <span className="stat-label">
                MAINTENANCE
              </span>

            </div>


            <div className="stat-value">
              {pendingBills.length}
            </div>


            <p>
              {pendingBills.length > 0
                ? `${formatCurrency(
                    pendingAmount
                  )} pending`
                : "No pending bills"}
            </p>

          </div>


          {/* Bookings */}

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-purple">
                ◆
              </div>

              <span className="stat-label">
                BOOKINGS
              </span>

            </div>


            <div className="stat-value">
              {bookings.length}
            </div>


            <p>
              Amenity bookings
            </p>

          </div>

        </section>


        {/* ================= MAIN GRID ================= */}

        <section className="dashboard-content-grid">


          {/* ================= QUICK ACTIONS ================= */}

          <div className="dashboard-card quick-actions-card">

            <div className="dashboard-card-header">

              <div>

                <h2>
                  Quick actions
                </h2>

                <p>
                  Common society tasks
                </p>

              </div>

            </div>


            <div className="quick-actions">


              <Link
                to="/visitors"
                className="quick-action"
              >

                <div className="quick-action-icon blue">
                  ◉
                </div>


                <div>

                  <strong>
                    Manage Visitors
                  </strong>

                  <span>
                    Create or approve
                    visitor requests
                  </span>

                </div>


                <span className="action-arrow">
                  →
                </span>

              </Link>


              <Link
                to="/complaints"
                className="quick-action"
              >

                <div className="quick-action-icon orange">
                  ✓
                </div>


                <div>

                  <strong>
                    Raise Complaint
                  </strong>

                  <span>
                    Report a society issue
                  </span>

                </div>


                <span className="action-arrow">
                  →
                </span>

              </Link>


              <Link
                to="/maintenance"
                className="quick-action"
              >

                <div className="quick-action-icon green">
                  ₹
                </div>


                <div>

                  <strong>
                    View Maintenance
                  </strong>

                  <span>
                    Check your maintenance
                    bills
                  </span>

                </div>


                <span className="action-arrow">
                  →
                </span>

              </Link>


              <Link
                to="/amenities"
                className="quick-action"
              >

                <div className="quick-action-icon purple">
                  ◆
                </div>


                <div>

                  <strong>
                    Book an Amenity
                  </strong>

                  <span>
                    Reserve society
                    facilities
                  </span>

                </div>


                <span className="action-arrow">
                  →
                </span>

              </Link>

            </div>

          </div>


          {/* ================= RECENT ACTIVITY ================= */}

          <div className="dashboard-card">

            <div className="dashboard-card-header">

              <div>

                <h2>
                  Recent activity
                </h2>

                <p>
                  Your latest society activity
                </p>

              </div>

            </div>


            <div className="activity-list">


              {recentComplaints.length === 0 &&
              recentBills.length === 0 &&
              recentBookings.length === 0 ? (

                <div className="empty-activity">

                  <div>
                    ✓
                  </div>

                  <strong>
                    No recent activity
                  </strong>

                  <span>
                    Your recent society
                    activity will appear here.
                  </span>

                </div>

              ) : (

                <>


                  {/* Complaints */}

                  {recentComplaints.map(
                    (complaint) => (

                      <div
                        className="activity-item"
                        key={`complaint-${complaint.id}`}
                      >

                        <div className="activity-icon orange">
                          ✓
                        </div>


                        <div className="activity-info">

                          <strong>
                            {complaint.title}
                          </strong>

                          <span>
                            Complaint ·{" "}
                            {getComplaintStatus(
                              complaint.status
                            )}
                          </span>

                        </div>


                        <span className="activity-date">
                          {formatDate(
                            complaint.createdAt
                          )}
                        </span>

                      </div>

                    )
                  )}


                  {/* Bills */}

                  {recentBills.map(
                    (bill) => (

                      <div
                        className="activity-item"
                        key={`bill-${bill.id}`}
                      >

                        <div className="activity-icon green">
                          ₹
                        </div>


                        <div className="activity-info">

                          <strong>
                            Maintenance bill
                          </strong>

                          <span>
                            {bill.billingMonth} ·{" "}
                            {bill.status === 1
                              ? "Pending"
                              : "Paid"}
                          </span>

                        </div>


                        <strong className="activity-amount">
                          {formatCurrency(
                            bill.amount
                          )}
                        </strong>

                      </div>

                    )
                  )}


                  {/* Bookings */}

                  {recentBookings.map(
                    (booking) => (

                      <div
                        className="activity-item"
                        key={`booking-${booking.id}`}
                      >

                        <div className="activity-icon purple">
                          ◆
                        </div>


                        <div className="activity-info">

                          <strong>
                            {booking.amenityName}
                          </strong>

                          <span>
                            Amenity booking ·{" "}
                            {booking.status === 1
                              ? "Confirmed"
                              : "Cancelled"}
                          </span>

                        </div>


                        <span className="activity-date">
                          {formatDate(
                            booking.startTime
                          )}
                        </span>

                      </div>

                    )
                  )}

                </>

              )}

            </div>

          </div>

        </section>


        {/* ================= VISITOR OVERVIEW ================= */}

        <section className="dashboard-card dashboard-wide-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Visitor overview
              </h2>

              <p>
                Latest visitor requests
              </p>

            </div>


            <Link
              to="/visitors"
              className="view-all-link"
            >
              View all →
            </Link>

          </div>


          {visitors.length === 0 ? (

            <div className="dashboard-empty-row">

              <div className="empty-row-icon">
                ◉
              </div>


              <div>

                <strong>
                  No visitor requests yet
                </strong>

                <span>
                  Create a visitor request
                  when someone is expected.
                </span>

              </div>


              <Link
                to="/visitors"
                className="small-primary-button"
              >
                Add visitor
              </Link>

            </div>

          ) : (

            <div className="visitor-overview-list">

              {visitors
                .slice(0, 4)
                .map((visitor) => (

                  <div
                    className="visitor-overview-item"
                    key={visitor.id}
                  >

                    <div className="visitor-avatar">

                      {visitor.visitorName
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>


                    <div className="visitor-info">

                      <strong>
                        {visitor.visitorName}
                      </strong>

                      <span>
                        Expected{" "}
                        {formatDate(
                          visitor.expectedArrival
                        )}
                      </span>

                    </div>


                    <span
                      className={`visitor-status status-${visitor.status}`}
                    >
                      {getVisitorStatus(
                        visitor.status
                      )}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </section>


        {/* ================= SOCIETY INFORMATION ================= */}

        <section className="dashboard-card society-info-card">

          <div className="society-info-header">

            <div>

              <p className="dashboard-eyebrow">
                YOUR SOCIETY
              </p>

              <h2>
                Green Valley Residency
              </h2>

              <p>
                Your registered apartment
                information
              </p>

            </div>


            <div className="society-info-icon">
              🏢
            </div>

          </div>


          <div className="society-details">


            <div className="society-detail">

              <span>
                Flat
              </span>

              <strong>
                101
              </strong>

            </div>


            <div className="society-detail">

              <span>
                Tower
              </span>

              <strong>
                Tower A
              </strong>

            </div>


            <div className="society-detail">

              <span>
                Resident Type
              </span>

              <strong>
                Owner
              </strong>

            </div>


            <div className="society-detail">

              <span>
                Status
              </span>

              <strong className="resident-active">
                ● Active Resident
              </strong>

            </div>

          </div>

        </section>


      </main>

    </div>
  );
}


/* =========================================================
   PLACEHOLDER
========================================================= */

function Placeholder({ title }) {

  return (

    <div className="placeholder-page">

      <h1>
        {title}
      </h1>

      <p>
        This module is coming next.
      </p>

      <Link to="/dashboard">
        ← Back to Dashboard
      </Link>

    </div>

  );
}


/* =========================================================
   DASHBOARD ROUTE
========================================================= */

function DashboardRoute() {

  const role =
    localStorage.getItem("role");


  if (role === "Admin") {

    return (
      <Navigate
        to="/admin-dashboard"
        replace
      />
    );

  }


  return <Dashboard />;
}


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem("token");


  if (!token) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  return children;
}


/* =========================================================
   ADMIN ROUTE
========================================================= */

function AdminRoute({
  children,
}) {

  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");


  if (!token) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  if (role !== "Admin") {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  return children;
}


/* =========================================================
   APP
========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* Login */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* Resident Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          }
        />


        {/* Visitors */}

        <Route
          path="/visitors"
          element={
            <ProtectedRoute>
              <Visitors />
            </ProtectedRoute>
          }
        />


        {/* Complaints */}

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          }
        />


        {/* Maintenance */}

        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          }
        />


        {/* Amenities */}

        <Route
          path="/amenities"
          element={
            <ProtectedRoute>
              <Amenities />
            </ProtectedRoute>
          }
        />


        {/* Admin Residents */}

        <Route
          path="/admin-residents"
          element={
            <AdminRoute>
              <AdminResidents />
            </AdminRoute>
          }
        />


        {/* Admin Dashboard */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


        {/* Unknown routes */}

        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;