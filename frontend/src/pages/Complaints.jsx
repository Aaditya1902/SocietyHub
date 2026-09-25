import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Complaints() {
  const [complaints, setComplaints] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(2);

  const [loading, setLoading] = useState(false);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoadingComplaints(true);

      const response = await api.get("/Complaint/my");

      setComplaints(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load complaints."
      );
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post("/Complaint", {
  title,
  description,
  priority: Number(priority),
  flatId: "99c8aa82-6ddb-4ead-b9b5-29de4c919fa6",
});

      setMessage("Complaint created successfully.");

      setTitle("");
      setDescription("");
      setPriority(2);

      await loadComplaints();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPriorityLabel = (value) => {
    switch (value) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      case 4:
        return "Critical";
      default:
        return "Unknown";
    }
  };

  const getStatusLabel = (value) => {
    switch (value) {
      case 1:
        return "Open";
      case 2:
        return "Assigned";
      case 3:
        return "In Progress";
      case 4:
        return "Resolved";
      case 5:
        return "Closed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="module-page">

      <div className="module-header">
        <div>
          <Link to="/dashboard" className="back-link">
            ← Dashboard
          </Link>

          <h1>Complaints</h1>

          <p>
            Report and track issues in your society.
          </p>
        </div>
      </div>

      <div className="complaint-layout">

        {/* CREATE COMPLAINT */}

        <div className="module-card">

          <h2>Create Complaint</h2>

          <form onSubmit={handleSubmit}>

            <label>
              Title
            </label>

            <input
              type="text"
              placeholder="e.g. Water leakage in bathroom"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>
              Description
            </label>

            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows="5"
              required
            />

            <label>
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
              <option value={4}>Critical</option>
            </select>

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Complaint"}
            </button>

          </form>

        </div>

        {/* MY COMPLAINTS */}

        <div className="module-card">

          <div className="card-title-row">
            <h2>My Complaints</h2>

            <span className="count-badge">
              {complaints.length}
            </span>
          </div>

          {loadingComplaints ? (
            <p>Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <p>No complaints found.</p>
            </div>
          ) : (
            <div className="complaint-list">

              {complaints.map((complaint) => (

                <div
                  className="complaint-item"
                  key={complaint.id}
                >

                  <div className="complaint-top">

                    <h3>
                      {complaint.title}
                    </h3>

                    <span
                      className={`status status-${complaint.status}`}
                    >
                      {getStatusLabel(
                        complaint.status
                      )}
                    </span>

                  </div>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  <div className="complaint-meta">

                    <span>
                      Priority:{" "}
                      <strong>
                        {getPriorityLabel(
                          complaint.priority
                        )}
                      </strong>
                    </span>

                    <span>
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </span>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Complaints;