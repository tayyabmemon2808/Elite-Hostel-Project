const Complaint = require("../models/Complaint");

const fileComplaint = async (req, res) => {
  try {
    const { student, hostel, title, description } = req.body;
    const newComplaint = new Complaint({ student, hostel, title, description });
    await newComplaint.save();
    res.status(201).json({ message: 'Complaint filed successfully', complaint: newComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('student', 'name email').populate('hostel', 'name city');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getComplaintsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const complaints = await Complaint.find({ hostel: hostelId }).populate('student', 'name email');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getMyComplaints = async (req, res) => {
  try {
    const { studentId } = req.params;
    const complaints = await Complaint.find({ student: studentId })
      .populate('hostel', 'name city');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const {adminReply} = req.body;

    const complaint = await Complaint.findByIdAndUpdate(id, { status: 'resolved', adminReply }, { new: true });
    res.status(200).json({ message: 'Complaint resolved', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

 

};

const rateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentRating } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { studentRating },
      { new: true }
    );
    res.status(200).json({ message: 'Rating submitted', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

 const reopenComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status: 'pending' , studentRating: null },
      { new: true }
    );
    res.status(200).json({ message: 'Complaint reopened', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { fileComplaint, getAllComplaints, getComplaintsByHostel, resolveComplaint ,reopenComplaint, rateComplaint , getMyComplaints };