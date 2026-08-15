import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/Api";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import "./BookingForm.css";

function BookingForm() {
  const { hostelId } = useParams();

  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    university: "",
    hostel: hostelId || "",
    roomType: "single",
    checkInDate: "",
    checkOutDate: "",
    paymentMethod: "jazzcash",
    paymentReference: "",
  });

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hostels/all");
      setHostels(res.data);

      if (hostelId) {
        const found = res.data.find((h) => h._id === hostelId);
        setSelectedHostel(found || null);
      }
    } catch (err) {
      console.error("Failed to fetch hostels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, [hostelId]);

  const handleHostelChange = (e) => {
    const id = e.target.value;
    setFormData({ ...formData, hostel: id });
    const found = hostels.find((h) => h._id === id);
    setSelectedHostel(found || null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);

      setFormData({
        ...formData,
        phone: digitsOnly,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateEstimatedPrice = () => {
    if (!selectedHostel || !formData.checkInDate || !formData.checkOutDate) {
      return null;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);

    if (checkOut <= checkIn) return null;

    let months =
      (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
      (checkOut.getMonth() - checkIn.getMonth());

    if (checkOut.getDate() > checkIn.getDate()) {
      months += 1;
    }
    if (months < 1) {
      months = 1;
    }
    const rate =
      formData.roomType === "single"
        ? selectedHostel.singleRoomPrice
        : selectedHostel.sharedRoomPrice;

    return months * rate;
  };

  const estimatedPrice = calculateEstimatedPrice();

  const getDateError = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return "";
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    if (checkOut <= checkIn) {
      return "Check-out date must be after check-in date.";
    }
    return "";
  };

  const dateError = getDateError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (dateError) {
      setError(dateError);
      return;
    }

    setSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        phone: `+92${formData.phone}`,
      };
      const res = await api.post("/bookings/create", dataToSend);
      setBookingResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const today = new Date();

  const minDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  if (bookingResult) {
    return (
      <div className="booking-page">
        <Navbar />
        <div className="booking-success">
          <h2>Booking Submitted!</h2>
          <p>
            Please save your reference ID — you'll need it to check your booking
            status.
          </p>
          <div className="reference-box">{bookingResult.referenceId}</div>
          <p className="success-price">
            Estimated Total: Rs. {bookingResult.booking.calculatedPrice}
          </p>
          <Link to="/check-status" className="check-status-link">
            Check Booking Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Navbar />

      {loading && <Loader text="Loading hostels..." />}
      {submitting && <Loader text="Submitting your booking..." />}

      <div className="booking-container">
        <h2>Book Your Stay</h2>
        <p className="booking-subtitle">
          Fill in your details to reserve a room
        </p>

        {error && <div className="booking-error">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <div className="phone-input">
                <span className="country-code">+92</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="3001234567"
                  maxLength="10"
                  pattern="3[0-9]{9}"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Hostel</label>
            {hostelId ? (
              <input
                type="text"
                value={selectedHostel?.name || "Loading..."}
                disabled
              />
            ) : (
              <select
                name="hostel"
                value={formData.hostel}
                onChange={handleHostelChange}
                required
              >
                <option value="">-- Select a Hostel --</option>
                {hostels.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name} — {h.city}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Room Type</label>
            <div className="room-type-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="roomType"
                  value="single"
                  checked={formData.roomType === "single"}
                  onChange={handleChange}
                />
                Single
                {selectedHostel &&
                  ` — Rs. ${selectedHostel.singleRoomPrice}/month`}
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="roomType"
                  value="shared"
                  checked={formData.roomType === "shared"}
                  onChange={handleChange}
                />
                Shared
                {selectedHostel &&
                  ` — Rs. ${selectedHostel.sharedRoomPrice}/month`}
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                min={minDate}
                required
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                min={formData.checkInDate || undefined}
                required
              />
            </div>
            {dateError && <p className="field-error">{dateError}</p>}
          </div>

          {estimatedPrice && (
            <div className="estimated-price-box">
              Estimated Total: <strong>Rs. {estimatedPrice}</strong>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="jazzcash">JazzCash</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payment Reference</label>
              <input
                type="text"
                name="paymentReference"
                value={formData.paymentReference}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={dateError !== ""}
          >
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
