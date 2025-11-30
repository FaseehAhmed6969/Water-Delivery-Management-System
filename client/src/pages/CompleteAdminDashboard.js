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
    Tabs,
    Tab,
    Toast,
    ToastContainer
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { requestNotificationPermission, showBrowserNotification } from '../services/notificationService';
import AdminAnalytics from '../components/AdminAnalytics';
import AnimatedCounter from '../components/AnimatedCounter';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/animations.css';
import '../styles/theme.css';

function CompleteAdminDashboard() {
    const { user, logoutUser } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [activeTab, setActiveTab] = useState('orders');
    const [orderingPaused, setOrderingPaused] = useState(false);

    // Notification states
    const [notificationPermission, setNotificationPermission] = useState(false);
    const [showToastNotif, setShowToastNotif] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');

    const [assignForm, setAssignForm] = useState({
        orderId: '',
        workerId: ''
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
        fetchOrders();
        fetchCustomers();
        fetchWorkers();
        fetchStats();
        fetchOrderingStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            checkPendingOrders();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const checkPendingOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/orders', {
                headers: { 'x-auth-token': token }
            });

            const pendingOrders = response.data.filter(o => o.status === 'pending');

            if (pendingOrders.length > 5 && notificationPermission) {
                showBrowserNotification('⚠️ Pending Orders Alert', {
                    body: `${pendingOrders.length} orders waiting for assignment!`,
                    icon: '/logo192.png'
                });
            }
        } catch (error) {
            console.error('Error checking pending orders:', error);
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
            const response = await axios.get('http://localhost:5000/api/admin/orders', {
                headers: { 'x-auth-token': token }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/customers', {
                headers: { 'x-auth-token': token }
            });
            setCustomers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchWorkers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/workers', {
                headers: { 'x-auth-token': token }
            });
            setWorkers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/stats', {
                headers: { 'x-auth-token': token }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchOrderingStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/ordering-status', {
                headers: { 'x-auth-token': token }
            });
            setOrderingPaused(response.data.paused || false);
        } catch (error) {
            console.error('Error fetching ordering status:', error);
            // If endpoint doesn't exist yet, default to false
            setOrderingPaused(false);
        }
    };


    const handleAssignOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:5000/api/admin/orders/${assignForm.orderId}/assign`,
                { workerId: assignForm.workerId },
                { headers: { 'x-auth-token': token } }
            );
            displayToast('✅ Order assigned successfully!', 'success');
            setShowAssignModal(false);
            fetchOrders();
            fetchStats();
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleAutoAssign = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/admin/orders/auto-assign',
                {},
                { headers: { 'x-auth-token': token } }
            );
            displayToast('✅ Orders auto-assigned successfully!', 'success');
            fetchOrders();
            fetchStats();
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`, {
                    headers: { 'x-auth-token': token }
                });
                displayToast('✅ Order deleted successfully!', 'success');
                fetchOrders();
                fetchStats();
            } catch (error) {
                displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
            }
        }
    };

    const handleToggleOrdering = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/admin/toggle-ordering',
                { paused: !orderingPaused },
                { headers: { 'x-auth-token': token } }
            );
            setOrderingPaused(!orderingPaused);
            displayToast(
                orderingPaused ? '✅ Ordering resumed!' : '⏸️ Ordering paused!',
                orderingPaused ? 'success' : 'warning'
            );
        } catch (error) {
            displayToast('❌ Error: ' + (error.response?.data?.msg || error.message), 'danger');
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
                            color: darkMode ? '#A78BFA' : '#7C3AED',
                            fontSize: '2.5rem',
                            letterSpacing: '-1px'
                        }}>
                            👨‍💼 Admin Control Center
                        </h2>
                        <p style={{
                            color: getTextColor('secondary'),
                            fontSize: '1.1rem'
                        }}>
                            Welcome, <strong style={{ color: getTextColor('primary') }}>{user?.name}</strong>! Manage your water delivery empire 🚀
                        </p>
                    </Col>
                    <Col className="text-end">
                        {orders.filter(o => o.status === 'pending').length > 0 && (
                            <Button
                                variant="danger"
                                className="me-2 position-relative pulse"
                                onClick={() => setActiveTab('orders')}
                                style={{ borderRadius: '10px', fontWeight: '600' }}
                            >
                                ⚠️ {orders.filter(o => o.status === 'pending').length} Pending
                            </Button>
                        )}

                        <Button
                            variant={orderingPaused ? 'success' : 'warning'}
                            className="me-2"
                            onClick={handleToggleOrdering}
                            style={{ borderRadius: '10px', fontWeight: '600' }}
                        >
                            {orderingPaused ? '▶️ Resume Orders' : '⏸️ Pause Orders'}
                        </Button>

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

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={3}>
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
                                    <AnimatedCounter end={stats.orders?.total || 0} duration={2} />
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
                                    <AnimatedCounter end={stats.orders?.pending || 0} duration={2} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Pending Orders
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={3}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card
                            className="text-center border-0 bg-success text-white card-hover"
                            style={{ borderRadius: '14px' }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                    <AnimatedCounter end={stats.orders?.delivered || 0} duration={2} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Delivered
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={3}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card
                            className="text-center border-0 gradient-primary card-hover"
                            style={{ borderRadius: '14px', color: 'white' }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                    ₹<AnimatedCounter end={stats.revenue || 0} duration={2.5} />
                                </h3>
                                <p style={{ marginBottom: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Total Revenue
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* Secondary Stats */}
            <Row className="mb-4">
                <Col md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card
                            className="text-center border-0 card-hover"
                            style={{
                                borderRadius: '14px',
                                background: darkMode
                                    ? 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)'
                                    : '#FFFFFF',
                                color: darkMode ? 'white' : undefined,
                                boxShadow: darkMode
                                    ? '0 4px 15px rgba(16, 185, 129, 0.3)'
                                    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                border: darkMode ? 'none' : `1px solid ${getTextColor('secondary') === '#64748B' ? '#E2E8F0' : '#334155'}`
                            }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h4 style={{
                                    fontWeight: '700',
                                    fontSize: '1.75rem',
                                    marginBottom: '0.5rem',
                                    color: darkMode ? 'white' : '#10B981'
                                }}>
                                    <AnimatedCounter end={customers.length} duration={2} />
                                </h4>
                                <p style={{
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    color: darkMode ? 'white' : getTextColor('secondary')
                                }}>
                                    Total Customers
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card
                            className="text-center border-0 card-hover"
                            style={{
                                borderRadius: '14px',
                                background: darkMode
                                    ? 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)'
                                    : '#FFFFFF',
                                color: darkMode ? 'white' : undefined,
                                boxShadow: darkMode
                                    ? '0 4px 15px rgba(6, 182, 212, 0.3)'
                                    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                border: darkMode ? 'none' : `1px solid ${getTextColor('secondary') === '#64748B' ? '#E2E8F0' : '#334155'}`
                            }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h4 style={{
                                    fontWeight: '700',
                                    fontSize: '1.75rem',
                                    marginBottom: '0.5rem',
                                    color: darkMode ? 'white' : '#06B6D4'
                                }}>
                                    <AnimatedCounter end={workers.length} duration={2} />
                                </h4>
                                <p style={{
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    color: darkMode ? 'white' : getTextColor('secondary')
                                }}>
                                    Active Workers
                                </p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col md={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Card
                            className="text-center border-0 card-hover"
                            style={{
                                borderRadius: '14px',
                                background: darkMode
                                    ? '#FFA500'
                                    : '#FFFFFF',
                                color: darkMode ? 'white' : undefined,
                                boxShadow: darkMode
                                    ? '0 4px 15px rgba(255, 165, 0, 0.3)'
                                    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                border: darkMode ? 'none' : `1px solid ${getTextColor('secondary') === '#64748B' ? '#E2E8F0' : '#334155'}`
                            }}
                        >
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h4 style={{
                                    fontWeight: '700',
                                    fontSize: '1.75rem',
                                    marginBottom: '0.5rem',
                                    color: darkMode ? 'white' : '#F59E0B'
                                }}>
                                    ₹<AnimatedCounter end={stats.todayRevenue || 0} duration={2} />
                                </h4>
                                <p style={{
                                    marginBottom: 0,
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    color: darkMode ? 'white' : getTextColor('secondary')
                                }}>
                                    Today's Revenue
                                </p>
                            </Card.Body>
                        </Card>
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
                <Tab eventKey="orders" title="📦 Orders">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-0 mb-4" style={getCardStyle()}>
                            <Card.Header
                                className="d-flex justify-content-between align-items-center"
                                style={getCardHeaderStyle()}
                            >
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>📦 All Orders</h5>
                                <div>
                                    <motion.div
                                        style={{ display: 'inline-block', marginRight: '12px' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="primary"
                                            onClick={handleAutoAssign}
                                            className="btn-animated"
                                            style={{
                                                borderRadius: '10px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            🤖 Auto-Assign All
                                        </Button>
                                    </motion.div>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={fetchOrders}
                                        style={{
                                            borderRadius: '8px',
                                            borderColor: darkMode ? '#60A5FA' : '#3B82F6',
                                            color: darkMode ? '#60A5FA' : '#3B82F6'
                                        }}
                                    >
                                        🔄 Refresh
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                    <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                        <tr>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Order ID</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Customer</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Items</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Amount</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Worker</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Status</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Date</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => (
                                            <motion.tr
                                                key={order._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                style={{
                                                    borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                                    color: darkMode ? '#F8FAFC' : '#0F172A'
                                                }}
                                            >
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    <Badge
                                                        bg="secondary"
                                                        style={{
                                                            borderRadius: '8px',
                                                            background: '#64748B',
                                                            color: '#FFFFFF'
                                                        }}
                                                    >
                                                        #{order._id.slice(-6)}
                                                    </Badge>
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    <strong style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                        {order.customerId?.name || 'N/A'}
                                                    </strong>
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {order.items.map(item => `${item.quantity}x ${item.bottleSize}`).join(', ')}
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    <strong style={{ color: darkMode ? '#34D399' : '#10B981' }}>
                                                        ₹{order.totalPrice}
                                                    </strong>
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {order.workerId?.name || 'Unassigned'}
                                                </td>
                                                <td>{getStatusBadge(order.status)}</td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        {order.status === 'pending' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                onClick={() => {
                                                                    setAssignForm({ ...assignForm, orderId: order._id });
                                                                    setShowAssignModal(true);
                                                                }}
                                                                style={{ borderRadius: '8px' }}
                                                            >
                                                                👤 Assign
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => handleDeleteOrder(order._id)}
                                                            style={{ borderRadius: '8px' }}
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </Table>



                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                {/* Customers Tab */}
                <Tab eventKey="customers" title="👥 Customers">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-0" style={getCardStyle()}>
                            <Card.Header style={getCardHeaderStyle()}>
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>👥 Customer Directory</h5>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                    <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                        <tr>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Name</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Email</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Phone</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Loyalty Points</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Total Orders</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((customer, index) => (
                                            <motion.tr
                                                key={customer._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                style={{
                                                    borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                                    color: darkMode ? '#F8FAFC' : '#0F172A'
                                                }}
                                            >
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    <strong style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                        {customer.name}
                                                    </strong>
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {customer.email}
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {customer.phone}
                                                </td>
                                                <td>
                                                    <Badge bg="warning" style={{ borderRadius: '8px', color: '#000000' }}>
                                                        🎁 {customer.loyaltyPoints || 0}
                                                    </Badge>
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    <strong>{customer.totalOrders || 0}</strong>
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {new Date(customer.createdAt).toLocaleDateString()}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </Table>

                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                {/* Workers Tab */}
                <Tab eventKey="workers" title="🚚 Workers">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-0" style={getCardStyle()}>
                            <Card.Header style={getCardHeaderStyle()}>
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>🚚 Delivery Workers</h5>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                    <thead style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                                        <tr>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Name</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Email</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Phone</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Current Orders</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Completed</th>
                                            <th style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workers.map((worker, index) => (
                                            <motion.tr
                                                key={worker._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                style={{
                                                    borderBottom: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                                    color: darkMode ? '#F8FAFC' : '#0F172A'
                                                }}
                                            >
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    <strong style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                        {worker.name}
                                                    </strong>
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {worker.email}
                                                </td>
                                                <td style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                                                    {worker.phone}
                                                </td>
                                                <td>
                                                    <Badge bg="primary" style={{ borderRadius: '8px' }}>
                                                        {worker.currentOrders || 0}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg="success" style={{ borderRadius: '8px' }}>
                                                        {worker.completedOrders || 0}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg="success" style={{ borderRadius: '8px' }}>
                                                        Active
                                                    </Badge>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </Table>


                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                {/* Reports Tab */}
                <Tab eventKey="reports" title="📈 Reports">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-0" style={getCardStyle()}>
                            <Card.Header style={getCardHeaderStyle()}>
                                <h5 className="mb-0" style={{ fontWeight: '700' }}>📈 Generate & Export Reports</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                            <Card
                                                className="mb-3 border-primary"
                                                style={{
                                                    borderRadius: '14px',
                                                    borderWidth: '2px',
                                                    background: darkMode ? '#1E293B' : '#FFFFFF'
                                                }}
                                            >
                                                <Card.Body className="text-center">
                                                    <h6 className="mb-3" style={{ fontWeight: '700', color: getTextColor('primary') }}>📅 Daily Report</h6>
                                                    <p style={{ fontSize: '0.9rem', color: getTextColor('secondary') }}>Complete daily orders summary with revenue breakdown</p>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            variant="primary"
                                                            className="btn-animated"
                                                            onClick={() => {
                                                                try {
                                                                    const { generateDailyReport } = require('../services/reportService');
                                                                    generateDailyReport(orders, stats.revenue || 0);
                                                                    displayToast('✅ Daily report downloaded!', 'success');
                                                                } catch (error) {
                                                                    displayToast('❌ Report service not available', 'danger');
                                                                }
                                                            }}
                                                            style={{
                                                                borderRadius: '10px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            📄 Download PDF
                                                        </Button>
                                                    </motion.div>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>
                                    <Col md={4}>
                                        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                            <Card
                                                className="mb-3 border-success"
                                                style={{
                                                    borderRadius: '14px',
                                                    borderWidth: '2px',
                                                    background: darkMode ? '#1E293B' : '#FFFFFF'
                                                }}
                                            >
                                                <Card.Body className="text-center">
                                                    <h6 className="mb-3" style={{ fontWeight: '700', color: getTextColor('primary') }}>📊 Monthly Report</h6>
                                                    <p style={{ fontSize: '0.9rem', color: getTextColor('secondary') }}>Monthly performance analysis with trends</p>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            variant="success"
                                                            className="btn-animated"
                                                            onClick={() => {
                                                                try {
                                                                    const { generateMonthlyReport } = require('../services/reportService');
                                                                    const endDate = new Date().toISOString().split('T')[0];
                                                                    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                                                                    generateMonthlyReport(orders, stats.revenue || 0, startDate, endDate);
                                                                    displayToast('✅ Monthly report downloaded!', 'success');
                                                                } catch (error) {
                                                                    displayToast('❌ Report service not available', 'danger');
                                                                }
                                                            }}
                                                            style={{
                                                                borderRadius: '10px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            📄 Download PDF
                                                        </Button>
                                                    </motion.div>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>
                                    <Col md={4}>
                                        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                            <Card
                                                className="mb-3 border-info"
                                                style={{
                                                    borderRadius: '14px',
                                                    borderWidth: '2px',
                                                    background: darkMode ? '#1E293B' : '#FFFFFF'
                                                }}
                                            >
                                                <Card.Body className="text-center">
                                                    <h6 className="mb-3" style={{ fontWeight: '700', color: getTextColor('primary') }}>📋 Orders Export</h6>
                                                    <p style={{ fontSize: '0.9rem', color: getTextColor('secondary') }}>Export all orders to Excel-compatible CSV</p>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            variant="info"
                                                            className="btn-animated"
                                                            onClick={() => {
                                                                try {
                                                                    const { exportOrdersToCSV } = require('../services/reportService');
                                                                    exportOrdersToCSV(orders);
                                                                    displayToast('✅ Orders exported to CSV!', 'success');
                                                                } catch (error) {
                                                                    displayToast('❌ Report service not available', 'danger');
                                                                }
                                                            }}
                                                            style={{
                                                                borderRadius: '10px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            📊 Download CSV
                                                        </Button>
                                                    </motion.div>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>
                                </Row>

                                <Alert
                                    className="mt-4"
                                    style={{
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #3B82F6',
                                        background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                        border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                                        color: getTextColor('primary')
                                    }}
                                >
                                    <strong>📌 Quick Tips:</strong><br />
                                    <span style={{ color: getTextColor('secondary') }}>
                                        • PDF reports are formatted for printing<br />
                                        • CSV files can be opened in Excel/Google Sheets<br />
                                        • All reports include current date/time stamp<br />
                                        • Data is filtered based on selected date range
                                    </span>
                                </Alert>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Tab>

                {/* Analytics Tab */}
                <Tab eventKey="analytics" title="📊 Analytics">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AdminAnalytics darkMode={darkMode} />
                    </motion.div>
                </Tab>
            </Tabs>

            {/* Assign Order Modal */}
            <Modal
                show={showAssignModal}
                onHide={() => setShowAssignModal(false)}
                centered
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: darkMode ? '#1E293B' : 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                        color: 'white',
                        borderRadius: '16px 16px 0 0',
                        borderBottom: 'none'
                    }}
                >
                    <Modal.Title style={{ fontWeight: '700' }}>👤 Assign Order to Worker</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem', background: darkMode ? '#0F172A' : '#FFFFFF' }}>
                    <Form onSubmit={handleAssignOrder}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: '600', color: getTextColor('primary') }}>Select Worker</Form.Label>
                            <Form.Control
                                as="select"
                                value={assignForm.workerId}
                                onChange={(e) => setAssignForm({ ...assignForm, workerId: e.target.value })}
                                required
                                style={{
                                    background: darkMode ? '#1E293B' : '#FFFFFF',
                                    color: getTextColor('primary'),
                                    border: `1.5px solid ${darkMode ? '#334155' : '#E2E8F0'}`
                                }}
                            >
                                <option value="">Choose a worker...</option>
                                {workers.map(worker => (
                                    <option key={worker._id} value={worker._id}>
                                        {worker.name} - {worker.currentOrders || 0} current orders
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                className="w-100 btn-animated"
                                style={{
                                    background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    padding: '0.9rem'
                                }}
                            >
                                ✅ Assign Order
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
                        <strong className="me-auto" style={{ color: getTextColor('primary') }}>🔔 Admin Alert</strong>
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

export default CompleteAdminDashboard;

