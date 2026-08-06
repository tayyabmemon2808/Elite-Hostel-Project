import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/Api";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import "./CheckStatus.css";

function CheckStatus() {
  const [referenceId, setReferenceId] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearched(false);

    try {
      const res = await api.get(`/bookings/status/${referenceId.trim()}`);
      setBooking(res.data.booking || res.data);
    } catch (err) {
      setBooking(null);
      setError(
        err.response?.data?.message || "No booking found with this reference ID."
      );
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="status-page">
      <Navbar />

      {loading && <Loader text="Checking booking status..." />}

      <div className="status-container">
        <h2>Check Booking Status</h2>
        <p className="status-subtitle">
          Enter your reference ID to check your booking status
        </p>

        <form onSubmit={handleSubmit} className="status-form">
          <input
            type="text"
            placeholder="e.g. BK-K6JM2UA"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            required
          />
          <button type="submit">Check Status</button>
        </form>

        {error && searched && <div className="status-error">{error}</div>}

        {booking && (
          <div className={`status-card status-${booking.status}`}>
            <div className="status-badge">{booking.status}</div>

            <h3>{booking.name}</h3>

            <div className="status-details">
              <div className="status-row">
                <span>Reference ID</span>
                <strong>{booking.referenceId}</strong>
              </div>
              <div className="status-row">
                <span>Room Type</span>
                <strong>{booking.roomType}</strong>
              </div>
              <div className="status-row">
                <span>Check-in</span>
                <strong>{formatDate(booking.checkInDate)}</strong>
              </div>
              <div className="status-row">
                <span>Check-out</span>
                <strong>{formatDate(booking.checkOutDate)}</strong>
              </div>
              <div className="status-row">
                <span>Total Price</span>
                <strong>Rs. {booking.calculatedPrice}</strong>
              </div>
              <div className="status-row">
                <span>Payment Method</span>
                <strong>{booking.paymentMethod}</strong>
              </div>
            </div>

            {booking.status === "approved" && (
              <Link
                to={`/signup?referenceId=${booking.referenceId}`}
                className="complete-signup-btn"
              >
                Complete Your Signup
              </Link>
            )}

            {booking.status === "pending" && (
              <p className="status-note">
                Your booking is under review. Please check back soon.
              </p>
            )}

            {booking.status === "rejected" && (
              <p className="status-note">
                Unfortunately, this booking request was not approved.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckStatus;