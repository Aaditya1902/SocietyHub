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
        flatId:
          "99c8aa82-6ddb-4ead-b9b5-29de4c919fa6",
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

  const openCount = complaints.filter(
    (complaint) => complaint.status === 1
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status === 2 ||
      complaint.status === 3
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === 4 ||
      complaint.status === 5
  ).length;

  const criticalCount = complaints.filter(
    (complaint) => complaint.priority === 4
  ).length;

  return (
    <div className="module-page complaints-page">

      {/* HEADER */}
      <div className="module-header">

        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>

        <div className="complaints-header-content">

          <div>
            <p className="module-eyebrow">
              SOCIETY SERVICES
            </p>

            <h1>Complaints</h1>

            <p className="module-description">
              Report issues, track their progress and stay
              updated on society services.
            </p>
          </div>

          <div className="complaint-header-icon">
            ✓
          </div>

        </div>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="success-message complaints-message">
          <span>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div className="error-message complaints-message">
          <span>!</span>
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="complaint-stats">

        <div className="complaint-stat-card">

          <div className="complaint-stat-icon blue">
            #
          </div>

          <div>
            <span>Total Complaints</span>
            <strong>{complaints.length}</strong>
          </div>

        </div>

        <div className="complaint-stat-card">

          <div className="complaint-stat-icon orange">
            !
          </div>

          <div>
            <span>Open</span>
            <strong>{openCount}</strong>
          </div>

        </div>

        <div className="complaint-stat-card">

          <div className="complaint-stat-icon purple">
            ↻
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressCount}</strong>
          </div>

        </div>

        <div className="complaint-stat-card">

          <div className="complaint-stat-icon green">
            ✓
          </div>

          <div>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="complaint-layout">

        {/* CREATE */}
        <div className="module-card complaint-create-card">

          <div className="complaint-section-heading">

            <div className="complaint-section-icon blue">
              +
            </div>

            <div>
              <h2>Report an issue</h2>

              <p>
                Tell us what needs attention in your
                society.
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="complaint-form"
          >

            <div className="complaint-field">

              <label htmlFor="complaint-title">
                Complaint title
              </label>

              <input
                id="complaint-title"
                type="text"
                placeholder="e.g. Water leakage in bathroom"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

            </div>

            <div className="complaint-field">

              <label htmlFor="complaint-description">
                Description
              </label>

              <textarea
                id="complaint-description"
                placeholder="Describe the issue and where it occurred..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                required
              />

            </div>

            <div className="complaint-field">

              <label htmlFor="complaint-priority">
                Priority
              </label>

              <select
                id="complaint-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
                <option value={4}>
                  Critical
                </option>
              </select>

            </div>

            <button
              type="submit"
              className="complaint-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit complaint
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          {criticalCount > 0 && (
            <div className="complaint-tip">
              <span>!</span>
              You currently have {criticalCount} critical
              complaint
              {criticalCount > 1 ? "s" : ""}.
            </div>
          )}

        </div>

        {/* LIST */}
        <div className="module-card complaint-list-card">

          <div className="complaint-list-header">

            <div>
              <p className="module-eyebrow">
                ISSUE TRACKING
              </p>

              <h2>My complaints</h2>

              <p>
                Track the status of issues you have
                reported.
              </p>
            </div>

            <span className="count-badge">
              {complaints.length}
            </span>

          </div>

          {loadingComplaints ? (

            <div className="complaint-loading">
              <span className="button-spinner"></span>
              <p>Loading complaints...</p>
            </div>

          ) : complaints.length === 0 ? (

            <div className="complaint-empty">

              <div className="complaint-empty-icon">
                ✓
              </div>

              <h3>No complaints yet</h3>

              <p>
                If something needs attention, report it
                using the form.
              </p>

            </div>

          ) : (

            <div className="complaint-list">

              {complaints.map((complaint) => (

                <div
                  className="complaint-item"
                  key={complaint.id}
                >

                  <div className="complaint-item-icon">
                    !
                  </div>

                  <div className="complaint-content">

                    <div className="complaint-top">

                      <div>
                        <h3>
                          {complaint.title}
                        </h3>

                        <span className="complaint-date">
                          {new Date(
                            complaint.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

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
                        Priority
                      </span>

                      <span
                        className={`priority priority-${complaint.priority}`}
                      >
                        {getPriorityLabel(
                          complaint.priority
                        )}
                      </span>

                    </div>

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