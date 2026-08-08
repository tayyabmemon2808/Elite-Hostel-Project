const express = require('express');
const router = express.Router();
const {
  fileComplaint, getAllComplaints, getComplaintsByHostel, resolveComplaint, reopenComplaint, rateComplaint , getMyComplaints
} = require('../controllers/complaintControllers');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/file', protect, authorize('student'), fileComplaint);
router.get('/all', protect, authorize('superadmin'), getAllComplaints);
router.get('/hostel/:hostelId', protect, authorize('superadmin', 'subadmin'), getComplaintsByHostel);
router.get('/my-complaints/:studentId', protect ,authorize("student") , getMyComplaints)
router.put('/resolve/:id', protect, authorize('superadmin', 'subadmin'), resolveComplaint);
router.put('/reopen/:id', protect, authorize('student'), reopenComplaint);
router.put('/rate/:id', protect, authorize('student'), rateComplaint);

module.exports = router;