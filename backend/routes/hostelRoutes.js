const express = require('express');
const router = express.Router();
const {
  addHostel, getAllHostels, getHostelById, updateHostel, deleteHostel, assignSubAdmin, uploadHostelImage
} = require('../controllers/hostelController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require("../middleware/UploadHostel");
const uploadHostelImages = require("../middleware/uploadHostelImages");

router.get('/all', getAllHostels);
router.get('/:id', getHostelById);
router.put("/upload-image/:id", protect, authorize("superadmin"), upload.single("image"), uploadHostelImage);
router.post(
  "/add",
  protect,
  authorize("superadmin"),
  uploadHostelImages.array("images", 10),
  addHostel
);
router.put('/update/:id', protect, authorize('superadmin'), updateHostel);
router.delete('/:id', protect, authorize('superadmin'), deleteHostel);
router.put('/assign-subadmin/:id', protect, authorize('superadmin'), assignSubAdmin);

module.exports = router;