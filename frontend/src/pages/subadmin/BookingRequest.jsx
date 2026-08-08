import { useState, useEffect } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";

function BookingRequests() {
  const user = getUser();
  const hostelId = user.hostel?._id || user.hostel;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/hostel/${hostelId}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/update-status/${id}`, { status });
      await fetchBookings();
    } catch (err) {
      console.error("Failed to update booking status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <Loader text="Loading booking requests..." />;

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const otherBookings = bookings.filter((b) => b.status !== "pending");

  return (
    <div>
      {actionLoading && <Loader text="Updating booking..." />}

      <h3 className="tab-heading">Booking Requests</h3>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No booking requests yet.</p>
        </div>
      ) : (
        <>
          {pendingBookings.length > 0 && (
            <div className="booking-group">
              <h4 className="group-title">Pending ({pendingBookings.length})</h4>
              <div className="booking-list">
                {pendingBookings.map((b) => (
                 <div className="booking-card" key={b._id}>
  <div className="booking-card-top">
    <div>
      <h4>{b.name}</h4>
      <p className="booking-ref">{b.referenceId}</p>
    </div>
    <span className="status-tag status-pending">pending</span>
  </div>

  <div className="payment-info-box">
    <span className="payment-label">Payment via {b.paymentMethod}</span>
    <span className="payment-ref">Ref: {b.paymentReference}</span>
  </div>

  <div className="booking-details-grid">
    <p><span>Email:</span> {b.email}</p>
    <p><span>Phone:</span> {b.phone}</p>
    <p><span>Room Type:</span> {b.roomType}</p>
    <p><span>Price:</span> Rs. {b.calculatedPrice}</p>
    <p><span>Check-in:</span> {formatDate(b.checkInDate)}</p>
    <p><span>Check-out:</span> {formatDate(b.checkOutDate)}</p>
  </div>

  <div className="booking-actions">
    <button className="approve-btn" onClick={() => handleStatusUpdate(b._id, "approved")}>
      Approve
    </button>
    <button className="reject-btn" onClick={() => handleStatusUpdate(b._id, "rejected")}>
      Reject
    </button>
  </div>
</div>
                ))}
              </div>
            </div>
          )}

          {otherBookings.length > 0 && (
            <div className="booking-group">
              <h4 className="group-title">Past Requests</h4>
              <div className="booking-list">
                {otherBookings.map((b) => (
                  <div className="booking-card" key={b._id}>
                    <div className="booking-card-top">
                      <div>
                        <h4>{b.name}</h4>
                        <p className="booking-ref">{b.referenceId}</p>
                      </div>
                      <span className={`status-tag status-${b.status}`}>{b.status}</span>
                    </div>
                   <div className="booking-details-grid">
  <p><span>Room Type:</span> {b.roomType}</p>
  <p><span>Price:</span> Rs. {b.calculatedPrice}</p>
  <p><span>Payment Ref:</span> {b.paymentReference}</p>
</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookingRequests;