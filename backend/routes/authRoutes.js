const express = require('express');
const router = express.Router();
const {
  signup, login, getAllStudents, getAllSubadmins, updateProfile, assignHostel,uploadProfilePhoto,deleteUser
} = require("../controllers/authControllers");
const validateSignup = require('../middleware/validateSignup');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require("../middleware/UploadHostel");

router.put("/upload-photo/:id", protect, upload.single("profileImage"), uploadProfilePhoto);
router.post('/signup', validateSignup, signup);
router.post('/login', login);

router.get('/students', protect, authorize('superadmin', 'subadmin'), getAllStudents);
router.get('/subadmins', protect, authorize('superadmin'), getAllSubadmins);
router.put('/update/:id', protect, updateProfile);
router.put('/assign-hostel/:id', protect, authorize('superadmin'), assignHostel);
router.delete('/:id', protect, authorize('superadmin'), deleteUser);

module.exports = router;