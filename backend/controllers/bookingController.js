const BookingRequest = require('../models/BookingRequest');
const Hostel = require('../models/Hostel');
const createBooking = async (req, res) => {
  try {
    const { name, email, phone, city, university, hostel, roomType, checkInDate, checkOutDate, paymentMethod, paymentReference } = req.body;

    const hostelData = await Hostel.findById(hostel);
    if (!hostelData) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    const calculatedPrice = roomType === 'single' ? hostelData.singleRoomPrice : hostelData.sharedRoomPrice;

    const referenceId = 'BK-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const newBooking = new BookingRequest({
      name, email, phone, city, university, hostel, roomType,
      checkInDate, checkOutDate, calculatedPrice, paymentMethod, paymentReference,
      referenceId
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking request submitted', referenceId, booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const checkBookingStatus = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const booking = await BookingRequest.findOne({ referenceId }).populate('hostel', 'name city');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getBookingsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const bookings = await BookingRequest.find({ hostel: hostelId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingRequest.find().populate('hostel', 'name city').sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await BookingRequest.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({ message: `Booking ${status}`, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  checkBookingStatus,
  getBookingsByHostel,
  getAllBookings,
  updateBookingStatus
};