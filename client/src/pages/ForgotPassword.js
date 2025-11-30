import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(response.data.msg);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '20px'
            }}
        >
            <Container style={{ maxWidth: '500px' }}>
                <Card style={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                    <Card.Body style={{ padding: '40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔐</div>
                            <h3 style={{ fontWeight: '700', marginBottom: '10px' }}>Forgot Password?</h3>
                            <p style={{ color: '#666', margin: 0 }}>
                                Enter your email and we'll send you a reset link
                            </p>
                        </div>

                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: '600' }}>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    style={{ borderRadius: '12px', padding: '14px 18px', border: '2px solid #e0e0e0' }}
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontSize: '1rem',
                                    fontWeight: '700'
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </Form>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Link to="/customer/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                                ← Back to Login
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default ForgotPassword;
