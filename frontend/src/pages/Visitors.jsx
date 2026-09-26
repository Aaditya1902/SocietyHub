import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

const FLAT_ID = "99c8aa82-6ddb-4ead-b9b5-29de4c919fa6";

function Visitors() {
  const [visitorName, setVisitorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expectedArrival, setExpectedArrival] = useState("");

  const [visitors, setVisitors] = useState([]);
  const [loadingVisitors, setLoadingVisitors] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatingQr, setGeneratingQr] = useState(null);

  const loadVisitors = async () => {
    try {
      setLoadingVisitors(true);

      const response = await api.get("/Visitor/my");

      setVisitors(response.data);
    } catch (error) {
      console.error("Failed to load visitors:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load visitor requests."
      );
    } finally {
      setLoadingVisitors(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const createVisitor = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!visitorName || !phoneNumber || !expectedArrival) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/Visitor", {
        visitorName,
        phoneNumber,
        flatId: FLAT_ID,
        expectedArrival: new Date(
          expectedArrival
        ).toISOString(),
      });

      setMessage("Visitor request created successfully.");

      setVisitorName("");
      setPhoneNumber("");
      setExpectedArrival("");

      await loadVisitors();
    } catch (error) {
      console.error("Visitor creation failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create visitor request."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateVisitorApproval = async (visitorId, approved) => {
    setMessage("");
    setError("");

    try {
      await api.put(`/Visitor/${visitorId}/approval`, {
        approved,
      });

      setMessage(
        approved
          ? "Visitor approved successfully."
          : "Visitor rejected successfully."
      );

      await loadVisitors();
    } catch (error) {
      console.error("Visitor approval failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update visitor status."
      );
    }
  };

  const generateQrCode = async (visitorId) => {
    setMessage("");
    setError("");

    try {
      setGeneratingQr(visitorId);

      await api.post(`/Visitor/${visitorId}/qr`);

      setMessage("QR code generated successfully.");

      await loadVisitors();
    } catch (error) {
      console.error("QR generation failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to generate QR code."
      );
    } finally {
      setGeneratingQr(null);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Approved";
      case 3:
        return "Rejected";
      case 4:
        return "Entered";
      case 5:
        return "Exited";
      default:
        return "Unknown";
    }
  };

  const pendingCount = visitors.filter(
    (visitor) => visitor.status === 1
  ).length;

  const approvedCount = visitors.filter(
    (visitor) => visitor.status === 2
  ).length;

  const completedCount = visitors.filter(
    (visitor) =>
      visitor.status === 4 ||
      visitor.status === 5
  ).length;

  return (
    <div className="module-page visitors-page">

      {/* Header */}
      <div className="module-header visitors-header">

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

        <div className="visitors-header-content">

          <div>
            <p className="module-eyebrow">
              SOCIETY ACCESS
            </p>

            <h1>Visitor Management</h1>

            <p className="module-description">
              Manage guest requests, approvals and secure
              visitor passes from one place.
            </p>
          </div>

          <div className="visitor-header-icon">
            👥
          </div>

        </div>

      </div>

      {/* Messages */}
      {message && (
        <div className="success-message visitors-message">
          <span>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div className="error-message visitors-message">
          <span>!</span>
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="visitor-stats">

        <div className="visitor-stat-card">
          <div className="visitor-stat-icon blue">
            👥
          </div>

          <div>
            <span>Total Visitors</span>
            <strong>{visitors.length}</strong>
          </div>
        </div>

        <div className="visitor-stat-card">
          <div className="visitor-stat-icon orange">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="visitor-stat-card">
          <div className="visitor-stat-icon green">
            ✓
          </div>

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="visitor-stat-card">
          <div className="visitor-stat-icon purple">
            ↗
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
        </div>

      </div>

      {/* Create Visitor */}
      <div className="module-card visitor-create-card">

        <div className="visitor-card-heading">

          <div className="visitor-section-icon blue">
            +
          </div>

          <div>
            <h2>Add a visitor</h2>

            <p>
              Create a visitor request before your guest
              arrives.
            </p>
          </div>

        </div>

        <form
          onSubmit={createVisitor}
          className="visitor-form"
        >

          <div className="visitor-form-field">

            <label htmlFor="visitorName">
              Visitor name
            </label>

            <input
              id="visitorName"
              type="text"
              value={visitorName}
              onChange={(event) =>
                setVisitorName(event.target.value)
              }
              placeholder="e.g. Rahul Sharma"
            />

          </div>

          <div className="visitor-form-field">

            <label htmlFor="phoneNumber">
              Phone number
            </label>

            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(event.target.value)
              }
              placeholder="e.g. 9876543210"
            />

          </div>

          <div className="visitor-form-field">

            <label htmlFor="expectedArrival">
              Expected arrival
            </label>

            <input
              id="expectedArrival"
              type="datetime-local"
              value={expectedArrival}
              onChange={(event) =>
                setExpectedArrival(event.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="visitor-create-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Creating...
              </>
            ) : (
              <>
                Create request
                <span>→</span>
              </>
            )}
          </button>

        </form>

      </div>

      {/* Visitor Requests */}
      <div className="module-card visitor-requests-card">

        <div className="visitor-requests-header">

          <div>
            <p className="module-eyebrow">
              GUEST ACTIVITY
            </p>

            <h2>Visitor requests</h2>

            <p>
              Review and manage your guest access requests.
            </p>
          </div>

          <span className="count-badge">
            {visitors.length}
          </span>

        </div>

        {loadingVisitors ? (

          <div className="visitor-loading">
            <span className="button-spinner"></span>
            <p>Loading visitor requests...</p>
          </div>

        ) : visitors.length === 0 ? (

          <div className="visitor-empty">

            <div className="visitor-empty-icon">
              👥
            </div>

            <h3>No visitors yet</h3>

            <p>
              Create your first visitor request using
              the form above.
            </p>

          </div>

        ) : (

          <div className="visitor-list">

            {visitors.map((visitor) => (

              <div
                className="visitor-item"
                key={visitor.id}
              >

                <div className="visitor-main">

                  <div className="visitor-avatar">
                    {visitor.visitorName
                      ?.charAt(0)
                      ?.toUpperCase() || "V"}
                  </div>

                  <div className="visitor-details">

                    <div className="visitor-name-row">

                      <h3>
                        {visitor.visitorName}
                      </h3>

                      <span
                        className={`visitor-status visitor-status-${visitor.status}`}
                      >
                        {getStatusLabel(
                          visitor.status
                        )}
                      </span>

                    </div>

                    <p>
                      <span>📞</span>
                      {visitor.phoneNumber}
                    </p>

                    <p>
                      <span>🕐</span>
                      Expected{" "}
                      {new Date(
                        visitor.expectedArrival
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                <div className="visitor-actions">

                  {visitor.status === 1 && (
                    <div className="visitor-buttons">

                      <button
                        className="approve-button"
                        onClick={() =>
                          updateVisitorApproval(
                            visitor.id,
                            true
                          )
                        }
                      >
                        ✓ Approve
                      </button>

                      <button
                        className="reject-button"
                        onClick={() =>
                          updateVisitorApproval(
                            visitor.id,
                            false
                          )
                        }
                      >
                        Reject
                      </button>

                    </div>
                  )}

                  {visitor.status === 2 &&
                    !visitor.qrCode && (
                      <button
                        className="qr-button"
                        onClick={() =>
                          generateQrCode(
                            visitor.id
                          )
                        }
                        disabled={
                          generatingQr ===
                          visitor.id
                        }
                      >
                        {generatingQr ===
                        visitor.id
                          ? "Generating..."
                          : "Generate QR Pass"}
                      </button>
                    )}

                </div>

                {/* QR Pass */}
                {visitor.qrCode && (
                  <div className="visitor-qr-pass">

                    <div className="qr-pass-header">

                      <div>
                        <p className="module-eyebrow">
                          SECURE ACCESS
                        </p>

                        <h4>
                          Visitor QR Pass
                        </h4>

                        <p>
                          Show this QR code at the
                          society entrance.
                        </p>
                      </div>

                      <span className="qr-active-badge">
                        Active
                      </span>

                    </div>

                    <div className="qr-pass-content">

                      <div className="qr-image-wrapper">
                        <QRCodeCanvas
                          value={visitor.qrCode}
                          size={180}
                        />
                      </div>

                      <div className="qr-pass-info">

                        <span>
                          VISITOR
                        </span>

                        <strong>
                          {visitor.visitorName}
                        </strong>

                        <span>
                          EXPECTED ARRIVAL
                        </span>

                        <strong>
                          {new Date(
                            visitor.expectedArrival
                          ).toLocaleString()}
                        </strong>

                        <small>
                          Secure visitor token
                        </small>

                      </div>

                    </div>

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

export default Visitors;