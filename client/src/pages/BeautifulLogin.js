import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function BeautifulLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const response = await login(formData);
            loginUser(response.data.token, response.data.user);

            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (response.data.user.role === 'worker') {
                navigate('/worker/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
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
            <Container style={{ maxWidth: '450px' }}>
                <div className="text-center mb-4 fade-in">
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '20px'
                    }}>💧</div>
                    <h1 style={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '2.5rem',
                        marginBottom: '10px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        AquaFlow
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '1.1rem'
                    }}>
                        Premium Water Delivery Service
                    </p>
                </div>

                <Card style={{
                    borderRadius: '25px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    border: 'none',
                    overflow: 'hidden'
                }} className="fade-in">
                    <Card.Body style={{ padding: '40px' }}>
                        <h3 className="text-center mb-4" style={{ fontWeight: '700', color: '#333' }}>
                            Welcome Back! 👋
                        </h3>

                        {error && <Alert variant="danger" style={{ borderRadius: '15px' }}>{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label>Email Address</Form.Label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute',
                                        left: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '1.2rem',
                                        color: '#999'
                                    }}>📧</span>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                        style={{ paddingLeft: '45px' }}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute',
                                        left: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '1.2rem',
                                        color: '#999'
                                    }}>🔒</span>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        style={{ paddingLeft: '45px' }}
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
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <p style={{ color: '#666', marginBottom: '15px' }}>Don't have an account?</p>
                            <Link to="/register">
                                <Button
                                    variant="outline-primary"
                                    className="w-100"
                                    style={{
                                        borderRadius: '15px',
                                        padding: '12px',
                                        fontWeight: '600',
                                        borderWidth: '2px'
                                    }}
                                >
                                    Create New Account
                                </Button>
                            </Link>
                        </div>

                        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #eee' }}>
                            <small style={{ color: '#999' }}>
                                Demo Accounts:<br />
                                Customer: customer@test.com<br />
                                Admin: admin@test.com<br />
                                Worker: worker@test.com
                            </small>
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

export default BeautifulLogin;
