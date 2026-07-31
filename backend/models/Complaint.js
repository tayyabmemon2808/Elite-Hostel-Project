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
    dafault : ""
  },
  studentRating: {
    type : Number , 
    min : 1,
    max: 5, 
    dafault: null
  }


}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);