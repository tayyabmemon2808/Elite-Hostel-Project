const express = require('express');
const router = express.Router();
const { createStayEntry, checkoutStay, getMyStayHistory } = require('../controllers/stayHistoryController');

router.post('/create', createStayEntry);
router.put('/checkout/:id', checkoutStay);
router.get('/my-history/:studentId', getMyStayHistory);

module.exports = router;