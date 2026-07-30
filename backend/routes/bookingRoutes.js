const express = require('express');
const router = express.Router();
const { createBooking, checkBookingStatus, getBookingsByHostel, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/status/:referenceId', checkBookingStatus);
router.get('/hostel/:hostelId', getBookingsByHostel);
router.get('/all', getAllBookings);
router.put('/update-status/:id', updateBookingStatus);

module.exports = router;