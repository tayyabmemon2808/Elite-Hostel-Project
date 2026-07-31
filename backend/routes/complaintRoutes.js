const express = require("express");
const router = express.Router();
const {fileComplaint,getAllComplaints,getComplaintsByHostel,resolveComplaint,reopenComplaint,rateComplaint} = require("../controllers/complaintControllers")

router.post('/file', fileComplaint);
router.get('/all', getAllComplaints);
router.get('/hostel/:hostelId', getComplaintsByHostel);
router.put('/resolve/:id', resolveComplaint);
router.put("/reopen/:id" , reopenComplaint);
router.put("/rate/:id" , rateComplaint)


module.exports = router;