import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { getTodayOrders, updateOrderStatus, getWorkerStats } from '../services/api';

function WorkerDashboard() {
    const { user, logoutUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getTodayOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getWorkerStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            alert('Order status updated!');
            fetchOrders();
            fetchStats();
        } catch (error) {
            alert('Error updating status: ' + (error.response?.data?.msg || error.message));
        }
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Worker Dashboard</h2>
                    <p className="text-muted">Welcome, {user?.name}</p>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-danger" onClick={logoutUser}>Logout</Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <h3>{stats.totalOrders || 0}</h3>
                            <p className="text-muted">Total Orders</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center bg-success text-white">
                        <Card.Body>
                            <h3>{stats.deliveredOrders || 0}</h3>
                            <p>Delivered</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center bg-warning text-white">
                        <Card.Body>
                            <h3>{stats.pendingOrders || 0}</h3>
                            <p>Pending</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header>
                    <h4>Today's Deliveries</h4>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Items</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id.slice(-6)}</td>
                                    <td>{order.customerId?.name}</td>
                                    <td>{order.customerId?.phone}</td>
                                    <td>{order.deliveryAddress}</td>
                                    <td>
                                        {order.items.map(item => `${item.quantity}x ${item.bottleSize}`).join(', ')}
                                    </td>
                                    <td>
                                        <Badge bg={order.status === 'assigned' ? 'info' : 'primary'}>
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {order.status === 'assigned' && (
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleStatusUpdate(order._id, 'in-transit')}
                                            >
                                                Start Delivery
                                            </Button>
                                        )}
                                        {order.status === 'in-transit' && (
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                            >
                                                Mark Delivered
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default WorkerDashboard;
