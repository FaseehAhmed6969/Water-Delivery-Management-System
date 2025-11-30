const express = require('express');
const router = express.Router();
const checkOrderingStatus = require('../middleware/checkOrderingStatus');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus
} = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
// @note    Checks if ordering is paused before allowing order creation
router.post('/', [auth, authorize('customer'), checkOrderingStatus], createOrder);

// @route   GET /api/orders/my-orders
// @desc    Get customer's order history
// @access  Private (Customer)
router.get('/my-orders', auth, authorize('customer'), getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID with tracking
// @access  Private
router.get('/:id', auth, getOrderById);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private (Customer)
router.put('/:id/cancel', auth, authorize('customer'), cancelOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin/Worker)
router.put('/:id/status', auth, authorize('admin', 'worker'), updateOrderStatus);

module.exports = router;
