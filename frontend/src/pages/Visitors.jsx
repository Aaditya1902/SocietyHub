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

  // Load current user's visitors
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

  // Load visitors when page opens
  useEffect(() => {
    loadVisitors();
  }, []);

  // Create visitor
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
        expectedArrival: new Date(expectedArrival).toISOString(),
      });

      setMessage("Visitor request created successfully.");

      setVisitorName("");
      setPhoneNumber("");
      setExpectedArrival("");

      // Refresh visitor list
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

  return (
    <div className="module-page">

      {/* Header */}
      <div className="module-header">
        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>

        <h1>Visitor Management</h1>

        <p>
          Create visitor requests and manage visitor approvals.
        </p>
      </div>

      {/* Messages */}
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

      {/* Add Visitor */}
      <div className="module-card">

        <div className="card-title-row">
          <div>
            <h2>Add Visitor</h2>
            <p>
              Create a visitor request for your flat.
            </p>
          </div>
        </div>

        <form onSubmit={createVisitor} className="module-form">

          <div className="form-group">
            <label>Visitor Name</label>

            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Enter visitor name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Expected Arrival</label>

            <input
              type="datetime-local"
              value={expectedArrival}
              onChange={(e) =>
                setExpectedArrival(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Visitor Request"}
          </button>

        </form>
      </div>

      {/* My Visitors */}
      <div className="module-card">

        <div className="card-title-row">
          <h2>My Visitor Requests</h2>

          <span className="count-badge">
            {visitors.length}
          </span>
        </div>

        {loadingVisitors ? (
          <p>Loading visitors...</p>
        ) : visitors.length === 0 ? (
          <div className="empty-state">
            <p>No visitor requests yet.</p>
          </div>
        ) : (
          <div className="visitor-list">

            {visitors.map((visitor) => (
              <div
                className="visitor-item"
                key={visitor.id}
              >

                <div>
                  <h3>{visitor.visitorName}</h3>

                  <p>
                    📞 {visitor.phoneNumber}
                  </p>

                  <p>
                    Expected:{" "}
                    {new Date(
                      visitor.expectedArrival
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="visitor-actions">

  <span
    className={`visitor-status visitor-status-${visitor.status}`}
  >
    {getStatusLabel(visitor.status)}
  </span>

  {visitor.status === 1 && (
    <div className="visitor-buttons">

      <button
        className="approve-button"
        onClick={() =>
          updateVisitorApproval(visitor.id, true)
        }
      >
        Approve
      </button>

      <button
        className="reject-button"
        onClick={() =>
          updateVisitorApproval(visitor.id, false)
        }
      >
        Reject
      </button>

    </div>
  )}

  {visitor.status === 2 && !visitor.qrCode && (
    <button
      className="qr-button"
      onClick={() => generateQrCode(visitor.id)}
      disabled={generatingQr === visitor.id}
    >
      {generatingQr === visitor.id
        ? "Generating..."
        : "Generate QR"}
    </button>
  )}

  {visitor.qrCode && (
    <div className="qr-token">
  <strong>Visitor QR Pass</strong>

  <QRCodeCanvas
    value={visitor.qrCode}
    size={160}
  />

  <code>{visitor.qrCode}</code>
</div>
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

export default Visitors;