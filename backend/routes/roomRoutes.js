const express = require('express');
const router = express.Router();
const { addRoom, getAllRooms, getRoomsByBlock, allotRoom, deleteRoom ,getMyRoom,updateRoom } = require('../controllers/roomController');

router.post('/add', addRoom);
router.get('/all', getAllRooms);
router.get('/block/:block', getRoomsByBlock);
router.post('/allot', allotRoom);
router.delete('/:id', deleteRoom);
router.get('/my-room/:studentId', getMyRoom);
router.put('/update/:id', updateRoom);

module.exports = router;