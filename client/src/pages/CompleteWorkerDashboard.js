import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Badge,
    Modal,
    Form,
    Alert,
    ListGroup,
    Tabs,
    Tab,
    Toast,
    ToastContainer
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { requestNotificationPermission, showBrowserNotification } from '../services/notificationService';
import AnimatedCounter from '../components/AnimatedCounter';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/animations.css';
import '../styles/theme.css';

function CompleteWorkerDashboard() {
    const { user, logoutUser } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [todayOrders, setTodayOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [earnings, setEarnings] = useState({
        period: 'today',
        totalBottles: 0,
        totalEarnings: 0,
        breakdown: []
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showBottleReturnModal, setShowBottleReturnModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [earningsPeriod, setEarningsPeriod] = useState('today');
    const [loadingEarnings, setLoadingEarnings] = useState(false);

    // Notification states
    const [notificationPermission, setNotificationPermission] = useState(false);
    const [showToastNotif, setShowToastNotif] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');
    const [lastCheck, setLastCheck] = useState(new Date());

    const [bottleReturnForm, setBottleReturnForm] = useState({
        bottleSize: '5L',
        quantity: 1,
        returnType: 'empty',
        notes: ''
    });

    const token = localStorage.getItem('token');

    // Helper functions for consistent styling
    const getCardStyle = () => ({
        borderRadius: '14px',
        background: darkMode ? '#1E293B' : '#FFFFFF',
        boxShadow: darkMode
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`
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

    useEffect(() => {
        fetchTodayOrders();
        fetchAllOrders();
        fetchStats();
        fetchNotifications();
        fetchEarnings('today');

        const interval = setInterval(() => {
            fetchTodayOrders();
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
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
            checkForNewOrders();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const checkForNewOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/workers/today-orders', {
                headers: { 'x-auth-token': token }
            });

            const newOrders = response.data.filter(o =>
                o.status === 'assigned' && new Date(o.createdAt) > lastCheck
            );

            if (newOrders.length > 0) {
                if (notificationPermission) {
                    showBrowserNotification('📦 New Delivery!', {
                        body: `${newOrders.length} new order(s) assigned to you`,
                        icon: '/logo192.png'
                    });
                }

                displayToast(`📦 ${newOrders.length} new delivery order(s) assigned!`, 'info');
                setTodayOrders(response.data);
                setLastCheck(new Date());
            }
        } catch (error) {
            console.error('Error checking orders:', error);
        }
    };

    const displayToast = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToastNotif(true);
        setTimeout(() => setShowToastNotif(false), 5000);
    };

    const fetchTodayOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/workers/today-orders', {
                headers: { 'x-auth-token': token }
            });
            setTodayOrders(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/workers/my-orders', {
                headers: { 'x-auth-token': token }
            });
            setAllOrders(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/workers/stats', {
                headers: { 'x-auth-token': token }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchEarnings = async (period) => {
        setLoadingEarnings(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/workers/earnings?period=${period}`,
                { headers: { 'x-auth-token': token } }
            );
            setEarnings(response.data);
            setEarningsPeriod(period);
            setLoadingEarnings(false);
        } catch (error) {
            console.error('Error:', error);
            setLoadingEarnings(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notifications', {
                headers: { 'x-auth-token': token }
            });
            setNotifications(response.data.filter(n => !n.isRead).slice(0, 5));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDismissNotification = async (notificationId) => {
        try {
            await axios.put(
                `http://localhost:5000/api/notifications/${notificationId}/read`,
                {},
                { headers: { 'x-auth-token': token } }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Error dismissing notification:', error);
        }
    };

    const handleDismissAllNotifications = async () => {
        try {
            await axios.put(
                'http://localhost:5000/api/notifications/mark-all-read',
                {},
                { headers: { 'x-auth-token': token } }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Error dismissing all notifications:', error);
        }
    };

    const handleViewDetails = async (order) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/workers/orders/${order._id}/customer`,
                { headers: { 'x-auth-token': token } }
            );
            setSelectedOrder({ ...order, customerDetails: response.data });
            setShowDetailsModal(true);
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleStartDelivery = async (orderId) => {
        try {
            await axios.put(
                `http://localhost:5000/api/workers/orders/${orderId}/status`,
                { status: 'in-transit' },
                { headers: { 'x-auth-token': token } }
            );
            displayToast('✅ Delivery started!', 'success');
            fetchTodayOrders();
            fetchAllOrders();
            fetchStats();
            fetchEarnings(earningsPeriod);
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleMarkDelivered = async (orderId) => {
        try {
            await axios.put(
                `http://localhost:5000/api/workers/orders/${orderId}/status`,
                { status: 'delivered' },
                { headers: { 'x-auth-token': token } }
            );
            displayToast('✅ Order marked as delivered!', 'success');
            fetchTodayOrders();
            fetchAllOrders();
            fetchStats();
            fetchEarnings(earningsPeriod);
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const getCODAmount = (order) => {
        if (order.paymentMethod === 'COD' || !order.paymentMethod) {
            return order.totalPrice;
        }
        return 0;
    };

    const handleBottleReturn = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/api/bottle-returns',
                {
                    orderId: selectedOrder._id,
                    customerId: selectedOrder.customerId._id,
                    workerId: user.id,
                    ...bottleReturnForm
                },
                { headers: { 'x-auth-token': token } }
            );
            displayToast('✅ Bottle return recorded!', 'success');
            setShowBottleReturnModal(false);
            setBottleReturnForm({
                bottleSize: '5L',
                quantity: 1,
                returnType: 'empty',
                notes: ''
            });
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleNavigate = (order) => {
        const address = encodeURIComponent(order.deliveryAddress);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handleOptimizedRoute = () => {
        if (todayOrders.length === 0) {
            displayToast('❌ No orders to navigate!', 'warning');
            return;
        }

        const waypoints = todayOrders
            .filter(o => o.status === 'assigned' || o.status === 'in-transit')
            .map(o => encodeURIComponent(o.deliveryAddress))
            .join('|');

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&waypoints=${waypoints}&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');
    };

    const getStatusBadge = (status) => {
        const variants = {
            assigned: 'info',
            'in-transit': 'primary',
            delivered: 'success'
        };
        return <Badge bg={variants[status]} style={{ borderRadius: '8px' }}>{status.toUpperCase()}</Badge>;
    };

    const getPriorityBadge = (order) => {
        const now = new Date();
        const orderDate = new Date(order.createdAt);
        const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

        if (hoursDiff > 3) {
            return <Badge bg="danger" className="pulse" style={{ borderRadius: '8px' }}>URGENT</Badge>;
        } else if (hoursDiff > 1.5) {
            return <Badge bg="warning" style={{ borderRadius: '8px' }}>HIGH</Badge>;
        }
        return <Badge bg="success" style={{ borderRadius: '8px' }}>NORMAL</Badge>;
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
                minHeight: '100vh'
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
                        <h2 style={{
                            fontWeight: '800',
                            color: darkMode ? '#34D399' : '#10B981',
                            fontSize: '2.5rem',
                            letterSpacing: '-1px'
                        }}>
                            🚚 Delivery Dashboard
                        </h2>
                        <p style={{
                            color: getTextColor('secondary'),
                            fontSize: '1.1rem'
                        }}>
                            Welcome, <strong style={{ color: getTextColor('primary') }}>{user?.name}</strong>! Ready for deliveries? 💪
                        </p>
                    </Col>
                    <Col className="text-end">
                        {notifications.length > 0 && (
                            <Button
                                variant="warning"
                                className="me-2 position-relative"
                                onClick={fetchNotifications}
                                style={{ borderRadius: '10px' }}
                            >
                                🔔
                                {notifications.length > 0 && (
                                    <Badge
                                        bg="danger"
                                        pill
                                        className="position-absolute top-0 start-100 translate-middle pulse"
                                    >
                                        {notifications.length}
                                    </Badge>
                                )}
                            </Button>
                        )}

                        <motion.div
                            style={{ display: 'inline-block', marginRight: '12px' }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                className="btn-animated"
                                onClick={handleOptimizedRoute}
                                style={{
                                    background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    color: 'white'
                                }}
                            >
                                🗺️ Optimized Route
                            </Button>
                        </motion.div>

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
                    </Col>
                </Row>
            </motion.div>

            {/* Notifications Alert */}
            {notifications.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Alert
                        className="mb-4"
                        style={{
                            borderRadius: '12px',
                            borderLeft: '4px solid #3B82F6',
                            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                            color: getTextColor('primary')
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong style={{ color: getTextColor('primary') }}>📢 Recent Updates ({notifications.length})</strong>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={handleDismissAllNotifications}
                                style={{
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    color: darkMode ? '#60A5FA' : '#3B82F6'
                                }}
                            >
                                Dismiss All ✕
                            </Button>
                        </div>
                        <ListGroup className="mt-2">
                            {notifications.map(notif => (
                                <ListGroup.Item
                                    key={notif._id}
                                    className="d-flex justify-content-between align-items-center"
                                    style={{
                                        gap: '15px',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        background: darkMode ? '#1E293B' : '#FFFFFF',
                                        border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                        color: getTextColor('primary')
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <strong style={{ color: getTextColor('primary') }}>{notif.title}</strong>
                                        <p className="mb-0 small" style={{ color: getTextColor('secondary') }}>{notif.message}</p>
                                        <small style={{ color: getTextColor('tertiary') }}>
                                            {new Date(notif.createdAt).toLocaleTimeString()}
                                        </small>
                                    </div>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleDismissNotification(notif._id)}
                                        style={{
                                            minWidth: '32px',
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                            borderColor: darkMode ? '#475569' : '#CBD5E1',
                                            color: getTextColor('secondary')
                                        }}
                                    >
                                        ✕
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Alert>
                </motion.div>
            )}

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={2}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card
                            className="text-center border-0 card-hover"
                            style={getCardStyle()}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{
                                    color: darkMode ? '#60A5FA' : '#3B82F6',
                                    fontWeight: '700',
                                    fontSize: '2rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <AnimatedCounter end={todayOrders.length} duration={1.5} />
                                </h3>
                                <p style={{
                                    color: getTextColor('secondary'),
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    Today's Orders
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={2}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card
                            className="text-center border-0 bg-warning text-white card-hover"
                            style={{ borderRadius: '14px' }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                    <AnimatedCounter end={todayOrders.filter(o => o.status === 'assigned').length} duration={1.5} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Pending
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={2}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card
                            className="text-center border-0 bg-primary text-white card-hover"
                            style={{ borderRadius: '14px' }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                    <AnimatedCounter end={todayOrders.filter(o => o.status === 'in-transit').length} duration={1.5} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    In Transit
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={2}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card
                            className="text-center border-0 bg-success text-white card-hover"
                            style={{ borderRadius: '14px' }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                    <AnimatedCounter end={stats.deliveredOrders || 0} duration={1.5} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Delivered
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={2}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card
                            className="text-center border-0 gradient-success card-hover"
                            style={{ borderRadius: '14px', color: 'white' }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                    Rs <AnimatedCounter end={stats.todayEarnings || 0} duration={2} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Today's Earnings
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={2}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card
                            className="text-center border-0 gradient-primary card-hover"
                            style={{ borderRadius: '14px', color: 'white' }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                    Rs <AnimatedCounter end={stats.totalEarnings || 0} duration={2} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Total Earnings
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* COD Summary */}
            <Row className="mb-4">
                <Col>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Alert
                            style={{
                                borderRadius: '14px',
                                borderLeft: '4px solid #10B981',
                                background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                                border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                                color: getTextColor('primary')
                            }}
                        >
                            <Row>
                                <Col md={6}>
                                    <h5 style={{ fontWeight: '700', color: getTextColor('primary') }}>💰 Cash to Collect Today:</h5>
                                    <h3 style={{ fontWeight: '800', color: darkMode ? '#34D399' : '#10B981' }}>
                                        Rs {todayOrders.reduce((sum, o) => sum + getCODAmount(o), 0)}
                                    </h3>
                                </Col>
                                <Col md={6}>
                                    <h5 style={{ fontWeight: '700', color: getTextColor('primary') }}>📦 Orders Breakdown:</h5>
                                    <p className="mb-1" style={{ color: getTextColor('secondary') }}>
                                        <strong>COD Orders:</strong> {todayOrders.filter(o => o.paymentMethod === 'COD' || !o.paymentMethod).length}
                                    </p>
                                    <p className="mb-0" style={{ color: getTextColor('secondary') }}>
                                        <strong>Prepaid Orders:</strong> {todayOrders.filter(o => o.paymentMethod && o.paymentMethod !== 'COD').length}
                                    </p>
                                </Col>
                            </Row>
                        </Alert>
                    </motion.div>
                </Col>
            </Row>

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'orders')}
                className="mb-3"
                style={{ borderBottom: `2px solid ${darkMode ? '#334155' : '#E2E8F0'}` }}
            >
                {/* Orders Tab */}
                <Tab eventKey="orders" title="📋 Today's Orders">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            className="border-0 mb-4"
                            style={getCardStyle()}
                        >
                            <Card.Header
                                className="d-flex justify-content-between align-items-center"
                                style={getCardHeaderStyle()}
                            >
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>📋 Today's Delivery Queue</h5>
                                <div>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={fetchTodayOrders}
                                        className="me-2"
                                        style={{
                                            borderRadius: '8px',
                                            borderColor: darkMode ? '#60A5FA' : '#3B82F6',
                                            color: darkMode ? '#60A5FA' : '#3B82F6'
                                        }}
                                    >
                                        🔄 Refresh
                                    </Button>
                                    <Badge bg="info" style={{ fontSize: '1rem', borderRadius: '8px' }}>
                                        {todayOrders.length} orders
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {todayOrders.length === 0 ? (
                                    <Alert
                                        className="text-center"
                                        style={{
                                            borderRadius: '12px',
                                            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                                            color: getTextColor('primary')
                                        }}
                                    >
                                        <h5 style={{ color: getTextColor('primary') }}>No orders assigned for today! 🎉</h5>
                                        <p style={{ color: getTextColor('secondary') }}>Check back later or contact admin if you expect orders.</p>
                                    </Alert>
                                ) : (
                                    <Table responsive hover>
                                        <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                            <tr>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Priority</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Order ID</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Customer</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Phone</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Time Slot</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Address</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Items</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Payment</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>COD Amount</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Status</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todayOrders.map(order => (
                                                <tr
                                                    key={order._id}
                                                    style={{
                                                        borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                                        background: order.status === 'assigned'
                                                            ? (darkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.05)')
                                                            : 'transparent'
                                                    }}
                                                >
                                                    <td>{getPriorityBadge(order)}</td>
                                                    <td>
                                                        <Badge bg="secondary" style={{ borderRadius: '8px' }}>
                                                            #{order._id.slice(-6)}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <strong style={{ color: getTextColor('primary') }}>{order.customerId?.name}</strong>
                                                    </td>
                                                    <td>
                                                        <a
                                                            href={`tel:${order.customerId?.phone}`}
                                                            className="btn btn-sm btn-outline-primary"
                                                            style={{ borderRadius: '8px' }}
                                                        >
                                                            📞 {order.customerId?.phone}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <Badge bg="info" style={{ borderRadius: '8px' }}>
                                                            {getTimeSlotDisplay(order.timeSlot)}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <small style={{ color: getTextColor('secondary') }}>{order.deliveryAddress}</small>
                                                        <br />
                                                        <Button
                                                            size="sm"
                                                            variant="link"
                                                            className="p-0"
                                                            onClick={() => handleNavigate(order)}
                                                            style={{
                                                                fontSize: '0.85rem',
                                                                color: darkMode ? '#60A5FA' : '#3B82F6'
                                                            }}
                                                        >
                                                            🗺️ Navigate
                                                        </Button>
                                                    </td>
                                                    <td style={{ color: getTextColor('primary') }}>
                                                        {order.items.map(item => (
                                                            <div key={item._id}>
                                                                {item.quantity}x {item.bottleSize}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <Badge bg={order.paymentMethod === 'COD' ? 'warning' : 'success'} style={{ borderRadius: '8px' }}>
                                                            {order.paymentMethod || 'COD'}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        {getCODAmount(order) > 0 ? (
                                                            <strong style={{ color: '#EF4444' }}>
                                                                Rs {getCODAmount(order)}
                                                            </strong>
                                                        ) : (
                                                            <span style={{ color: '#10B981' }}>Paid</span>
                                                        )}
                                                    </td>
                                                    <td>{getStatusBadge(order.status)}</td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline-info"
                                                                onClick={() => handleViewDetails(order)}
                                                                style={{ borderRadius: '8px' }}
                                                            >
                                                                👤 Details
                                                            </Button>

                                                            {order.status === 'assigned' && (
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="primary"
                                                                        className="w-100 btn-animated"
                                                                        onClick={() => handleStartDelivery(order._id)}
                                                                        style={{ borderRadius: '8px' }}
                                                                    >
                                                                        🚀 Start
                                                                    </Button>
                                                                </motion.div>
                                                            )}

                                                            {order.status === 'in-transit' && (
                                                                <>
                                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="success"
                                                                            className="w-100 btn-animated"
                                                                            onClick={() => handleMarkDelivered(order._id)}
                                                                            style={{ borderRadius: '8px' }}
                                                                        >
                                                                            ✅ Delivered
                                                                        </Button>
                                                                    </motion.div>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-warning"
                                                                        onClick={() => {
                                                                            setSelectedOrder(order);
                                                                            setShowBottleReturnModal(true);
                                                                        }}
                                                                        style={{ borderRadius: '8px' }}
                                                                    >
                                                                        🔄 Return
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                {/* Earnings Tab */}
                <Tab eventKey="earnings" title="💰 Earnings">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Row className="mb-4">
                            <Col md={4}>
                                <Card className="border-0" style={getCardStyle()}>
                                    <Card.Body>
                                        <h6 style={{ color: getTextColor('secondary'), fontWeight: '600' }}>Selected Period</h6>
                                        <h4 className="mb-2 text-capitalize" style={{ fontWeight: '700', color: getTextColor('primary') }}>
                                            {earnings.period === 'today' ? 'Today' :
                                                earnings.period === 'week' ? 'Last 7 Days' :
                                                    earnings.period === 'month' ? 'Last 30 Days' : 'All Time'}
                                        </h4>
                                        <p className="mb-1" style={{ color: getTextColor('primary') }}>
                                            <strong>Bottles Delivered:</strong> <AnimatedCounter end={earnings.totalBottles || 0} duration={2} />
                                        </p>
                                        <p className="mb-0" style={{ color: getTextColor('primary') }}>
                                            <strong>Earnings:</strong> Rs <AnimatedCounter end={earnings.totalEarnings || 0} duration={2} />
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={8}>
                                <Card className="border-0" style={getCardStyle()}>
                                    <Card.Body>
                                        <h6 className="mb-3" style={{ color: getTextColor('secondary'), fontWeight: '600' }}>Quick Filters</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {['today', 'week', 'month', 'all'].map((period, index) => (
                                                <motion.div
                                                    key={period}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant={earningsPeriod === period ? 'primary' : 'outline-primary'}
                                                        onClick={() => fetchEarnings(period)}
                                                        className="btn-animated"
                                                        style={{
                                                            borderRadius: '10px',
                                                            fontWeight: '600',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    >
                                                        {period === 'today' ? 'Today' :
                                                            period === 'week' ? 'Last 7 Days' :
                                                                period === 'month' ? 'Last 30 Days' : 'All Time'}
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Card className="border-0" style={getCardStyle()}>
                            <Card.Header
                                className="d-flex justify-content-between align-items-center"
                                style={getCardHeaderStyle()}
                            >
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>Earnings Breakdown</h5>
                                {loadingEarnings && (
                                    <span style={{ fontSize: '0.9rem', color: getTextColor('secondary') }}>
                                        Loading...
                                    </span>
                                )}
                            </Card.Header>
                            <Card.Body>
                                {earnings.breakdown && earnings.breakdown.length > 0 ? (
                                    <Table responsive hover>
                                        <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                            <tr>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Date</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Order ID</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Bottles</th>
                                                <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Earnings (Rs)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {earnings.breakdown.map((row, index) => (
                                                <motion.tr
                                                    key={row.orderId}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    style={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}` }}
                                                >
                                                    <td style={{ color: getTextColor('primary') }}>
                                                        {row.date ? new Date(row.date).toLocaleString() : '-'}
                                                    </td>
                                                    <td>
                                                        <Badge bg="secondary" style={{ borderRadius: '8px' }}>
                                                            #{row.orderId.slice(-6)}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ color: getTextColor('primary') }}>{row.bottles}</td>
                                                    <td>
                                                        <strong style={{ color: '#10B981' }}>{row.earnings}</strong>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Alert
                                        className="mb-0"
                                        style={{
                                            borderRadius: '12px',
                                            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                                            color: getTextColor('primary')
                                        }}
                                    >
                                        No delivered orders in this period yet.
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                {/* History Tab */}
                <Tab eventKey="history" title="📜 History">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-0" style={getCardStyle()}>
                            <Card.Header style={getCardHeaderStyle()}>
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>📜 Delivery History</h5>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover>
                                    <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                        <tr>
                                            <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Date</th>
                                            <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Order ID</th>
                                            <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Customer</th>
                                            <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Amount</th>
                                            <th style={{ color: getTextColor('secondary'), fontSize: '0.85rem', fontWeight: '600' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allOrders
                                            .filter(o => o.status === 'delivered')
                                            .slice(0, 10)
                                            .map((order, index) => (
                                                <motion.tr
                                                    key={order._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    style={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}` }}
                                                >
                                                    <td style={{ color: getTextColor('primary') }}>
                                                        {new Date(order.deliveredAt || order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <Badge bg="secondary" style={{ borderRadius: '8px' }}>
                                                            #{order._id.slice(-6)}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ color: getTextColor('primary') }}>{order.customerId?.name}</td>
                                                    <td><strong style={{ color: getTextColor('primary') }}>Rs {order.totalPrice}</strong></td>
                                                    <td>{getStatusBadge(order.status)}</td>
                                                </motion.tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>
            </Tabs>

            {/* Customer Details Modal */}
            <Modal
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
                size="lg"
                centered
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
                    <Modal.Title style={{ fontWeight: '700' }}>👤 Customer & Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem', background: darkMode ? '#0F172A' : '#FFFFFF' }}>
                    {selectedOrder && (
                        <>
                            <h5 style={{ fontWeight: '700', marginBottom: '1rem', color: getTextColor('primary') }}>Customer Information</h5>
                            <Table bordered style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <tbody>
                                    <tr style={{ background: darkMode ? '#1E293B' : '#F8FAFC' }}>
                                        <th style={{ width: '40%', fontWeight: '600', color: getTextColor('primary') }}>Name:</th>
                                        <td style={{ color: getTextColor('primary') }}>{selectedOrder.customerDetails?.customer.name}</td>
                                    </tr>
                                    <tr style={{ background: darkMode ? '#1E293B' : '#F8FAFC' }}>
                                        <th style={{ fontWeight: '600', color: getTextColor('primary') }}>Phone:</th>
                                        <td>
                                            <a
                                                href={`tel:${selectedOrder.customerDetails?.customer.phone}`}
                                                className="btn btn-sm btn-primary"
                                                style={{ borderRadius: '8px' }}
                                            >
                                                📞 Call: {selectedOrder.customerDetails?.customer.phone}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr style={{ background: darkMode ? '#1E293B' : '#F8FAFC' }}>
                                        <th style={{ fontWeight: '600', color: getTextColor('primary') }}>Email:</th>
                                        <td style={{ color: getTextColor('primary') }}>{selectedOrder.customerDetails?.customer.email}</td>
                                    </tr>
                                    <tr style={{ background: darkMode ? '#1E293B' : '#F8FAFC' }}>
                                        <th style={{ fontWeight: '600', color: getTextColor('primary') }}>Delivery Address:</th>
                                        <td>
                                            <span style={{ color: getTextColor('primary') }}>{selectedOrder.customerDetails?.deliveryAddress}</span>
                                            <br />
                                            <motion.div
                                                style={{ display: 'inline-block', marginTop: '8px' }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="btn-animated"
                                                    onClick={() => handleNavigate(selectedOrder)}
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    🗺️ Open in Google Maps
                                                </Button>
                                            </motion.div>
                                        </td>
                                    </tr>
                                    <tr style={{ background: darkMode ? '#1E293B' : '#F8FAFC' }}>
                                        <th style={{ fontWeight: '600', color: getTextColor('primary') }}>Preferred Time:</th>
                                        <td>
                                            <Badge bg="info" style={{ fontSize: '1rem', borderRadius: '8px' }}>
                                                {getTimeSlotDisplay(selectedOrder.timeSlot)}
                                            </Badge>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                            <h5 className="mt-4" style={{ fontWeight: '700', marginBottom: '1rem', color: getTextColor('primary') }}>Order Items</h5>
                            <Table bordered style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ color: getTextColor('primary') }}>Bottle Size</th>
                                        <th style={{ color: getTextColor('primary') }}>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.customerDetails?.items.map((item, idx) => (
                                        <tr key={idx} style={{ background: darkMode ? '#1E293B' : '#FFFFFF' }}>
                                            <td><strong style={{ color: getTextColor('primary') }}>{item.bottleSize}</strong></td>
                                            <td style={{ color: getTextColor('primary') }}>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <Alert
                                variant="warning"
                                style={{
                                    borderRadius: '12px',
                                    borderLeft: '4px solid #F59E0B',
                                    background: darkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
                                    border: `1px solid ${darkMode ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)'}`,
                                    color: getTextColor('primary')
                                }}
                            >
                                <strong>💰 Payment Method:</strong> {selectedOrder.paymentMethod || 'COD'}
                                <br />
                                {getCODAmount(selectedOrder) > 0 && (
                                    <strong style={{ color: '#DC2626' }}>
                                        Amount to Collect: Rs {getCODAmount(selectedOrder)}
                                    </strong>
                                )}
                            </Alert>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {/* Bottle Return Modal */}
            <Modal
                show={showBottleReturnModal}
                onHide={() => setShowBottleReturnModal(false)}
                centered
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: darkMode ? '#1E293B' : 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                        color: 'white',
                        borderRadius: '16px 16px 0 0',
                        borderBottom: 'none'
                    }}
                >
                    <Modal.Title style={{ fontWeight: '700' }}>🔄 Record Bottle Return</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem', background: darkMode ? '#0F172A' : '#FFFFFF' }}>
                    <Form onSubmit={handleBottleReturn}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Bottle Size</Form.Label>
                            <Form.Control
                                as="select"
                                value={bottleReturnForm.bottleSize}
                                onChange={e =>
                                    setBottleReturnForm({ ...bottleReturnForm, bottleSize: e.target.value })
                                }
                                style={{
                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                    color: getTextColor('primary'),
                                    border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`
                                }}
                            >
                                <option value="5L">5 Liters</option>
                                <option value="10L">10 Liters</option>
                                <option value="20L">20 Liters</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={bottleReturnForm.quantity}
                                onChange={e =>
                                    setBottleReturnForm({ ...bottleReturnForm, quantity: parseInt(e.target.value) })
                                }
                                style={{
                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                    color: getTextColor('primary'),
                                    border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Return Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={bottleReturnForm.returnType}
                                onChange={e =>
                                    setBottleReturnForm({ ...bottleReturnForm, returnType: e.target.value })
                                }
                                style={{
                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                    color: getTextColor('primary'),
                                    border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`
                                }}
                            >
                                <option value="empty">Empty Bottle (Good Condition)</option>
                                <option value="damaged">Damaged Bottle</option>
                                <option value="rejected">Rejected by Customer</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Notes (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={bottleReturnForm.notes}
                                onChange={e =>
                                    setBottleReturnForm({ ...bottleReturnForm, notes: e.target.value })
                                }
                                placeholder="Any additional notes..."
                                style={{
                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                    color: getTextColor('primary'),
                                    border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`
                                }}
                            />
                        </Form.Group>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                className="w-100 btn-animated"
                                style={{
                                    background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    padding: '0.9rem'
                                }}
                            >
                                🔄 Record Return
                            </Button>
                        </motion.div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Toast Notifications */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    show={showToastNotif}
                    onClose={() => setShowToastNotif(false)}
                    bg={toastType}
                    style={{
                        background: darkMode ? '#1E293B' : '#FFFFFF',
                        color: getTextColor('primary')
                    }}
                >
                    <Toast.Header style={{ background: darkMode ? '#334155' : '#F8FAFC' }}>
                        <strong className="me-auto" style={{ color: getTextColor('primary') }}>🔔 Delivery Alert</strong>
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

export default CompleteWorkerDashboard;

