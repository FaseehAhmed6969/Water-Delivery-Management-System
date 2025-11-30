import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.msg);
            setLoading(false);

            setTimeout(() => {
                navigate('/customer/login');
            }, 2000);
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
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔑</div>
                            <h3 style={{ fontWeight: '700', marginBottom: '10px' }}>Reset Password</h3>
                            <p style={{ color: '#666', margin: 0 }}>Enter your new password</p>
                        </div>

                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: '600' }}>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    style={{ borderRadius: '12px', padding: '14px 18px', border: '2px solid #e0e0e0' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: '600' }}>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
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
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default ResetPassword;
