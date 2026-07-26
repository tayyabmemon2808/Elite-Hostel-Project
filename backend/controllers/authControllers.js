const User = require('../models/User');
const bcrypt = require('bcryptjs');
const BookingRequest = require('../models/BookingRequest');
const signup = async (req, res) => {
  try {
    const { referenceId, password, role, hostel } = req.body;

    if (role === 'superadmin' || role === 'subadmin') {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role,
        hostel: role === 'superadmin' ? null : hostel
      });

      await newUser.save();
      return res.status(201).json({ message: 'User created successfully' });
    }

    const booking = await BookingRequest.findOne({ referenceId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking reference not found' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ message: 'Your booking is not approved yet' });
    }

    const existingUser = await User.findOne({ email: booking.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Account already exists for this booking' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: booking.name,
      email: booking.email,
      password: hashedPassword,
      role: 'student',
      hostel: booking.hostel
    });

    await newUser.save();

    res.status(201).json({ message: 'Account created successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        block: user.block
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const assignHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const { hostelId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { hostel: hostelId },
      { new: true }
    ).select('-password').populate('hostel', 'name city');

    res.status(200).json({ message: 'Hostel assigned successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = { signup, login ,getAllStudents,updateProfile, assignHostel};