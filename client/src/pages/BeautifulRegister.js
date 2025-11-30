import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { register } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function BeautifulRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'customer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await register(formData);
            loginUser(response.data.token, response.data.user);

            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (response.data.user.role === 'worker') {
                navigate('/worker/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <Container style={{ maxWidth: '600px' }}>
                <div className="text-center mb-4 fade-in">
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💧</div>
                    <h1 style={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '2.5rem',
                        marginBottom: '10px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Join AquaFlow
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                        Start your water delivery journey today
                    </p>
                </div>

                <Card style={{
                    borderRadius: '25px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    border: 'none'
                }} className="fade-in">
                    <Card.Body style={{ padding: '40px' }}>
                        <h3 className="text-center mb-4" style={{ fontWeight: '700', color: '#333' }}>
                            Create Account 🚀
                        </h3>

                        {error && <Alert variant="danger" style={{ borderRadius: '15px' }}>{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min 6 characters"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0300-1234567"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Your delivery address"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Account Type</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Check
                                        type="radio"
                                        label="🛒 Customer"
                                        name="role"
                                        value="customer"
                                        checked={formData.role === 'customer'}
                                        onChange={handleChange}
                                        id="role-customer"
                                        style={{ flex: 1 }}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="👨‍💼 Admin"
                                        name="role"
                                        value="admin"
                                        checked={formData.role === 'admin'}
                                        onChange={handleChange}
                                        id="role-admin"
                                        style={{ flex: 1 }}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="🚚 Worker"
                                        name="role"
                                        value="worker"
                                        checked={formData.role === 'worker'}
                                        onChange={handleChange}
                                        id="role-worker"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mb-3"
                                disabled={loading}
                                style={{
                                    padding: '15px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '15px'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <p style={{ color: '#666' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ fontWeight: '600', textDecoration: 'none' }}>
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </Card.Body>
                </Card>

                <div className="text-center mt-4">
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                        © 2025 AquaFlow. All rights reserved.
                    </p>
                </div>
            </Container>
        </div>
    );
}

export default BeautifulRegister;
