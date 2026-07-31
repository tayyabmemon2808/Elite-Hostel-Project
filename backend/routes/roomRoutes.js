const express = require('express');
const router = express.Router();
const {
  addRoom, getAllRooms, getRoomsByHostel, allotRoom, deleteRoom, updateRoom, getMyRoom
} = require("../controllers/roomControllers");

router.post('/add', addRoom);
router.get('/all', getAllRooms);
router.get('/hostel/:hostelId', getRoomsByHostel);
router.post('/allot', allotRoom);
router.delete('/:id', deleteRoom);
router.put('/update/:id', updateRoom);
router.get('/my-room/:studentId', getMyRoom);

module.exports = router;