import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const formatBookingTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-IN", {
    day: "numeric",
    month: "numeric",
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
  },
  {
    id: "addf3960-4187-45bb-897a-4223b9084881",
    name: "Clubhouse",
    description: "Common area for society events.",
  },
  {
    id: "e47a559e-fc92-41a2-a3dc-d3647d3295e8",
    name: "Community Hall",
    description: "Hall available for resident events.",
  },
  {
    id: "f4eec903-5c2c-4159-8dc1-27bb3c6fcddf",
    name: "Swimming Pool",
    description: "Society swimming pool.",
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
        error.response?.data?.message || "Failed to load your bookings."
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

      await api.post(
  "/AmenityBooking",
  null,
  {
    params: {
      amenityId: selectedAmenity,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    },
  }
);

      setMessage("Amenity booked successfully.");

      setStartTime("");
      setEndTime("");

      await loadBookings();
    }  catch (error) {
  console.error("Booking failed:", error);

  console.log("Status:", error.response?.status);
  console.log("Response:", error.response?.data);

  const responseData = error.response?.data;

  setError(
    responseData?.message ||
      responseData?.title ||
      (typeof responseData === "string"
        ? responseData
        : `Booking failed. Status: ${error.response?.status || "Unknown"}`)
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

  return (
    <div className="module-page">
      <div className="module-header">
        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>

        <h1>Amenities & Booking</h1>

        <p>
          Book society amenities and manage your upcoming reservations.
        </p>
      </div>

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
            onClick={() => setSelectedAmenity(amenity.id)}
          >
            <div className="amenity-icon">★</div>

            <h3>{amenity.name}</h3>

            <p>{amenity.description}</p>
          </button>
        ))}
      </div>

      <div className="module-card">
        <div className="card-title-row">
          <h2>Book an Amenity</h2>
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

          <div className="form-group">
            <label>Start Time</label>

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
            <label>End Time</label>

            <input
  type="datetime-local"
  value={endTime}
  onChange={(event) => {
    setEndTime(event.target.value);
    setError("");
  }}
/>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={booking}
          >
            {booking ? "Booking..." : "Book Amenity"}
          </button>
        </form>
      </div>

      <div className="module-card">
        <div className="card-title-row">
          <h2>My Bookings</h2>

          <span className="count-badge">
            {bookings.length}
          </span>
        </div>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any amenity bookings yet.</p>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div
                className="booking-item"
                key={booking.id}
              >
                <div className="booking-main">
                  <div>
                    <h3>
                      {booking.amenityName ||
                        getAmenityName(booking.amenityId)}
                    </h3>

                    <p>
  {formatBookingTime(booking.startTime)} →{" "}
  {formatBookingTime(booking.endTime)}
</p>
                  </div>

                  <span
                    className={`booking-status booking-status-${booking.status}`}
                  >
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                {booking.status === 1 && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      handleCancel(booking.id)
                    }
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Amenities;