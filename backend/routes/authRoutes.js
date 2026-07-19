const express = require('express');
const router = express.Router();
const { signup, login ,getAllStudents,updateProfile} = require('../controllers/authControllers');
const validateSignup = require("../middleware/validateSignup")

router.post('/signup',validateSignup,signup);
router.post('/login', login);
router.get('/students', getAllStudents);
router.put('/update/:id', updateProfile);
module.exports = router;