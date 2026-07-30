const StayHistory = require('../models/StayHistory');
const Room = require('../models/Room');

const checkoutStay = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEntry = await StayHistory.findByIdAndUpdate(
      id,
      { checkOutDate: new Date(), status: 'completed' },
      { new: true }
    );

    const stay = await StayHistory.findById(id);
    const room = await Room.findById(stay.room);
    room.studentsAllotted = room.studentsAllotted.filter(s => s.toString() !== stay.student.toString());
    room.status = 'available';
    await room.save();

    res.status(200).json({ message: 'Checked out successfully', entry: updatedEntry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyStayHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const history = await StayHistory.find({ student: studentId })
      .populate('room', 'roomNumber')
      .populate('hostel', 'name city')
      .populate('roommatesAtThatTime', 'name')
      .sort({ checkInDate: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { checkoutStay, getMyStayHistory };