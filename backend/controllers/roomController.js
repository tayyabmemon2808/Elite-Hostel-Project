const Room = require('../models/Room');
const addRoom = async (req, res) => {
  try {
    const { roomNumber, block, capacity } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const newRoom = new Room({ roomNumber, block, capacity });
    await newRoom.save();

    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('studentsAllotted', 'name email');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getRoomsByBlock = async (req, res) => {
  try {
    const { block } = req.params;
    const rooms = await Room.find({ block }).populate('studentsAllotted', 'name email');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const allotRoom = async (req, res) => {
  try {
    const { roomId, studentId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.studentsAllotted.length >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' });
    }

    room.studentsAllotted.push(studentId);
    if (room.studentsAllotted.length >= room.capacity) {
      room.status = 'full';
    }

    await room.save();
    res.status(200).json({ message: 'Room allotted successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getMyRoom = async (req, res) => {
  try {
    const { studentId } = req.params;
    const room = await Room.findOne({ studentsAllotted: studentId }).populate('studentsAllotted', 'name email');
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber, block, capacity } = req.body;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (capacity < room.studentsAllotted.length) {
      return res.status(400).json({ message: 'Capacity cannot be less than students already allotted' });
    }

    room.roomNumber = roomNumber;
    room.block = block;
    room.capacity = capacity;
    room.status = room.studentsAllotted.length >= capacity ? 'full' : 'available';

    await room.save();
    res.status(200).json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = { addRoom, getAllRooms, getRoomsByBlock, allotRoom, deleteRoom,getMyRoom,updateRoom};