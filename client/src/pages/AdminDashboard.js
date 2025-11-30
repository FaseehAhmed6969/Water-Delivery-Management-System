import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { getAllOrders, getDashboard, assignOrder } from '../services/api';

function AdminDashboard() {
    const { user, logoutUser } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchDashboard();
        fetchOrders();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await getDashboard();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
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
        return <Badge bg={variants[status]}>{status}</Badge>;
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Admin Dashboard</h2>
                    <p className="text-muted">Welcome, {user?.name}</p>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-danger" onClick={logoutUser}>Logout</Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h3>{stats.orders?.total || 0}</h3>
                            <p className="text-muted">Total Orders</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center bg-warning text-white">
                        <Card.Body>
                            <h3>{stats.orders?.pending || 0}</h3>
                            <p>Pending Orders</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center bg-success text-white">
                        <Card.Body>
                            <h3>{stats.orders?.delivered || 0}</h3>
                            <p>Delivered</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center bg-primary text-white">
                        <Card.Body>
                            <h3>₹{stats.revenue || 0}</h3>
                            <p>Total Revenue</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header>
                    <h4>All Orders</h4>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id.slice(-6)}</td>
                                    <td>{order.customerId?.name || 'N/A'}</td>
                                    <td>
                                        {order.items.map(item => `${item.quantity}x ${item.bottleSize}`).join(', ')}
                                    </td>
                                    <td>₹{order.totalPrice}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Button size="sm" variant="outline-primary">View</Button>
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

export default AdminDashboard;
