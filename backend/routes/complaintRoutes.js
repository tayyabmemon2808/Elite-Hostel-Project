const express = require('express');
const router = express.Router();
const { fileComplaint, getAllComplaints, getComplaintsByHostel, resolveComplaint } = require('../controllers/complaintController');

router.post('/file', fileComplaint);
router.get('/all', getAllComplaints);
router.get('/hostel/:hostelId', getComplaintsByHostel);
router.put('/resolve/:id', resolveComplaint);

module.exports = router;