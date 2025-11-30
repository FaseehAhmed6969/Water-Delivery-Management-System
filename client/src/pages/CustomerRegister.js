import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { register } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function CustomerRegister() {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await register(formData);
            loginUser(response.data.token, response.data.user);
            navigate('/customer/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '40px 20px'
        }}>
            <Container style={{ maxWidth: '650px' }}>
                <Link to="/customer/login" style={{ textDecoration: 'none' }}>
                    <Button variant="light" size="sm" className="mb-3" style={{
                        borderRadius: '20px',
                        padding: '8px 20px',
                        fontWeight: '600'
                    }}>
                        ← Back to Login
                    </Button>
                </Link>

                <Card style={{
                    borderRadius: '30px',
                    border: 'none',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.4)'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'white',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem'
                        }}>
                            🛍️
                        </div>
                        <h2 style={{ color: 'white', fontWeight: '700', marginBottom: '10px' }}>
                            Create Customer Account
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                            Join thousands of satisfied customers
                        </p>
                    </div>

                    <Card.Body style={{ padding: '40px' }}>
                        {error && <Alert variant="danger" style={{ borderRadius: '15px' }}>{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600' }}>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                            style={{ borderRadius: '12px', padding: '12px 18px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600' }}>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            required
                                            style={{ borderRadius: '12px', padding: '12px 18px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600' }}>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Min 6 characters"
                                            required
                                            style={{ borderRadius: '12px', padding: '12px 18px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600' }}>Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="0300-1234567"
                                            style={{ borderRadius: '12px', padding: '12px 18px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: '600' }}>Delivery Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter your complete address"
                                    style={{ borderRadius: '12px', padding: '12px 18px' }}
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontSize: '1.1rem',
                                    fontWeight: '700'
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </Form>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <small style={{ color: '#666' }}>
                                Already have an account?{' '}
                                <Link to="/customer/login" style={{ fontWeight: '600' }}>
                                    Login here
                                </Link>
                            </small>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default CustomerRegister;
