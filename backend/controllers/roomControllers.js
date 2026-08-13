const Room = require('../models/Room');
const StayHistory = require('../models/StayHistory');

const addRoom = async (req, res) => {
  try {
    const { roomNumber, hostel, roomType, capacity } = req.body;

    const existingRoom = await Room.findOne({ roomNumber, hostel });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists in this hostel' });
    }

    const newRoom = new Room({ roomNumber, hostel, roomType, capacity });
    await newRoom.save();

    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('studentsAllotted', 'name email').populate('hostel', 'name city');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRoomsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const rooms = await Room.find({ hostel: hostelId }).populate('studentsAllotted', 'name email');
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

    const roommatesAtThatTime = [...room.studentsAllotted];

    room.studentsAllotted.push(studentId);
    if (room.studentsAllotted.length >= room.capacity) {
      room.status = 'full';
    }

    await room.save();

    const newStayEntry = new StayHistory({
      student: studentId,
      room: roomId,
      hostel: room.hostel,
      checkInDate: new Date(),
      roommatesAtThatTime
    });

    await newStayEntry.save();

    res.status(200).json({ message: 'Room allotted successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber, hostel, roomType, capacity } = req.body;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const duplicateRoom = await Room.findOne({
      roomNumber,
      hostel,
      _id: { $ne: id }
    });

    if (duplicateRoom) {
      return res.status(400).json({ message: 'Room number already exists in this hostel' });
    }

    if (capacity < room.studentsAllotted.length) {
      return res.status(400).json({ message: 'Capacity cannot be less than students already allotted' });
    }

    room.roomNumber = roomNumber;
    room.hostel = hostel;
    room.roomType = roomType;
    room.capacity = capacity;
    room.status = room.studentsAllotted.length >= capacity ? 'full' : 'available';

    await room.save();
    res.status(200).json({ message: 'Room updated successfully', room });
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

module.exports = { addRoom, getAllRooms, getRoomsByHostel, allotRoom, deleteRoom, updateRoom, getMyRoom };