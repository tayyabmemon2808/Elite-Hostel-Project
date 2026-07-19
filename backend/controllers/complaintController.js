const Complaint = require('../models/Complaint');
const fileComplaint = async (req, res) => {
  try {
    const { student, block, title, description } = req.body;

    const newComplaint = new Complaint({ student, block, title, description });
    await newComplaint.save();

    res.status(201).json({ message: 'Complaint filed successfully', complaint: newComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('student', 'name email');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getComplaintsByBlock = async (req, res) => {
  try {
    const { block } = req.params;
    const complaints = await Complaint.find({ block }).populate('student', 'name email');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });
    res.status(200).json({ message: 'Complaint resolved', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { fileComplaint, getAllComplaints, getComplaintsByBlock, resolveComplaint };