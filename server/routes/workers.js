const express = require('express');
const router = express.Router();
const {
    getMyAssignedOrders,
    getTodayOrders,
    updateOrderStatus,
    getCustomerDetails,
    getWorkerStats
} = require('../controllers/workerController');
const { auth, authorize } = require('../middleware/auth');

// Middleware: All worker routes require authentication and worker role
router.use(auth);
router.use(authorize('worker'));

// @route   GET /api/workers/my-orders
// @desc    Get all assigned orders for worker
// @access  Private (Worker)
router.get('/my-orders', getMyAssignedOrders);

// @route   GET /api/workers/today-orders
// @desc    Get today's assigned orders
// @access  Private (Worker)
router.get('/today-orders', getTodayOrders);

// @route   PUT /api/workers/orders/:id/status
// @desc    Update order status (mark as in-transit or delivered)
// @access  Private (Worker)
router.put('/orders/:id/status', updateOrderStatus);

// @route   GET /api/workers/orders/:id/customer
// @desc    Get customer details for an order
// @access  Private (Worker)
router.get('/orders/:id/customer', getCustomerDetails);

// @route   GET /api/workers/stats
// @desc    Get worker statistics
// @access  Private (Worker)
router.get('/stats', getWorkerStats);

module.exports = router;
