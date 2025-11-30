// Middleware to check if ordering is paused
const checkOrderingStatus = (req, res, next) => {
    // Check global variable set by admin
    if (global.orderingPaused === true) {
        return res.status(403).json({
            msg: 'Online ordering is temporarily paused. Please try again later or contact support.',
            paused: true
        });
    }
    next();
};

module.exports = checkOrderingStatus;
