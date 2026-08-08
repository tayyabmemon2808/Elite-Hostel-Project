const express = require('express');
const router = express.Router();
const {
  createBooking, checkBookingStatus, getBookingsByHostel, getAllBookings, updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', createBooking);
router.get('/status/:referenceId', checkBookingStatus);

router.get('/hostel/:hostelId', protect, authorize('superadmin', 'subadmin'), getBookingsByHostel);
router.get('/all', protect, authorize('superadmin'), getAllBookings);
router.put('/update-status/:id', protect, authorize('superadmin', 'subadmin'), updateBookingStatus);

module.exports = router;