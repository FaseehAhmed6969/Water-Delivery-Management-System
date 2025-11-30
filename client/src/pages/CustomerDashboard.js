import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { createOrder, getMyOrders, getLoyaltyPoints, submitRating } from '../services/api';

function CustomerDashboard() {
    const { user, logoutUser } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [orders, setOrders] = useState([]);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // ✅ UPDATED: Added timeSlot field
    const [orderForm, setOrderForm] = useState({
        bottleSize: '5L',
        quantity: 1,
        deliveryAddress: user?.address || '',
        timeSlot: 'anytime'  // ✅ NEW
    });

    const [ratingForm, setRatingForm] = useState({
        rating: 5,
        feedback: '',
        deliverySpeed: 5,
        productQuality: 5
    });

    useEffect(() => {
        fetchOrders();
        fetchLoyaltyPoints();
    }, []);

    useEffect(() => {
        console.log('Customer Dashboard darkMode:', darkMode);
    }, [darkMode]);

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

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOrder({
                items: [{ bottleSize: orderForm.bottleSize, quantity: parseInt(orderForm.quantity) }],
                deliveryAddress: orderForm.deliveryAddress,
                timeSlot: orderForm.timeSlot  // ✅ NEW: Send timeSlot to backend
            });
            alert('Order placed successfully!');
            setShowOrderModal(false);
            fetchOrders();
            fetchLoyaltyPoints();
        } catch (error) {
            alert('Error placing order: ' + (error.response?.data?.msg || error.message));
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitRating({ orderId: selectedOrder._id, ...ratingForm });
            alert('Rating submitted successfully!');
            setShowRatingModal(false);
            fetchOrders();
        } catch (error) {
            alert('Error submitting rating: ' + (error.response?.data?.msg || error.message));
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
        return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>;
    };

    // ✅ NEW: Helper to display time slot
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

    const pageStyle = {
        backgroundColor: darkMode ? '#0a0a0a' : '#f8f9fa',
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        padding: '1.5rem'
    };

    return (
        <div style={pageStyle}>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2>Welcome, {user?.name}!</h2>
                    </Col>
                    <Col className="text-end">
                        <Button variant="outline-danger" onClick={logoutUser}>Logout</Button>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <h3>{orders.length}</h3>
                                <p className="text-muted">Total Orders</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <h3>{orders.filter(o => o.status === 'delivered').length}</h3>
                                <p className="text-muted">Delivered</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center bg-warning">
                            <Card.Body>
                                <h3>🎁 {loyaltyPoints}</h3>
                                <p className="text-muted">Loyalty Points</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Button variant="primary" onClick={() => setShowOrderModal(true)}>
                            + Place New Order
                        </Button>
                    </Col>
                </Row>

                <Card>
                    <Card.Header>
                        <h4>My Orders</h4>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Items</th>
                                    <th>Address</th>
                                    <th>Total</th>
                                    <th>Time Slot</th> {/* ✅ NEW COLUMN */}
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id.slice(-6)}</td>
                                        <td>
                                            {order.items.map(item => `${item.quantity}x ${item.bottleSize}`).join(', ')}
                                        </td>
                                        <td>{order.deliveryAddress}</td>
                                        <td>₹{order.totalPrice}</td>
                                        <td>{getTimeSlotDisplay(order.timeSlot)}</td> {/* ✅ NEW */}
                                        <td>{getStatusBadge(order.status)}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {order.status === 'delivered' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowRatingModal(true);
                                                    }}
                                                >
                                                    Rate
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/* Order Modal */}
                <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Place New Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleOrderSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Bottle Size</Form.Label>
                                <Form.Select
                                    value={orderForm.bottleSize}
                                    onChange={(e) => setOrderForm({ ...orderForm, bottleSize: e.target.value })}
                                >
                                    <option value="5L">5 Liters - ₹50</option>
                                    <option value="10L">10 Liters - ₹90</option>
                                    <option value="20L">20 Liters - ₹170</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={orderForm.quantity}
                                    onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                                />
                            </Form.Group>

                            {/* ✅ NEW: Time Slot Selection */}
                            <Form.Group className="mb-3">
                                <Form.Label>⏰ Preferred Delivery Time</Form.Label>
                                <Form.Select
                                    value={orderForm.timeSlot}
                                    onChange={(e) => setOrderForm({ ...orderForm, timeSlot: e.target.value })}
                                >
                                    <option value="anytime">Anytime (Default)</option>
                                    <option value="morning">🌅 Morning (8 AM - 12 PM)</option>
                                    <option value="afternoon">☀️ Afternoon (12 PM - 4 PM)</option>
                                    <option value="evening">🌆 Evening (4 PM - 8 PM)</option>
                                    <option value="night">🌙 Night (8 PM - 10 PM) +₹20</option>
                                </Form.Select>
                                {orderForm.timeSlot === 'night' && (
                                    <Form.Text className="text-warning">
                                        ⚡ Premium time slot - ₹20 extra charge
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Delivery Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={orderForm.deliveryAddress}
                                    onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Place Order
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Rating Modal */}
                <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Rate Your Delivery</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleRatingSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Overall Rating</Form.Label>
                                <Form.Select
                                    value={ratingForm.rating}
                                    onChange={(e) => setRatingForm({ ...ratingForm, rating: parseInt(e.target.value) })}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Very Poor</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Feedback</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={ratingForm.feedback}
                                    onChange={(e) => setRatingForm({ ...ratingForm, feedback: e.target.value })}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Submit Rating
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default CustomerDashboard;
