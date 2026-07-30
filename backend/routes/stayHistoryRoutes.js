const express = require('express');
const router = express.Router();
const { checkoutStay, getMyStayHistory } = require('../controllers/stayHistoryControllers');

router.put('/checkout/:id', checkoutStay);
router.get('/my-history/:studentId', getMyStayHistory);

module.exports = router;