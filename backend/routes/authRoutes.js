const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    getAllStudents,
    updateProfile,
    assignHostel,
    getAllSubadmins
} = require("../controllers/authControllers");
const validateSignup = require("../middleware/ValidateSignup");

router.post("/signup", validateSignup, signup);
router.post("/login", login);
router.get("/students", getAllStudents);
router.put("/update/:id", updateProfile);
router.put("/assign-hostel/:id", assignHostel);
router.get("/subadmins", getAllSubadmins)
module.exports = router;
