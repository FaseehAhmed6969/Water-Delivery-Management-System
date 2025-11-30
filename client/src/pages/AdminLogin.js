import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        adminKey: ''
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
            const response = await login(formData);

            if (response.data.user.role !== 'admin') {
                setError('This account is not an admin account.');
                setLoading(false);
                return;
            }

            loginUser(response.data.token, response.data.user);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    top: '-150px',
                    right: '-150px',
                    animation: 'pulse 3s infinite'
                }}
            ></div>

            <Container style={{ maxWidth: '480px', position: 'relative', zIndex: 1 }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
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
                        ← Back to Home
                    </Button>
                </Link>

                <Card
                    style={{
                        borderRadius: '30px',
                        border: 'none',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            padding: '40px',
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'white',
                                margin: '0 auto 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                        >
                            👨‍💼
                        </div>
                        <h2
                            style={{
                                color: 'white',
                                fontWeight: '700',
                                marginBottom: '10px',
                                fontSize: '2rem'
                            }}
                        >
                            Admin Control Panel
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.9)',
                                margin: 0
                            }}
                        >
                            Secure login with admin key
                        </p>
                    </div>

                    <Card.Body style={{ padding: '40px' }}>
                        {error && (
                            <Alert variant="danger" style={{ borderRadius: '15px' }}>
                                {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: '600', color: '#333' }}>
                                    Admin Email
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@aquaflow.com"
                                    required
                                    style={{
                                        borderRadius: '12px',
                                        padding: '14px 18px',
                                        border: '2px solid #e0e0e0'
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: '600', color: '#333' }}>
                                    Password
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter secure password"
                                    required
                                    style={{
                                        borderRadius: '12px',
                                        padding: '14px 18px',
                                        border: '2px solid #e0e0e0'
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: '600', color: '#333' }}>
                                    Admin Security Key
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="adminKey"
                                    value={formData.adminKey}
                                    onChange={handleChange}
                                    placeholder="Enter admin key"
                                    required
                                    style={{
                                        borderRadius: '12px',
                                        padding: '14px 18px',
                                        border: '2px solid #e0e0e0'
                                    }}
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
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    marginBottom: '10px'
                                }}
                            >
                                {loading ? 'Authenticating...' : 'Access Admin Panel'}
                            </Button>
                        </Form>

                        {/* Forgot password link */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Link
                                to="/forgot-password"
                                style={{ color: '#f5576c', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '5px',
                                padding: '20px',
                                background: '#fff3f3',
                                borderRadius: '12px'
                            }}
                        >
                            <small style={{ color: '#666' }}>
                                🔒 Only users with the correct admin key can access this portal.
                            </small>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default AdminLogin;
