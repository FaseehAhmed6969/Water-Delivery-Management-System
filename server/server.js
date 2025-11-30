const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

// Initialize global ordering status
global.orderingPaused = false;

// Create Express app
const app = express();

// CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://water-delivery-management-system.vercel.app',
        'https://water-delivery-management-system-k6g6qzsq6.vercel.app',
        'https://water-delivery-management-system-8k5vco8fv.vercel.app',
        'https://water-delivery-management-system-2rsdepyze.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/water-delivery')
    .then(() => console.log('MongoDB Connected ✓'))
    .catch(err => console.log('MongoDB Error:', err));

// Root route
app.get('/', (req, res) => {
    res.json({ msg: 'Water Delivery API Running - All Features Active! 🚀' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/bottle-returns', require('./routes/bottleReturns'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
});

// Listen only in development (not on Vercel)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
