const express = require('express');
const router = express.Router();
const { createPayment, getRevenueReport } = require('../controllers/paymentController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, createPayment);
router.get('/revenue-report', auth, authorize('admin'), getRevenueReport);

module.exports = router;
