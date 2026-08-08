const User = require('../models/User');
const Hostel = require("../models/Hostel")
const BookingRequest = require("../models/BookingRequest");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const signup = async (req, res) => {
  try {
    const { role, password } = req.body;

    if (role === 'superadmin' || role === 'subadmin') {
      const { name, email, hostel , phone } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name, email, password: hashedPassword, role, phone,
        hostel: role === 'superadmin' ? null : hostel
      });

   
if (role === "subadmin" && hostel) {
  const existingHostel = await Hostel.findById(hostel);

  if (!existingHostel) {
    return res.status(404).json({
      message: "Hostel not found",
    });
  }

  if (existingHostel.subAdmin) {
    return res.status(400).json({
      message: "This hostel already has a sub-admin assigned.",
    });
  }
}

      await newUser.save();

   
      if (role === "subadmin" && hostel) {
  await Hostel.findByIdAndUpdate(hostel, {
    subAdmin: newUser._id,
  }); 
}
      return res.status(201).json({ message: 'User created successfully' });
    }

    const { referenceId } = req.body;
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
      phone: booking.phone,
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

    const token = jwt.sign(
      { id: user._id, role: user.role, hostel: user.hostel },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel: user.hostel,
          phone: user.phone,
          profileImage: user.profileImage
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

const getAllSubadmins = async (req,res) => {
  try{
    const subadmins = await User.find({role : "subadmin"}).select("-password");
    res.status(200).json(subadmins)
  }
  catch(error){
    res.status(500).json({
      message : "server error" ,
      error: error.message
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const updateData = { name, email };

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, updateData, { new: true }
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
      id, { hostel: hostelId }, { new: true }
    ).select('-password').populate('hostel', 'name city');

    res.status(200).json({ message: 'Hostel assigned successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: imageUrl },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Photo updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signup, login, getAllStudents, updateProfile, assignHostel,getAllSubadmins ,uploadProfilePhoto};