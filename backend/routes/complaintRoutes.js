const express = require('express');
const router = express.Router();
const { fileComplaint, getAllComplaints, getComplaintsByBlock, resolveComplaint } = require('../controllers/complaintController');

router.post('/file', fileComplaint);
router.get('/all', getAllComplaints);
router.get('/block/:block', getComplaintsByBlock);
router.put('/resolve/:id', resolveComplaint);

module.exports = router;