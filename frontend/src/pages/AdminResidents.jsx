import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/Resident");

      setResidents(response.data);
    } catch (error) {
      console.error("Failed to load residents:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load residents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  return (
    <div className="module-page">

      <div className="module-header">
        <Link to="/admin-dashboard" className="back-link">
          ← Admin Dashboard
        </Link>

        <h1>Resident Management</h1>

        <p>
          View residents and their society information.
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="module-card">

        <div className="card-title-row">
          <div>
            <h2>Residents</h2>
            <p>
              Registered residents and their flat details.
            </p>
          </div>

          <span className="count-badge">
            {residents.length}
          </span>
        </div>

        {loading ? (
          <p>Loading residents...</p>
        ) : residents.length === 0 ? (
          <div className="empty-state">
            <p>No residents found.</p>
          </div>
        ) : (
          <div className="resident-list">

            {residents.map((resident) => (
              <div
                className="resident-item"
                key={resident.id}
              >

                <div className="resident-main">

                  <div>
                    <h3>{resident.fullName}</h3>

                    <p>
                      📧 {resident.email}
                    </p>

                    <p>
                      📞 {resident.phoneNumber}
                    </p>
                  </div>

                  <div className="resident-flat">

                    <strong>
                      Flat {resident.flatNumber}
                    </strong>

                    <span>
                      {resident.towerName}
                    </span>

                    <span>
                      {resident.societyName}
                    </span>

                  </div>

                </div>

                <div className="resident-details">

                  <span>
                    {resident.relationship}
                  </span>

                  {resident.isPrimaryResident && (
                    <span className="primary-badge">
                      Primary Resident
                    </span>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminResidents;