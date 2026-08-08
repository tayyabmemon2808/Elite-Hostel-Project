const express = require('express');
const router = express.Router();
const { checkoutStay, getMyStayHistory } = require('../controllers/stayHistoryControllers');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-history/:studentId', protect, getMyStayHistory);
router.put('/checkout/:id', protect, authorize('superadmin', 'subadmin'), checkoutStay);

module.exports = router;