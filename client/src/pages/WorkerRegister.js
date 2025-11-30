import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { register } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function WorkerRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'worker'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await register(formData);
            loginUser(response.data.token, response.data.user);
            navigate('/worker/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '40px 20px'
            }}
        >
            <Container style={{ maxWidth: '650px' }}>
                <Link to="/worker/login" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="light"
                        size="sm"
                        className="mb-3"
                        style={{
                            borderRadius: '20px',
                            padding: '8px 20px',
                            fontWeight: '600'
                        }}
                    >
                        ← Back to Worker Login
                    </Button>
                </Link>

                <Card
                    style={{
                        borderRadius: '30px',
                        border: 'none',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.4)'
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            padding: '40px',
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'white',
                                margin: '0 auto 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem'
                            }}
                        >
                            🚚
                        </div>
                        <h2
                            style={{
                                color: 'white',
                                fontWeight: '700',
                                marginBottom: '10px'
                            }}
                        >
                            Become an AquaFlow Rider
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.9)',
                                margin: 0
                            }}
                        >
                            Sign up to deliver water and earn per bottle
                        </p>
                    </div>

                    <Card.Body style={{ padding: '40px' }}>
                        {error && (
                            <Alert variant="danger" style={{ borderRadius: '15px' }}>
                                {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '600' }}>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
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
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="worker@example.com"
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
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
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
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0300-1234567"
                                            style={{ borderRadius: '12px', padding: '12px 18px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: '600' }}>Home / Starting Location</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Area where you will deliver (e.g., Johar Town, Lahore)"
                                    style={{ borderRadius: '12px', padding: '12px 18px' }}
                                />
                            </Form.Group>

                            <Alert variant="info" style={{ borderRadius: '12px' }}>
                                <strong>Earnings Info:</strong> You earn Rs 20 per bottle delivered.
                                Example: 50 bottles in a day = Rs 1,000.
                            </Alert>

                            <Button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    fontSize: '1.1rem',
                                    fontWeight: '700'
                                }}
                            >
                                {loading ? 'Creating rider account...' : 'Register as Rider'}
                            </Button>
                        </Form>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <small style={{ color: '#666' }}>
                                Already registered?{' '}
                                <Link to="/worker/login" style={{ fontWeight: '600' }}>
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

export default WorkerRegister;
