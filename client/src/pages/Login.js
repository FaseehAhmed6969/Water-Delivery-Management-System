import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../styles/animations.css';
import '../styles/theme.css';

function Login() {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginUser(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated Background Elements */}
            <div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                    top: '-250px',
                    left: '-250px',
                    animation: 'float 6s ease-in-out infinite'
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
                    bottom: '-200px',
                    right: '-200px',
                    animation: 'float 8s ease-in-out infinite'
                }}
            />

            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xl={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Logo Section */}
                            <div className="text-center mb-5">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                >
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            padding: '1rem 2rem',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(59, 130, 246, 0.2)',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        <h1
                                            style={{
                                                fontSize: '2.5rem',
                                                fontWeight: '800',
                                                color: '#3B82F6',
                                                margin: 0,
                                                letterSpacing: '-1px'
                                            }}
                                        >
                                            💧 AquaFlow
                                        </h1>
                                    </div>
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    style={{
                                        color: '#CBD5E1',
                                        fontSize: '1.1rem',
                                        fontWeight: '400'
                                    }}
                                >
                                    Smart Water Delivery Management
                                </motion.p>
                            </div>

                            {/* Login Card */}
                            <Card
                                style={{
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '24px',
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <Card.Body style={{ padding: '3rem' }}>
                                    <h3
                                        className="text-center mb-4"
                                        style={{
                                            fontWeight: '700',
                                            color: '#F8FAFC',
                                            fontSize: '1.75rem'
                                        }}
                                    >
                                        Welcome Back
                                    </h3>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <Alert
                                                variant="danger"
                                                style={{
                                                    borderRadius: '12px',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    color: '#FCA5A5'
                                                }}
                                            >
                                                {error}
                                            </Alert>
                                        </motion.div>
                                    )}

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-4">
                                            <Form.Label
                                                style={{
                                                    fontWeight: '600',
                                                    color: '#CBD5E1',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Email Address
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                style={{
                                                    padding: '0.9rem 1rem',
                                                    fontSize: '1rem',
                                                    background: 'rgba(15, 23, 42, 0.5)',
                                                    border: '1.5px solid rgba(203, 213, 225, 0.2)',
                                                    borderRadius: '12px',
                                                    color: '#F8FAFC'
                                                }}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label
                                                style={{
                                                    fontWeight: '600',
                                                    color: '#CBD5E1',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Password
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                style={{
                                                    padding: '0.9rem 1rem',
                                                    fontSize: '1rem',
                                                    background: 'rgba(15, 23, 42, 0.5)',
                                                    border: '1.5px solid rgba(203, 213, 225, 0.2)',
                                                    borderRadius: '12px',
                                                    color: '#F8FAFC'
                                                }}
                                            />
                                        </Form.Group>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-100"
                                                style={{
                                                    padding: '1rem',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </Button>
                                        </motion.div>
                                    </Form>

                                    <div className="text-center mt-4">
                                        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                                            Don't have an account?{' '}
                                            <Link
                                                to="/register"
                                                style={{
                                                    color: '#3B82F6',
                                                    fontWeight: '600',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Create Account
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Demo Credentials */}
                                    <div
                                        className="mt-4 p-3"
                                        style={{
                                            background: 'rgba(15, 23, 42, 0.5)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(203, 213, 225, 0.1)'
                                        }}
                                    >
                                        <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            Demo Credentials:
                                        </p>
                                        <div style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: '1.8' }}>
                                            <div><strong>Admin:</strong> admin@aquaflow.com / admin123</div>
                                            <div><strong>Worker:</strong> worker@aquaflow.com / worker123</div>
                                            <div><strong>Customer:</strong> customer@aquaflow.com / customer123</div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-center mt-4"
                            >
                                <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                                    © 2025 AquaFlow. All rights reserved.
                                </p>
                            </motion.div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
