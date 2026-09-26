import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const formatBookingTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const amenities = [
  {
    id: "1d79c6a7-0081-45ff-98fe-465c2c869bf3",
    name: "Gym",
    description: "Fully equipped society gym.",
    icon: "💪",
    color: "blue",
  },
  {
    id: "addf3960-4187-45bb-897a-4223b9084881",
    name: "Clubhouse",
    description: "Common area for society events.",
    icon: "🏠",
    color: "purple",
  },
  {
    id: "e47a559e-fc92-41a2-a3dc-d3647d3295e8",
    name: "Community Hall",
    description: "Hall available for resident events.",
    icon: "🎉",
    color: "orange",
  },
  {
    id: "f4eec903-5c2c-4159-8dc1-27bb3c6fcddf",
    name: "Swimming Pool",
    description: "Society swimming pool.",
    icon: "🏊",
    color: "green",
  },
];

function Amenities() {
  const [selectedAmenity, setSelectedAmenity] = useState(
    amenities[0].id
  );

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/AmenityBooking/my");
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleBooking = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!startTime || !endTime) {
      setError("Please select both start and end time.");
      return;
    }

    const start = Date.parse(startTime);
    const end = Date.parse(endTime);

    if (Number.isNaN(start) || Number.isNaN(end)) {
      setError("Invalid date/time selected.");
      return;
    }

    if (start >= end) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setBooking(true);

      await api.post("/AmenityBooking", null, {
        params: {
          amenityId: selectedAmenity,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        },
      });

      setMessage("Amenity booked successfully.");
      setStartTime("");
      setEndTime("");

      await loadBookings();
    } catch (error) {
      console.error("Booking failed:", error);

      const responseData = error.response?.data;

      setError(
        responseData?.message ||
          responseData?.title ||
          (typeof responseData === "string"
            ? responseData
            : `Booking failed. Status: ${
                error.response?.status || "Unknown"
              }`)
      );
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      setError("");
      setMessage("");

      await api.put(`/AmenityBooking/${bookingId}/cancel`);

      setMessage("Booking cancelled successfully.");

      await loadBookings();
    } catch (error) {
      console.error("Cancel booking failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to cancel the booking."
      );
    }
  };

  const getAmenityName = (amenityId) => {
    const amenity = amenities.find(
      (item) => item.id === amenityId
    );

    return amenity?.name || "Amenity";
  };

  const getAmenityIcon = (amenityId) => {
    const amenity = amenities.find(
      (item) => item.id === amenityId
    );

    return amenity?.icon || "★";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Confirmed";
      case 2:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === 1
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === 2
  ).length;

  return (
    <div className="module-page amenities-page">

      {/* HEADER */}

      <div className="module-header amenities-header">

        <div>
          <Link to="/dashboard" className="back-link">
            ← Dashboard
          </Link>

          <p className="section-eyebrow">
            SOCIETY FACILITIES
          </p>

          <h1>Amenities & Booking</h1>

          <p>
            Reserve society facilities and manage your upcoming
            reservations in one place.
          </p>
        </div>

        <div className="page-icon page-icon-purple">
          🏊
        </div>

      </div>

      {/* STATS */}

      <div className="amenity-stats">

        <div className="amenity-stat">
          <div className="stat-icon stat-icon-blue">
            ◆
          </div>

          <div>
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </div>
        </div>

        <div className="amenity-stat">
          <div className="stat-icon stat-icon-green">
            ✓
          </div>

          <div>
            <span>Confirmed</span>
            <strong>{confirmedBookings}</strong>
          </div>
        </div>

        <div className="amenity-stat">
          <div className="stat-icon stat-icon-purple">
            ↗
          </div>

          <div>
            <span>Cancelled</span>
            <strong>{cancelledBookings}</strong>
          </div>
        </div>

        <div className="amenity-stat">
          <div className="stat-icon stat-icon-orange">
            ★
          </div>

          <div>
            <span>Facilities</span>
            <strong>{amenities.length}</strong>
          </div>
        </div>

      </div>

      {/* MESSAGES */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          ! {error}
        </div>
      )}

      {/* FACILITIES */}

      <div className="amenities-section">

        <div className="section-heading">

          <div>
            <p className="section-eyebrow">
              AVAILABLE FACILITIES
            </p>

            <h2>Choose a facility</h2>

            <p>
              Select an amenity before choosing your reservation
              time.
            </p>
          </div>

        </div>

        <div className="amenity-grid">

          {amenities.map((amenity) => (

            <button
              key={amenity.id}
              type="button"
              className={`amenity-card ${
                selectedAmenity === amenity.id
                  ? "amenity-card-selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedAmenity(amenity.id)
              }
            >

              <div
                className={`amenity-icon amenity-icon-${amenity.color}`}
              >
                {amenity.icon}
              </div>

              <div className="amenity-card-content">

                <h3>{amenity.name}</h3>

                <p>{amenity.description}</p>

              </div>

              <div className="amenity-select-indicator">
                {selectedAmenity === amenity.id
                  ? "✓"
                  : "→"}
              </div>

            </button>

          ))}

        </div>

      </div>

      {/* BOOKING FORM */}

      <div className="booking-layout">

        <div className="module-card booking-card">

          <div className="card-heading-with-icon">

            <div className="card-heading-icon">
              📅
            </div>

            <div>
              <p className="section-eyebrow">
                RESERVATION
              </p>

              <h2>Book an amenity</h2>

              <p>
                Select your preferred time slot.
              </p>
            </div>

          </div>

          <form
            className="amenity-booking-form"
            onSubmit={handleBooking}
          >

            <div className="form-group">
              <label>Amenity</label>

              <select
                value={selectedAmenity}
                onChange={(event) =>
                  setSelectedAmenity(event.target.value)
                }
              >
                {amenities.map((amenity) => (
                  <option
                    key={amenity.id}
                    value={amenity.id}
                  >
                    {amenity.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-time-grid">

              <div className="form-group">
                <label>Start time</label>

                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value);
                    setError("");
                  }}
                />
              </div>

              <div className="form-group">
                <label>End time</label>

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => {
                    setEndTime(event.target.value);
                    setError("");
                  }}
                />
              </div>

            </div>

            <button
              type="submit"
              className="primary-button booking-submit"
              disabled={booking}
            >
              {booking
                ? "Booking..."
                : "Confirm Booking →"}
            </button>

          </form>

        </div>

        {/* SELECTED AMENITY PREVIEW */}

        <div className="amenity-preview">

          <div className="preview-glow"></div>

          <p className="section-eyebrow">
            SELECTED FACILITY
          </p>

          <div className="preview-icon">
            {getAmenityIcon(selectedAmenity)}
          </div>

          <h2>
            {getAmenityName(selectedAmenity)}
          </h2>

          <p>
            {amenities.find(
              (amenity) =>
                amenity.id === selectedAmenity
            )?.description}
          </p>

          <div className="preview-divider"></div>

          <span>
            Available for resident bookings
          </span>

        </div>

      </div>

      {/* BOOKINGS */}

      <div className="module-card bookings-card">

        <div className="card-title-row">

          <div>
            <p className="section-eyebrow">
              RESERVATION HISTORY
            </p>

            <h2>My bookings</h2>

            <p>
              Review your current and previous amenity
              reservations.
            </p>
          </div>

          <span className="count-badge">
            {bookings.length}
          </span>

        </div>

        {loading ? (

          <div className="loading-state">
            Loading bookings...
          </div>

        ) : bookings.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings yet</h3>
            <p>
              Choose an amenity above to create your first
              reservation.
            </p>
          </div>

        ) : (

          <div className="booking-list">

            {bookings.map((booking) => (

              <div
                className="booking-item"
                key={booking.id}
              >

                <div className="booking-icon">
                  {getAmenityIcon(booking.amenityId)}
                </div>

                <div className="booking-main">

                  <div>

                    <div className="booking-title-row">

                      <h3>
                        {booking.amenityName ||
                          getAmenityName(
                            booking.amenityId
                          )}
                      </h3>

                      <span
                        className={`booking-status booking-status-${booking.status}`}
                      >
                        {getStatusLabel(
                          booking.status
                        )}
                      </span>

                    </div>

                    <p className="booking-time">
                      {formatBookingTime(
                        booking.startTime
                      )}

                      <span>→</span>

                      {formatBookingTime(
                        booking.endTime
                      )}
                    </p>

                  </div>

                  {booking.status === 1 && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() =>
                        handleCancel(booking.id)
                      }
                    >
                      Cancel booking
                    </button>
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

export default Amenities;