const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscriptions, cancelSubscription } = require('../controllers/subscriptionController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('customer'), createSubscription);
router.get('/my-subscriptions', auth, authorize('customer'), getMySubscriptions);
router.put('/:id/cancel', auth, authorize('customer'), cancelSubscription);

module.exports = router;
