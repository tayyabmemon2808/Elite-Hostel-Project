const express = require('express');
const router = express.Router();
const {
  addRoom, getAllRooms, getRoomsByHostel, allotRoom, deleteRoom, updateRoom, getMyRoom
} = require("../controllers/roomControllers");
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-room/:studentId', protect, getMyRoom);
router.get('/all', protect, authorize('superadmin'), getAllRooms);
router.get('/hostel/:hostelId', protect, authorize('superadmin', 'subadmin'), getRoomsByHostel);
router.post('/add', protect, authorize('superadmin', 'subadmin'), addRoom);
router.post('/allot', protect, authorize('superadmin', 'subadmin'), allotRoom);
router.put('/update/:id', protect, authorize('superadmin', 'subadmin'), updateRoom);
router.delete('/:id', protect, authorize('superadmin', 'subadmin'), deleteRoom);

module.exports = router;