import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, Tabs, Tab, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { requestNotificationPermission, showBrowserNotification } from '../services/notificationService';
import AnimatedCounter from '../components/AnimatedCounter';
import { motion } from 'framer-motion';
import {
    createOrder,
    getMyOrders,
    getLoyaltyPoints,
    submitRating,
    updateProfile,
    getNotifications,
    markAsRead
} from '../services/api';
import axios from 'axios';
import '../styles/animations.css';
import '../styles/theme.css';

function EnhancedCustomerDashboard() {
    const { user, logoutUser, loadUser } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [orders, setOrders] = useState([]);
    const [subscriptions, setSubscriptions] = useState([
        {
            _id: '1',
            name: 'Weekly Delivery',
            status: 'active',
            frequency: 'weekly',
            items: [{ bottleSize: '20L', quantity: 2 }],
            deliveryAddress: '123 Main St, Lahore',
            timeSlot: 'morning',
            nextDelivery: '2025-12-02',
            deliveriesCompleted: 12
        },
        {
            _id: '2',
            name: 'Monthly Delivery',
            status: 'active',
            frequency: 'monthly',
            items: [{ bottleSize: '10L', quantity: 4 }],
            deliveryAddress: 'Office, Gulberg',
            timeSlot: 'afternoon',
            nextDelivery: '2026-01-01',
            deliveriesCompleted: 8
        },
        {
            _id: '3',
            name: 'Weekly Office Delivery',
            status: 'paused',
            frequency: 'weekly',
            items: [{ bottleSize: '5L', quantity: 3 }],
            deliveryAddress: 'Office Complex, DHA',
            timeSlot: 'evening',
            pausedOn: '2025-11-20',
            deliveriesCompleted: 4
        }
    ]);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Notification states
    const [notificationPermission, setNotificationPermission] = useState(false);
    const [showToastNotif, setShowToastNotif] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');
    const [lastNotificationCheck, setLastNotificationCheck] = useState(new Date());

    const [orderForm, setOrderForm] = useState({
        bottleSize: '5L',
        quantity: 1,
        deliveryAddress: user?.address || '',
        orderType: 'one-time',
        paymentMethod: 'COD',
        timeSlot: 'anytime'
    });

    const [subscriptionForm, setSubscriptionForm] = useState({
        name: '',
        frequency: 'weekly',
        bottleSize: '5L',
        quantity: 1,
        deliveryAddress: user?.address || '',
        timeSlot: 'anytime'
    });

    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const [ratingForm, setRatingForm] = useState({
        rating: 5,
        feedback: '',
        deliverySpeed: 5,
        productQuality: 5
    });

    const [issueForm, setIssueForm] = useState({
        issueType: 'damaged_product',
        description: ''
    });

    const [paymentForm, setPaymentForm] = useState({
        paymentMethod: 'COD',
        transactionId: ''
    });

    // Helper functions for consistent styling
    const getCardStyle = () => ({
        borderRadius: '14px',
        background: darkMode ? '#1E293B' : '#FFFFFF',
        boxShadow: darkMode
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
        transition: 'all 0.3s ease'
    });

    const getCardHeaderStyle = () => ({
        borderRadius: '14px 14px 0 0',
        background: darkMode ? '#1E293B' : '#FFFFFF',
        borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
        color: darkMode ? '#F8FAFC' : '#0F172A'
    });

    const getTextColor = (type = 'primary') => {
        if (type === 'primary') return darkMode ? '#F8FAFC' : '#0F172A';
        if (type === 'secondary') return darkMode ? '#94A3B8' : '#64748B';
        return darkMode ? '#CBD5E1' : '#475569';
    };

    // FIXED: Cyan color that was hard to see in dark mode
    const getCyanColor = () => darkMode ? '#67E8F9' : '#06B6D4'; // Lighter cyan for dark mode

    useEffect(() => {
        fetchOrders();
        fetchLoyaltyPoints();
        fetchNotifications();
    }, []);

    useEffect(() => {
        const setupNotifications = async () => {
            const granted = await requestNotificationPermission();
            setNotificationPermission(granted);

            if (granted) {
                displayToast('🔔 Notifications enabled!', 'success');
            }
        };

        setupNotifications();

        const interval = setInterval(() => {
            checkForNewNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const checkForNewNotifications = async () => {
        try {
            const response = await getNotifications();
            const newNotifs = response.data.filter(n =>
                !n.isRead && new Date(n.createdAt) > lastNotificationCheck
            );

            if (newNotifs.length > 0) {
                const latest = newNotifs[0];

                if (notificationPermission) {
                    showBrowserNotification(latest.title, {
                        body: latest.message,
                        icon: '/logo192.png'
                    });
                }

                displayToast(`${latest.title}: ${latest.message}`, 'info');
                setNotifications(response.data);
                setLastNotificationCheck(new Date());
            }
        } catch (error) {
            console.error('Error checking notifications:', error);
        }
    };

    const displayToast = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToastNotif(true);
        setTimeout(() => setShowToastNotif(false), 5000);
    };

    const fetchOrders = async () => {
        try {
            const response = await getMyOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchLoyaltyPoints = async () => {
        try {
            const response = await getLoyaltyPoints();
            setLoyaltyPoints(response.data.loyaltyPoints);
        } catch (error) {
            console.error('Error fetching loyalty points:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleReorder = async (order) => {
        try {
            await createOrder({
                items: order.items,
                deliveryAddress: order.deliveryAddress,
                timeSlot: order.timeSlot || 'anytime'
            });
            displayToast('✅ Order placed successfully!', 'success');
            fetchOrders();
            fetchLoyaltyPoints();
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                items: [{ bottleSize: orderForm.bottleSize, quantity: parseInt(orderForm.quantity) }],
                deliveryAddress: orderForm.deliveryAddress,
                timeSlot: orderForm.timeSlot
            };

            if (orderForm.orderType === 'subscription') {
                // Create new subscription
                const newSub = {
                    _id: Date.now().toString(),
                    name: subscriptionForm.name || `${subscriptionForm.frequency} Delivery`,
                    status: 'active',
                    frequency: subscriptionForm.frequency,
                    items: orderData.items,
                    deliveryAddress: orderData.deliveryAddress,
                    timeSlot: orderForm.timeSlot,
                    nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    deliveriesCompleted: 0
                };
                setSubscriptions([...subscriptions, newSub]);
                displayToast('✅ Subscription created successfully!', 'success');
            } else {
                await createOrder(orderData);
                displayToast('✅ Order placed successfully!', 'success');
            }

            setShowOrderModal(false);
            fetchOrders();
            fetchLoyaltyPoints();
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileForm);
            displayToast('✅ Profile updated successfully!', 'success');
            setShowProfileModal(false);
            loadUser();
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitRating({ orderId: selectedOrder._id, ...ratingForm });
            displayToast('✅ Rating submitted successfully!', 'success');
            setShowRatingModal(false);
            fetchOrders();
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleIssueSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/issues', {
                orderId: selectedOrder._id,
                ...issueForm
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            displayToast('✅ Issue reported successfully!', 'success');
            setShowIssueModal(false);
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/payments', {
                orderId: selectedOrder._id,
                ...paymentForm
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            displayToast('✅ Payment recorded successfully!', 'success');
            setShowPaymentModal(false);
            fetchOrders();
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    // NEW: Handle subscription edit
    const handleEditSubscription = (subscription) => {
        setSelectedSubscription(subscription);
        setSubscriptionForm({
            name: subscription.name,
            frequency: subscription.frequency,
            bottleSize: subscription.items[0].bottleSize,
            quantity: subscription.items[0].quantity,
            deliveryAddress: subscription.deliveryAddress,
            timeSlot: subscription.timeSlot
        });
        setShowEditSubscriptionModal(true);
    };

    // NEW: Handle subscription update
    const handleUpdateSubscription = (e) => {
        e.preventDefault();
        const updatedSubscriptions = subscriptions.map(sub =>
            sub._id === selectedSubscription._id
                ? {
                    ...sub,
                    name: subscriptionForm.name,
                    frequency: subscriptionForm.frequency,
                    items: [{ bottleSize: subscriptionForm.bottleSize, quantity: subscriptionForm.quantity }],
                    deliveryAddress: subscriptionForm.deliveryAddress,
                    timeSlot: subscriptionForm.timeSlot
                }
                : sub
        );
        setSubscriptions(updatedSubscriptions);
        displayToast('✅ Subscription updated successfully!', 'success');
        setShowEditSubscriptionModal(false);
    };

    // NEW: Handle subscription pause/resume
    const handleToggleSubscription = (subscriptionId) => {
        const updatedSubscriptions = subscriptions.map(sub =>
            sub._id === subscriptionId
                ? {
                    ...sub,
                    status: sub.status === 'active' ? 'paused' : 'active',
                    pausedOn: sub.status === 'active' ? new Date().toISOString().split('T')[0] : null
                }
                : sub
        );
        setSubscriptions(updatedSubscriptions);
        const sub = subscriptions.find(s => s._id === subscriptionId);
        displayToast(
            sub.status === 'active' ? '⏸️ Subscription paused!' : '▶️ Subscription resumed!',
            sub.status === 'active' ? 'warning' : 'success'
        );
    };

    // NEW: Handle subscription delete
    const handleDeleteSubscription = (subscriptionId) => {
        if (window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
            const updatedSubscriptions = subscriptions.filter(sub => sub._id !== subscriptionId);
            setSubscriptions(updatedSubscriptions);
            displayToast('❌ Subscription cancelled successfully!', 'danger');
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            assigned: 'info',
            'in-transit': 'primary',
            delivered: 'success',
            cancelled: 'danger'
        };
        return <Badge bg={variants[status]} style={{ borderRadius: '8px' }}>{status.toUpperCase()}</Badge>;
    };

    const getTimeSlotDisplay = (timeSlot) => {
        const slots = {
            morning: '🌅 Morning',
            afternoon: '☀️ Afternoon',
            evening: '🌆 Evening',
            night: '🌙 Night',
            anytime: '⏰ Anytime'
        };
        return slots[timeSlot] || '⏰ Anytime';
    };

    return (
        <Container
            fluid
            className="py-4 dashboard-page"
            style={{
                backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
                minHeight: '100vh',
                transition: 'background-color 0.3s ease'
            }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Row className="mb-4">
                    <Col>
                        <motion.h2
                            style={{
                                fontWeight: '800',
                                color: darkMode ? '#60A5FA' : '#3B82F6',
                                fontSize: '2.5rem',
                                letterSpacing: '-1px'
                            }}
                            whileHover={{ scale: 1.02 }}
                        >
                            💧 AquaFlow
                        </motion.h2>
                        <p style={{
                            color: getTextColor('secondary'),
                            fontSize: '1.1rem'
                        }}>
                            Welcome back, <strong style={{ color: getTextColor('primary') }}>{user?.name}</strong>! 👋
                        </p>
                    </Col>
                    <Col className="text-end">
                        <motion.div style={{ display: 'inline-block', marginRight: '8px' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant={notifications.filter(n => !n.isRead).length > 0 ? "warning" : "outline-secondary"}
                                className="position-relative"
                                onClick={() => setActiveTab('notifications')}
                                style={{
                                    borderRadius: '10px',
                                    border: darkMode ? '1.5px solid #475569' : '1.5px solid #CBD5E1',
                                    background: darkMode && notifications.filter(n => !n.isRead).length === 0 ? 'transparent' : undefined,
                                    color: darkMode && notifications.filter(n => !n.isRead).length === 0 ? '#94A3B8' : undefined
                                }}
                            >
                                🔔
                                {notifications.filter(n => !n.isRead).length > 0 && (
                                    <Badge
                                        bg="danger"
                                        pill
                                        className="position-absolute top-0 start-100 translate-middle pulse"
                                    >
                                        {notifications.filter(n => !n.isRead).length}
                                    </Badge>
                                )}
                            </Button>
                        </motion.div>

                        <motion.div style={{ display: 'inline-block', marginRight: '8px' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="outline-primary"
                                onClick={() => setShowProfileModal(true)}
                                style={{
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    border: `1.5px solid ${darkMode ? '#60A5FA' : '#3B82F6'}`,
                                    background: darkMode ? 'transparent' : undefined,
                                    color: darkMode ? '#60A5FA' : '#3B82F6'
                                }}
                            >
                                👤 Profile
                            </Button>
                        </motion.div>

                        <motion.div style={{ display: 'inline-block' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="outline-danger"
                                onClick={logoutUser}
                                style={{
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    border: '1.5px solid #EF4444',
                                    background: darkMode ? 'transparent' : undefined,
                                    color: '#EF4444'
                                }}
                            >
                                Logout
                            </Button>
                        </motion.div>
                    </Col>
                </Row>
            </motion.div>

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <Card
                            className="text-center border-0"
                            style={{
                                ...getCardStyle(),
                                cursor: 'pointer'
                            }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{
                                    color: darkMode ? '#60A5FA' : '#3B82F6',
                                    fontWeight: '700',
                                    fontSize: '2rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <AnimatedCounter end={orders.length} duration={2} />
                                </h3>
                                <p style={{
                                    color: getTextColor('secondary'),
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    Total Orders
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={3}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <Card
                            className="text-center border-0"
                            style={{
                                ...getCardStyle(),
                                cursor: 'pointer'
                            }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{
                                    color: darkMode ? '#34D399' : '#10B981',
                                    fontWeight: '700',
                                    fontSize: '2rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <AnimatedCounter end={orders.filter(o => o.status === 'delivered').length} duration={2} />
                                </h3>
                                <p style={{
                                    color: getTextColor('secondary'),
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    Delivered
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={3}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <Card
                            className="text-center border-0"
                            style={{
                                ...getCardStyle(),
                                cursor: 'pointer'
                            }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{
                                    color: darkMode ? '#FBBF24' : '#F59E0B',
                                    fontWeight: '700',
                                    fontSize: '2rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <AnimatedCounter end={orders.filter(o => o.status === 'pending' || o.status === 'assigned').length} duration={2} />
                                </h3>
                                <p style={{
                                    color: getTextColor('secondary'),
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    In Progress
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={3}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <Card
                            className="text-center border-0 gradient-primary"
                            style={{
                                borderRadius: '14px',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{
                                    fontWeight: '700',
                                    fontSize: '2rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    🎁 <AnimatedCounter end={loyaltyPoints} duration={2} />
                                </h3>
                                <p style={{
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    Loyalty Points
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* Notifications Alert */}
            {notifications.filter(n => !n.isRead).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Alert
                        variant="info"
                        className="mb-4"
                        style={{
                            borderRadius: '12px',
                            borderLeft: '4px solid #3B82F6',
                            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                            color: getTextColor('primary')
                        }}
                    >
                        <strong>🔔 {notifications.filter(n => !n.isRead).length} New Notifications</strong>
                        <Button
                            size="sm"
                            variant="link"
                            onClick={() => setActiveTab('notifications')}
                            style={{ fontWeight: '600', color: darkMode ? '#60A5FA' : '#3B82F6' }}
                        >
                            View All →
                        </Button>
                    </Alert>
                </motion.div>
            )}

            {/* Action Buttons */}
            <Row className="mb-4">
                <Col>
                    <motion.div
                        style={{ display: 'inline-block', marginRight: '12px' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            size="lg"
                            className="btn-animated"
                            onClick={() => setShowOrderModal(true)}
                            style={{
                                background: `linear-gradient(135deg, #3B82F6 0%, ${getCyanColor()} 100%)`,
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.9rem 2rem',
                                fontWeight: '600',
                                fontSize: '1rem',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                color: 'white'
                            }}
                        >
                            🛒 Place New Order
                        </Button>
                    </motion.div>

                    <motion.div
                        style={{ display: 'inline-block' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            size="lg"
                            className="btn-animated"
                            onClick={() => {
                                setOrderForm({ ...orderForm, orderType: 'subscription' });
                                setSubscriptionForm({
                                    name: '',
                                    frequency: 'weekly',
                                    bottleSize: '5L',
                                    quantity: 1,
                                    deliveryAddress: user?.address || '',
                                    timeSlot: 'anytime'
                                });
                                setShowOrderModal(true);
                            }}
                            style={{
                                background: darkMode ? 'transparent' : '#FFFFFF',
                                border: `2px solid ${darkMode ? '#60A5FA' : '#3B82F6'}`,
                                borderRadius: '12px',
                                padding: '0.9rem 2rem',
                                fontWeight: '600',
                                fontSize: '1rem',
                                color: darkMode ? '#60A5FA' : '#3B82F6'
                            }}
                        >
                            📅 Create Subscription
                        </Button>
                    </motion.div>
                </Col>
            </Row>

            {/* Main Content Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
                style={{ borderBottom: `2px solid ${darkMode ? '#334155' : '#E2E8F0'}` }}
            >
                <Tab eventKey="dashboard" title="📊 My Orders">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            className="border-0"
                            style={getCardStyle()}
                        >
                            <Card.Header style={getCardHeaderStyle()}>
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>Order History</h5>
                            </Card.Header>
                            <Card.Body style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <Table responsive hover style={{ marginBottom: 0 }}>
                                        <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                            <tr>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Order ID</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Items</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Address</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Amount</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Time Slot</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Payment</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Status</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Date</th>
                                                <th style={{ color: darkMode ? '#CBD5E1' : '#64748B', fontSize: '0.85rem', fontWeight: '600', padding: '1rem' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order, index) => (
                                                <motion.tr
                                                    key={order._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    whileHover={{
                                                        backgroundColor: darkMode ? '#334155' : '#F1F5F9',
                                                        x: 5
                                                    }}
                                                    style={{
                                                        borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <td style={{ padding: '1rem' }}>
                                                        <Badge bg="secondary" style={{ borderRadius: '8px' }}>
                                                            #{order._id.slice(-6)}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ color: getTextColor('primary'), padding: '1rem' }}>
                                                        {order.items.map(item => `${item.quantity}x ${item.bottleSize}`).join(', ')}
                                                    </td>
                                                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: getTextColor('primary'), padding: '1rem' }}>
                                                        {order.deliveryAddress}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <strong style={{ color: getTextColor('primary') }}>₹{order.totalPrice}</strong>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <Badge bg="info" style={{ borderRadius: '8px' }}>
                                                            {getTimeSlotDisplay(order.timeSlot)}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ color: getTextColor('primary'), padding: '1rem' }}>
                                                        {order.paymentMethod || 'COD'}
                                                        {!order.paymentStatus && order.status === 'delivered' && (
                                                            <Button
                                                                size="sm"
                                                                variant="link"
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setShowPaymentModal(true);
                                                                }}
                                                                style={{ color: darkMode ? '#60A5FA' : '#3B82F6' }}
                                                            >
                                                                Pay Now
                                                            </Button>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>{getStatusBadge(order.status)}</td>
                                                    <td style={{ color: getTextColor('primary'), padding: '1rem' }}>
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div className="d-flex gap-1">
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-success"
                                                                    onClick={() => handleReorder(order)}
                                                                    title="Re-order"
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    🔄
                                                                </Button>
                                                            </motion.div>

                                                            {order.status === 'delivered' && (
                                                                <>
                                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline-warning"
                                                                            onClick={() => {
                                                                                setSelectedOrder(order);
                                                                                setShowRatingModal(true);
                                                                            }}
                                                                            title="Rate Delivery"
                                                                            style={{ borderRadius: '8px' }}
                                                                        >
                                                                            ⭐
                                                                        </Button>
                                                                    </motion.div>
                                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline-danger"
                                                                            onClick={() => {
                                                                                setSelectedOrder(order);
                                                                                setShowIssueModal(true);
                                                                            }}
                                                                            title="Report Issue"
                                                                            style={{ borderRadius: '8px' }}
                                                                        >
                                                                            ⚠️
                                                                        </Button>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                <Tab eventKey="notifications" title={`🔔 Notifications (${notifications.filter(n => !n.isRead).length})`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            className="border-0"
                            style={getCardStyle()}
                        >
                            <Card.Body>
                                {notifications.length === 0 ? (
                                    <Alert
                                        variant="info"
                                        className="text-center"
                                        style={{
                                            borderRadius: '12px',
                                            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                                            color: getTextColor('primary')
                                        }}
                                    >
                                        <h5 style={{ color: getTextColor('primary') }}>📭 No notifications yet</h5>
                                        <p style={{ color: getTextColor('secondary') }}>You'll see your order updates here!</p>
                                    </Alert>
                                ) : (
                                    notifications.map((notif, index) => (
                                        <motion.div
                                            key={notif._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Alert
                                                variant={notif.isRead ? 'secondary' : 'primary'}
                                                className="d-flex justify-content-between align-items-center"
                                                style={{
                                                    borderRadius: '12px',
                                                    marginBottom: '12px',
                                                    background: notif.isRead
                                                        ? (darkMode ? 'rgba(100, 116, 139, 0.1)' : 'rgba(100, 116, 139, 0.05)')
                                                        : (darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'),
                                                    border: `1px solid ${notif.isRead
                                                        ? (darkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(100, 116, 139, 0.2)')
                                                        : (darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)')}`,
                                                    color: getTextColor('primary')
                                                }}
                                            >
                                                <div>
                                                    <strong style={{ color: getTextColor('primary') }}>{notif.title}</strong>
                                                    <p className="mb-0" style={{ color: getTextColor('secondary') }}>{notif.message}</p>
                                                    <small style={{ color: getTextColor('tertiary') }}>{new Date(notif.createdAt).toLocaleString()}</small>
                                                </div>
                                                {!notif.isRead && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={async () => {
                                                            await markAsRead(notif._id);
                                                            fetchNotifications();
                                                        }}
                                                        style={{
                                                            borderRadius: '8px',
                                                            color: darkMode ? '#60A5FA' : '#3B82F6',
                                                            borderColor: darkMode ? '#60A5FA' : '#3B82F6'
                                                        }}
                                                    >
                                                        Mark Read
                                                    </Button>
                                                )}
                                            </Alert>
                                        </motion.div>
                                    ))
                                )}
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                {/* SUBSCRIPTIONS TAB WITH EDIT/DELETE FUNCTIONALITY */}
                <Tab eventKey="subscriptions" title="📅 Subscriptions">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            className="border-0"
                            style={getCardStyle()}
                        >
                            <Card.Header
                                className="d-flex justify-content-between align-items-center"
                                style={getCardHeaderStyle()}
                            >
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>📅 My Subscriptions</h5>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            setOrderForm({ ...orderForm, orderType: 'subscription' });
                                            setSubscriptionForm({
                                                name: '',
                                                frequency: 'weekly',
                                                bottleSize: '5L',
                                                quantity: 1,
                                                deliveryAddress: user?.address || '',
                                                timeSlot: 'anytime'
                                            });
                                            setShowOrderModal(true);
                                        }}
                                        style={{
                                            borderRadius: '10px',
                                            fontWeight: '600',
                                            background: `linear-gradient(135deg, #3B82F6 0%, ${getCyanColor()} 100%)`,
                                            border: 'none'
                                        }}
                                    >
                                        + New Subscription
                                    </Button>
                                </motion.div>
                            </Card.Header>
                            <Card.Body>
                                <Alert
                                    variant="info"
                                    className="mb-4"
                                    style={{
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #3B82F6',
                                        background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                        border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                                        color: getTextColor('primary')
                                    }}
                                >
                                    <strong>💡 What are Subscriptions?</strong><br />
                                    <span style={{ color: getTextColor('secondary') }}>
                                        Set up recurring water deliveries and never run out! Cancel or pause anytime.
                                    </span>
                                </Alert>

                                {/* Active Subscriptions */}
                                <h6 className="mb-3" style={{ fontWeight: '700', color: getTextColor('primary') }}>🟢 Active Subscriptions</h6>
                                <Row className="mb-4">
                                    {subscriptions.filter(sub => sub.status === 'active').map((subscription) => (
                                        <Col md={6} key={subscription._id}>
                                            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                                <Card
                                                    className="border-success mb-3"
                                                    style={{
                                                        borderRadius: '14px',
                                                        borderWidth: '2px',
                                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                                        borderColor: '#10B981'
                                                    }}
                                                >
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div>
                                                                <h5 className="mb-1" style={{ fontWeight: '700', color: getTextColor('primary') }}>
                                                                    {subscription.name}
                                                                </h5>
                                                                <Badge bg="success" style={{ borderRadius: '8px' }}>Active</Badge>
                                                            </div>
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button
                                                                    variant="outline-warning"
                                                                    size="sm"
                                                                    onClick={() => handleToggleSubscription(subscription._id)}
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    Pause
                                                                </Button>
                                                            </motion.div>
                                                        </div>
                                                        <hr style={{ borderColor: darkMode ? '#334155' : '#E2E8F0' }} />
                                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                                            <strong>Items:</strong> {subscription.items[0].quantity}x {subscription.items[0].bottleSize} Bottles
                                                        </p>
                                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                                            <strong>Frequency:</strong> {subscription.frequency === 'weekly' ? 'Every Monday' : '1st of every month'}
                                                        </p>
                                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                                            <strong>Next Delivery:</strong> {new Date(subscription.nextDelivery).toLocaleDateString()}
                                                        </p>
                                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                                            <strong>Time Slot:</strong>{' '}
                                                            <Badge bg="info" style={{ borderRadius: '8px' }}>
                                                                {getTimeSlotDisplay(subscription.timeSlot)}
                                                            </Badge>
                                                        </p>
                                                        <p className="mb-1" style={{ color: getTextColor('secondary') }}>
                                                            <strong>Address:</strong> {subscription.deliveryAddress}
                                                        </p>
                                                        <div className="mt-3 d-flex gap-2">
                                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditSubscription(subscription)}
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    ✏️ Edit
                                                                </Button>
                                                            </motion.div>
                                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteSubscription(subscription._id)}
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    🗑️ Cancel
                                                                </Button>
                                                            </motion.div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </motion.div>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Paused Subscriptions */}
                                <h6 className="mb-3" style={{ fontWeight: '700', color: getTextColor('primary') }}>⏸️ Paused Subscriptions</h6>
                                <Row className="mb-4">
                                    {subscriptions.filter(sub => sub.status === 'paused').map((subscription) => (
                                        <Col md={6} key={subscription._id}>
                                            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                                <Card
                                                    className="border-warning mb-3"
                                                    style={{
                                                        borderRadius: '14px',
                                                        borderWidth: '2px',
                                                        background: darkMode ? '#1E293B' : '#FFFFFF'
                                                    }}
                                                >
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div>
                                                                <h5 className="mb-1" style={{ fontWeight: '700', color: getTextColor('primary') }}>
                                                                    {subscription.name}
                                                                </h5>
                                                                <Badge bg="warning" style={{ borderRadius: '8px' }}>Paused</Badge>
                                                            </div>
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => handleToggleSubscription(subscription._id)}
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    Resume
                                                                </Button>
                                                            </motion.div>
                                                        </div>
                                                        <hr style={{ borderColor: darkMode ? '#334155' : '#E2E8F0' }} />
                                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                                            <strong>Items:</strong> {subscription.items[0].quantity}x {subscription.items[0].bottleSize} Bottles
                                                        </p>
                                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                                            <strong>Paused On:</strong> {new Date(subscription.pausedOn).toLocaleDateString()}
                                                        </p>
                                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                                            <strong>Time Slot:</strong>{' '}
                                                            <Badge bg="info" style={{ borderRadius: '8px' }}>
                                                                {getTimeSlotDisplay(subscription.timeSlot)}
                                                            </Badge>
                                                        </p>
                                                        <p className="mb-1" style={{ color: getTextColor('secondary') }}>
                                                            <strong>Address:</strong> {subscription.deliveryAddress}
                                                        </p>
                                                        <div className="mt-3 d-flex gap-2">
                                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEditSubscription(subscription)}
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    ✏️ Edit
                                                                </Button>
                                                            </motion.div>
                                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteSubscription(subscription._id)}
                                                                    style={{ borderRadius: '8px' }}
                                                                >
                                                                    🗑️ Cancel
                                                                </Button>
                                                            </motion.div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </motion.div>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Subscription Stats */}
                                {/* Subscription Stats */}
                                <h6 className="mb-3" style={{ fontWeight: '700', color: getTextColor('primary') }}>📊 Subscription Summary</h6>
                                <Row className="mt-4">
                                    {/* BOX 1 - Active (GREEN) */}
                                    <Col md={3}>
                                        <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                                            <Card
                                                className="text-center"
                                                style={{
                                                    borderRadius: '14px',
                                                    background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                                                    color: 'white',
                                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                                                }}
                                            >
                                                <Card.Body>
                                                    <h3 style={{ fontWeight: '700' }}>
                                                        {subscriptions.filter(s => s.status === 'active').length}
                                                    </h3>
                                                    <p className="mb-0" style={{ fontWeight: '600' }}>Active</p>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>

                                    {/* BOX 2 - Paused (ORANGE/YELLOW) */}
                                    <Col md={3}>
                                        <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                                            <Card
                                                className="text-center"
                                                style={{
                                                    borderRadius: '14px',
                                                    background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                                                    color: 'white',
                                                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                                                }}
                                            >
                                                <Card.Body>
                                                    <h3 style={{ fontWeight: '700' }}>
                                                        {subscriptions.filter(s => s.status === 'paused').length}
                                                    </h3>
                                                    <p className="mb-0" style={{ fontWeight: '600' }}>Paused</p>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>

                                    {/* BOX 3 - Monthly Savings (BLUE) */}
                                    <Col md={3}>
                                        <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                                            <Card
                                                className="text-center"
                                                style={{
                                                    borderRadius: '14px',
                                                    background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                                                    color: 'white',
                                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                                                }}
                                            >
                                                <Card.Body>
                                                    <h3 style={{ fontWeight: '700' }}>₹850</h3>
                                                    <p className="mb-0" style={{ fontWeight: '600' }}>Monthly Savings</p>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>

                                    {/* BOX 4 - Total Deliveries (PURPLE) */}
                                    <Col md={3}>
                                        <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                                            <Card
                                                className="text-center"
                                                style={{
                                                    borderRadius: '14px',
                                                    background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                                                    color: 'white',
                                                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
                                                }}
                                            >
                                                <Card.Body>
                                                    <h3 style={{ fontWeight: '700' }}>
                                                        {subscriptions.reduce((sum, sub) => sum + sub.deliveriesCompleted, 0)}
                                                    </h3>
                                                    <p className="mb-0" style={{ fontWeight: '600' }}>Total Deliveries</p>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>
                                </Row>


                                {/* Pro Tip */}
                                <Alert
                                    variant="success"
                                    className="mt-4"
                                    style={{
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #10B981',
                                        background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                                        border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                                        color: getTextColor('primary')
                                    }}
                                >
                                    <strong>💰 Pro Tip:</strong> Subscribe and save up to 15% on your monthly water costs! Plus, never worry about running out.
                                </Alert>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>
            </Tabs>

            {/* ALL MODALS */}
            {/* Order Modal */}
            <Modal
                show={showOrderModal}
                onHide={() => setShowOrderModal(false)}
                size="lg"
                centered
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Modal.Header
                        closeButton
                        style={{
                            background: darkMode ? '#1E293B' : `linear-gradient(135deg, #3B82F6 0%, ${getCyanColor()} 100%)`,
                            color: 'white',
                            borderRadius: '16px 16px 0 0',
                            borderBottom: 'none'
                        }}
                    >
                        <Modal.Title style={{ fontWeight: '700' }}>
                            {orderForm.orderType === 'subscription' ? '📅 Create Subscription' : '🛒 Place New Order'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem', background: darkMode ? '#0F172A' : '#FFFFFF' }}>
                        <Form onSubmit={handleOrderSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Order Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={orderForm.orderType}
                                    onChange={(e) => setOrderForm({ ...orderForm, orderType: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <option value="one-time">One-Time Order</option>
                                    <option value="subscription">Subscription (Weekly/Monthly)</option>
                                </Form.Control>
                            </Form.Group>

                            {orderForm.orderType === 'subscription' && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Subscription Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., Home Weekly Delivery"
                                            value={subscriptionForm.name}
                                            onChange={(e) => setSubscriptionForm({ ...subscriptionForm, name: e.target.value })}
                                            style={{
                                                background: darkMode ? '#1E293B' : '#FFFFFF',
                                                color: getTextColor('primary'),
                                                border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                                borderRadius: '10px',
                                                padding: '0.75rem'
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Frequency</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={subscriptionForm.frequency}
                                            onChange={(e) => setSubscriptionForm({ ...subscriptionForm, frequency: e.target.value })}
                                            style={{
                                                background: darkMode ? '#1E293B' : '#FFFFFF',
                                                color: getTextColor('primary'),
                                                border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                                borderRadius: '10px',
                                                padding: '0.75rem'
                                            }}
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </Form.Control>
                                    </Form.Group>
                                </>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Bottle Size</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={orderForm.orderType === 'subscription' ? subscriptionForm.bottleSize : orderForm.bottleSize}
                                    onChange={(e) => {
                                        if (orderForm.orderType === 'subscription') {
                                            setSubscriptionForm({ ...subscriptionForm, bottleSize: e.target.value });
                                        } else {
                                            setOrderForm({ ...orderForm, bottleSize: e.target.value });
                                        }
                                    }}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <option value="5L">5 Liters - ₹50</option>
                                    <option value="10L">10 Liters - ₹90</option>
                                    <option value="20L">20 Liters - ₹170</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={orderForm.orderType === 'subscription' ? subscriptionForm.quantity : orderForm.quantity}
                                    onChange={(e) => {
                                        if (orderForm.orderType === 'subscription') {
                                            setSubscriptionForm({ ...subscriptionForm, quantity: parseInt(e.target.value) });
                                        } else {
                                            setOrderForm({ ...orderForm, quantity: e.target.value });
                                        }
                                    }}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>⏰ Preferred Delivery Time</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={orderForm.orderType === 'subscription' ? subscriptionForm.timeSlot : orderForm.timeSlot}
                                    onChange={(e) => {
                                        if (orderForm.orderType === 'subscription') {
                                            setSubscriptionForm({ ...subscriptionForm, timeSlot: e.target.value });
                                        } else {
                                            setOrderForm({ ...orderForm, timeSlot: e.target.value });
                                        }
                                    }}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <option value="anytime">Anytime (Default)</option>
                                    <option value="morning">🌅 Morning (8 AM - 12 PM)</option>
                                    <option value="afternoon">☀️ Afternoon (12 PM - 4 PM)</option>
                                    <option value="evening">🌆 Evening (4 PM - 8 PM)</option>
                                    <option value="night">🌙 Night (8 PM - 10 PM) +₹20</option>
                                </Form.Control>
                                {((orderForm.orderType === 'subscription' && subscriptionForm.timeSlot === 'night') ||
                                    (orderForm.orderType !== 'subscription' && orderForm.timeSlot === 'night')) && (
                                        <Form.Text style={{ color: '#FBBF24' }}>
                                            ⚡ Premium time slot - ₹20 extra charge
                                        </Form.Text>
                                    )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Delivery Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={orderForm.orderType === 'subscription' ? subscriptionForm.deliveryAddress : orderForm.deliveryAddress}
                                    onChange={(e) => {
                                        if (orderForm.orderType === 'subscription') {
                                            setSubscriptionForm({ ...subscriptionForm, deliveryAddress: e.target.value });
                                        } else {
                                            setOrderForm({ ...orderForm, deliveryAddress: e.target.value });
                                        }
                                    }}
                                    required
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            {orderForm.orderType !== 'subscription' && (
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Payment Method</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={orderForm.paymentMethod}
                                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                                        style={{
                                            background: darkMode ? '#1E293B' : '#FFFFFF',
                                            color: getTextColor('primary'),
                                            border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                            borderRadius: '10px',
                                            padding: '0.75rem'
                                        }}
                                    >
                                        <option value="COD">Cash on Delivery</option>
                                        <option value="Easypaisa">Easypaisa</option>
                                        <option value="JazzCash">JazzCash</option>
                                        <option value="Bank">Bank Transfer</option>
                                    </Form.Control>
                                </Form.Group>
                            )}

                            {orderForm.paymentMethod !== 'COD' && orderForm.orderType !== 'subscription' && (
                                <Alert
                                    variant="info"
                                    className="mb-4"
                                    style={{
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #7C3AED',
                                        background: darkMode ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
                                        border: `1px solid ${darkMode ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.25)'}`,
                                        color: getTextColor('primary')
                                    }}
                                >
                                    <strong style={{ color: '#000000' }}>💡 What are Subscriptions?</strong><br />
                                    <span style={{ color: '#000000' }}>
                                        Set up recurring water deliveries and never run out! Cancel or pause anytime.
                                    </span>

                                </Alert>

                            )}

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    className="w-100 btn-animated"
                                    size="lg"
                                    style={{
                                        background: `linear-gradient(135deg, #3B82F6 0%, ${getCyanColor()} 100%)`,
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        padding: '0.9rem'
                                    }}
                                >
                                    {orderForm.orderType === 'subscription' ? '✨ Create Subscription' : '🚀 Place Order'}
                                </Button>
                            </motion.div>
                        </Form>
                    </Modal.Body>
                </motion.div>
            </Modal>

            {/* Edit Subscription Modal */}
            <Modal
                show={showEditSubscriptionModal}
                onHide={() => setShowEditSubscriptionModal(false)}
                size="lg"
                centered
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Modal.Header
                        closeButton
                        style={{
                            background: darkMode ? '#1E293B' : 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                            color: 'white',
                            borderRadius: '16px 16px 0 0',
                            borderBottom: 'none'
                        }}
                    >
                        <Modal.Title style={{ fontWeight: '700' }}>✏️ Edit Subscription</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem', background: darkMode ? '#0F172A' : '#FFFFFF' }}>
                        <Form onSubmit={handleUpdateSubscription}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Subscription Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={subscriptionForm.name}
                                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, name: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Frequency</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={subscriptionForm.frequency}
                                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, frequency: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Bottle Size</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={subscriptionForm.bottleSize}
                                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, bottleSize: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <option value="5L">5 Liters - ₹50</option>
                                    <option value="10L">10 Liters - ₹90</option>
                                    <option value="20L">20 Liters - ₹170</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={subscriptionForm.quantity}
                                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, quantity: parseInt(e.target.value) })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>⏰ Preferred Delivery Time</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={subscriptionForm.timeSlot}
                                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, timeSlot: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <option value="anytime">Anytime (Default)</option>
                                    <option value="morning">🌅 Morning (8 AM - 12 PM)</option>
                                    <option value="afternoon">☀️ Afternoon (12 PM - 4 PM)</option>
                                    <option value="evening">🌆 Evening (4 PM - 8 PM)</option>
                                    <option value="night">🌙 Night (8 PM - 10 PM) +₹20</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Delivery Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={subscriptionForm.deliveryAddress}
                                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, deliveryAddress: e.target.value })}
                                    required
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    className="w-100 btn-animated"
                                    style={{
                                        background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        padding: '0.9rem'
                                    }}
                                >
                                    ✅ Update Subscription
                                </Button>
                            </motion.div>
                        </Form>
                    </Modal.Body>
                </motion.div>
            </Modal>

            {/* Profile Modal */}
            <Modal
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
                centered
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Modal.Header
                        closeButton
                        style={{
                            background: darkMode ? '#1E293B' : 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                            color: 'white',
                            borderRadius: '16px 16px 0 0',
                            borderBottom: 'none'
                        }}
                    >
                        <Modal.Title style={{ fontWeight: '700' }}>👤 Update Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem', background: darkMode ? '#0F172A' : '#FFFFFF' }}>
                        <Form onSubmit={handleProfileUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={profileForm.address}
                                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                    style={{
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        color: getTextColor('primary'),
                                        border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    className="w-100 btn-animated"
                                    style={{
                                        background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        padding: '0.9rem'
                                    }}
                                >
                                    ✅ Update Profile
                                </Button>
                            </motion.div>
                        </Form>
                    </Modal.Body>
                </motion.div>
            </Modal>

            {/* Toast Notifications */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    show={showToastNotif}
                    onClose={() => setShowToastNotif(false)}
                    bg={toastType}
                    style={{
                        background: darkMode ? '#1E293B' : '#FFFFFF',
                        color: getTextColor('primary'),
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                >
                    <Toast.Header style={{ background: darkMode ? '#334155' : '#F8FAFC' }}>
                        <strong className="me-auto" style={{ color: getTextColor('primary') }}>🔔 Notification</strong>
                        <small style={{ color: getTextColor('secondary') }}>just now</small>
                    </Toast.Header>
                    <Toast.Body style={{ color: getTextColor('primary') }}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}

export default EnhancedCustomerDashboard;
