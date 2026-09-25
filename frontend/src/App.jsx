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
import {
  getMyComplaints,
  getMyBills,
  getMyBookings,
} from "./services/dashboardService";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [complaints, setComplaints] = useState([]);
const [bills, setBills] = useState([]);
const [bookings, setBookings] = useState([]);

useEffect(() => {
  const loadDashboard = async () => {
    try {
      const [
        complaintsData,
        billsData,
        bookingsData,
      ] = await Promise.all([
        getMyComplaints(),
        getMyBills(),
        getMyBookings(),
      ]);

      setComplaints(complaintsData);
      setBills(billsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );
    }
  };

  loadDashboard();
}, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="app-layout">

      <aside className="sidebar">
        <div className="brand">
          SocietyHub
        </div>

        <nav>
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/visitors">
            Visitors
          </Link>

          <Link to="/complaints">
            Complaints
          </Link>

          <Link to="/maintenance">
            Maintenance
          </Link>

          <Link to="/amenities">
            Amenities
          </Link>
        </nav>

        <button
          className="sidebar-logout"
          onClick={logout}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back to SocietyHub</p>
          </div>

          <div className="user-info">
            <span>{role}</span>
          </div>
        </header>

        <section className="welcome-card">
          <div>
            <h2>Welcome back! 👋</h2>

            <p>
              Manage your visitors, complaints,
              maintenance bills and amenities from
              one place.
            </p>
          </div>
        </section>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div>
              <p>Visitors</p>
              <h3>0</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛠️</div>
            <div>
              <p>Complaints</p>
              <h3>{complaints.length}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">₹</div>
            <div>
              <p>Pending Bills</p>
              <h3>
  ₹
  {bills
    .filter((bill) => bill.status === 1)
    .reduce(
      (total, bill) => total + bill.amount,
      0
    )}
</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div>
              <p>Bookings</p>
              <h3>{bookings.length}</h3>
            </div>
          </div>

        </section>

        <section className="content-grid">

          <div className="panel">
            <div className="panel-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="quick-actions">

              <Link to="/visitors">
                <span>👤</span>
                <strong>Add Visitor</strong>
                <small>Manage visitor access</small>
              </Link>

              <Link to="/complaints">
                <span>🛠️</span>
                <strong>New Complaint</strong>
                <small>Report an issue</small>
              </Link>

              <Link to="/maintenance">
                <span>💳</span>
                <strong>Maintenance</strong>
                <small>View your bills</small>
              </Link>

              <Link to="/amenities">
                <span>🏊</span>
                <strong>Book Amenity</strong>
                <small>Reserve a facility</small>
              </Link>

            </div>
          </div>

          <div className="panel">
  <div className="panel-header">
    <h2>Recent Activity</h2>
  </div>

  <div className="activity">

    <div className="activity-item">
      <span>✓</span>
      <div>
        <strong>
          {complaints.length} Complaints
        </strong>
        <p>
          Your submitted complaints
        </p>
      </div>
    </div>

    <div className="activity-item">
      <span>₹</span>
      <div>
        <strong>
          {bills.length} Maintenance Bills
        </strong>
        <p>
          View your maintenance payments
        </p>
      </div>
    </div>

    <div className="activity-item">
      <span>🏢</span>
      <div>
        <strong>
          {bookings.length} Amenity Bookings
        </strong>
        <p>
          Your upcoming reservations
        </p>
      </div>
    </div>

  </div>
</div>

          


        </section>

      </main>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="placeholder-page">
      <h1>{title}</h1>
      <p>This module is coming next.</p>

      <Link to="/dashboard">
        ← Back to Dashboard
      </Link>
    </div>
  );
}

function DashboardRoute() {
  const role = localStorage.getItem("role");

  if (role === "Admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Dashboard />;
}
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardRoute />
    </ProtectedRoute>
  }
/>

        <Route
  path="/visitors"
  element={
    <ProtectedRoute>
      <Visitors />
    </ProtectedRoute>
  }
/>

<Route
  path="/complaints"
  element={
    <ProtectedRoute>
      <Complaints />
    </ProtectedRoute>
  }
/>

<Route
  path="/maintenance"
  element={
    <ProtectedRoute>
      <Maintenance />
    </ProtectedRoute>
  }
/>

<Route
  path="/amenities"
  element={
    <ProtectedRoute>
      <Amenities />
    </ProtectedRoute>
  }
/>

        <Route path="/amenities" element={<Amenities />} />

        <Route
  path="/admin-residents"
  element={
    <AdminRoute>
      <AdminResidents />
    </AdminRoute>
  }
/>

<Route
  path="/admin-dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}



export default App;