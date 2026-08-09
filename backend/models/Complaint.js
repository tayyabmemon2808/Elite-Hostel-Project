const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Hostel" ,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  },
  adminReply: {
    type : String,
    default : ""
  },
  studentRating: {
    type : Number , 
    min : 1,
    max: 5, 
    default: null
  }


}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);