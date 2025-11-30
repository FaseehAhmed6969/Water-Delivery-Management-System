const Order = require('../models/Order');
const User = require('../models/User');
const PromoCode = require('../models/PromoCode');
const Branch = require('../models/Branch');
const PricingRule = require('../models/PricingRule');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');

// @desc    Get all orders (Story 6)
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter)
      .populate('customerId', 'name email phone')
      .populate('assignedWorker', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Assign order to worker (Story 7)
// @route   PUT /api/admin/orders/:id/assign
// @access  Private (Admin)
exports.assignOrder = async (req, res) => {
  try {
    const { workerId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Verify worker exists and has correct role
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(400).json({ msg: 'Invalid worker' });
    }

    order.assignedWorker = workerId;
    order.status = 'assigned';
    await order.save();

    // Notify customer
    const customerNotification = new Notification({
      userId: order.customerId,
      orderId: order._id,
      type: 'order_assigned',
      title: 'Order Assigned',
      message: `Your order has been assigned to ${worker.name}`
    });
    await customerNotification.save();

    // Notify worker
    const workerNotification = new Notification({
      userId: workerId,
      orderId: order._id,
      type: 'order_assigned',
      title: 'New Order Assigned',
      message: `You have been assigned a new order #${order._id}`
    });
    await workerNotification.save();

    // Emit socket events
    const io = req.app.get('io');
    io.to(order.customerId.toString()).emit('orderAssigned', order);
    io.to(workerId).emit('newOrderAssigned', order);

    res.json({ msg: 'Order assigned successfully', order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Auto-assign orders (Story 26)
// @route   POST /api/admin/orders/auto-assign
// @access  Private (Admin)
exports.autoAssignOrders = async (req, res) => {
  try {
    // Get all pending orders
    const pendingOrders = await Order.find({ status: 'pending' });

    // Get all available workers
    const workers = await User.find({ role: 'worker' });

    if (workers.length === 0) {
      return res.status(400).json({ msg: 'No workers available' });
    }

    // Simple round-robin assignment (can be enhanced with location-based logic)
    let workerIndex = 0;
    const assignedOrders = [];

    for (const order of pendingOrders) {
      order.assignedWorker = workers[workerIndex]._id;
      order.status = 'assigned';
      await order.save();

      assignedOrders.push(order);

      // Notify worker
      const notification = new Notification({
        userId: workers[workerIndex]._id,
        orderId: order._id,
        type: 'order_assigned',
        title: 'New Order Assigned',
        message: `You have been assigned order #${order._id}`
      });
      await notification.save();

      workerIndex = (workerIndex + 1) % workers.length;
    }

    res.json({ 
      msg: 'Orders auto-assigned successfully', 
      count: assignedOrders.length 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete order (Story 9)
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    await order.deleteOne();

    res.json({ msg: 'Order deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get dashboard statistics (Story 14)
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const assignedOrders = await Order.countDocuments({ status: 'assigned' });
    const inTransitOrders = await Order.countDocuments({ status: 'in-transit' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalWorkers = await User.countDocuments({ role: 'worker' });

    // Revenue calculation
    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Average rating
    const ratingData = await Rating.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const averageRating = ratingData.length > 0 ? ratingData[0].avgRating.toFixed(1) : 0;

    res.json({
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        assigned: assignedOrders,
        inTransit: inTransitOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      users: {
        customers: totalCustomers,
        workers: totalWorkers
      },
      revenue: totalRevenue,
      averageRating
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Generate report (Story 15)
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;

    const filter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (reportType === 'orders') {
      const orders = await Order.find(filter)
        .populate('customerId', 'name email')
        .populate('assignedWorker', 'name')
        .select('_id customerId items status totalPrice deliveryAddress createdAt deliveredAt');

      res.json({ data: orders, type: 'orders' });
    } else if (reportType === 'revenue') {
      const revenueData = await Order.aggregate([
        { $match: { ...filter, status: 'delivered' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalRevenue: { $sum: '$totalPrice' },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.json({ data: revenueData, type: 'revenue' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Worker performance analytics (Story 28)
// @route   GET /api/admin/worker-performance
// @access  Private (Admin)
exports.getWorkerPerformance = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('name email phone');

    const performance = await Promise.all(
      workers.map(async (worker) => {
        const totalOrders = await Order.countDocuments({ 
          assignedWorker: worker._id 
        });

        const deliveredOrders = await Order.countDocuments({
          assignedWorker: worker._id,
          status: 'delivered'
        });

        // Calculate on-time deliveries (within 2 hours)
        const orders = await Order.find({
          assignedWorker: worker._id,
          status: 'delivered'
        });

        let onTimeCount = 0;
        orders.forEach(order => {
          const timeDiff = (order.deliveredAt - order.createdAt) / (1000 * 60 * 60); // hours
          if (timeDiff <= 2) onTimeCount++;
        });

        // Get average rating
        const ratings = await Rating.find({ workerId: worker._id });
        const avgRating = ratings.length > 0 
          ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
          : 0;

        return {
          workerId: worker._id,
          workerName: worker.name,
          totalOrders,
          deliveredOrders,
          onTimeDeliveries: onTimeCount,
          onTimePercentage: totalOrders > 0 ? ((onTimeCount / totalOrders) * 100).toFixed(1) : 0,
          averageRating: avgRating
        };
      })
    );

    res.json(performance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Manage customers - CRUD (Story 19)
// @route   GET /api/admin/customers
// @access  Private (Admin)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   DELETE /api/admin/customers/:id
exports.deleteCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'customer') {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    await user.deleteOne();
    res.json({ msg: 'Customer deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create promo code (Story 23)
// @route   POST /api/admin/promo-codes
// @access  Private (Admin)
exports.createPromoCode = async (req, res) => {
  try {
    const promoCode = new PromoCode({
      ...req.body,
      createdBy: req.user.id
    });

    await promoCode.save();
    res.json({ msg: 'Promo code created successfully', promoCode });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all promo codes (Story 23)
// @route   GET /api/admin/promo-codes
// @access  Private (Admin)
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update promo code (Story 23)
// @route   PUT /api/admin/promo-codes/:id
// @access  Private (Admin)
exports.updatePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!promoCode) {
      return res.status(404).json({ msg: 'Promo code not found' });
    }

    res.json({ msg: 'Promo code updated successfully', promoCode });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete promo code (Story 23)
// @route   DELETE /api/admin/promo-codes/:id
// @access  Private (Admin)
exports.deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
      return res.status(404).json({ msg: 'Promo code not found' });
    }

    await promoCode.deleteOne();
    res.json({ msg: 'Promo code deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Manage branches (Story 32)
// @route   POST /api/admin/branches
// @access  Private (Admin)
exports.createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.json({ msg: 'Branch created successfully', branch });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET /api/admin/branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate('managerId', 'name email');
    res.json(branches);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create/Update pricing rules (Story 22)
// @route   POST /api/admin/pricing-rules
// @access  Private (Admin)
exports.createPricingRule = async (req, res) => {
  try {
    const pricingRule = new PricingRule({
      ...req.body,
      createdBy: req.user.id
    });

    await pricingRule.save();
    res.json({ msg: 'Pricing rule created successfully', pricingRule });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
    }

    // Global variable to store ordering status
    let orderingStatus = {
        paused: false,
        pausedAt: null,
        pausedBy: null,
        resumedAt: null
    };

    // @desc    Get ordering status
    // @route   GET /api/admin/ordering-status
    // @access  Private/Admin
    exports.getOrderingStatus = async (req, res) => {
        try {
            res.json(orderingStatus);
        } catch (error) {
            console.error('Error getting ordering status:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    };

    // @desc    Toggle ordering on/off
    // @route   POST /api/admin/toggle-ordering
    // @access  Private/Admin
    exports.toggleOrdering = async (req, res) => {
        try {
            const { paused } = req.body;

            // Update ordering status
            orderingStatus = {
                paused: paused,
                pausedAt: paused ? new Date() : orderingStatus.pausedAt,
                pausedBy: paused ? req.user.id : orderingStatus.pausedBy,
                resumedAt: !paused ? new Date() : null
            };

            // Set global variable for middleware
            global.orderingPaused = paused;

            res.json({
                msg: paused ? 'Ordering paused successfully' : 'Ordering resumed successfully',
                orderingStatus
            });
        } catch (error) {
            console.error('Error toggling ordering:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    };
    // Global variable to store ordering status
    let orderingStatus = {
        paused: false,
        pausedAt: null,
        pausedBy: null,
        resumedAt: null
    };

    // @desc    Get ordering status
    // @route   GET /api/admin/ordering-status
    // @access  Private/Admin
    exports.getOrderingStatus = async (req, res) => {
        try {
            res.json(orderingStatus);
        } catch (error) {
            console.error('Error getting ordering status:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    };

    // @desc    Toggle ordering on/off
    // @route   POST /api/admin/toggle-ordering
    // @access  Private/Admin
    exports.toggleOrdering = async (req, res) => {
        try {
            const { paused } = req.body;

            // Update ordering status
            orderingStatus = {
                paused: paused,
                pausedAt: paused ? new Date() : orderingStatus.pausedAt,
                pausedBy: paused ? req.user.id : orderingStatus.pausedBy,
                resumedAt: !paused ? new Date() : null
            };

            // Set global variable for middleware
            global.orderingPaused = paused;

            res.json({
                msg: paused ? 'Ordering paused successfully' : 'Ordering resumed successfully',
                orderingStatus
            });
        } catch (error) {
            console.error('Error toggling ordering:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    };

};

module.exports = exports;
