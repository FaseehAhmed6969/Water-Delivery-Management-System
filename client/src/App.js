import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';

// Landing & Auth Pages
import LandingPage from './pages/LandingPage';
import CustomerLogin from './pages/CustomerLogin';
import AdminLogin from './pages/AdminLogin';
import WorkerLogin from './pages/WorkerLogin';
import CustomerRegister from './pages/CustomerRegister';
import WorkerRegister from './pages/WorkerRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboards
import EnhancedCustomerDashboard from './pages/EnhancedCustomerDashboard';
import CompleteAdminDashboard from './pages/CompleteAdminDashboard';
import CompleteWorkerDashboard from './pages/CompleteWorkerDashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function PrivateRoute({ children, role }) {
    const { user, loading } = React.useContext(AuthContext);

    if (loading)
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                <div>
                    <div
                        className="spinner-border text-white"
                        role="status"
                        style={{ width: '4rem', height: '4rem' }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ color: 'white', marginTop: '20px', fontSize: '1.2rem' }}>Loading...</p>
                </div>
            </div>
        );

    if (!user) return <Navigate to="/" />;

    if (role && user.role !== role) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
        if (user.role === 'worker') return <Navigate to="/worker/dashboard" />;
        return <Navigate to="/customer/dashboard" />;
    }

    return children;
}

function App() {
    const { darkMode, toggleDarkMode } = React.useContext(ThemeContext);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Password Reset */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Customer Routes */}
                    <Route path="/customer/login" element={<CustomerLogin />} />
                    <Route path="/customer/register" element={<CustomerRegister />} />
                    <Route
                        path="/customer/dashboard"
                        element={
                            <PrivateRoute role="customer">
                                <EnhancedCustomerDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute role="admin">
                                <CompleteAdminDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Worker Routes */}
                    <Route path="/worker/login" element={<WorkerLogin />} />
                    <Route path="/worker/register" element={<WorkerRegister />} />
                    <Route
                        path="/worker/dashboard"
                        element={
                            <PrivateRoute role="worker">
                                <CompleteWorkerDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                {/* Floating Help Button */}
                <div
                    className="fab"
                    title="Need help?"
                    onClick={() => alert('Demo: For support, contact support@aquaflow.com')}
                >
                    ?
                </div>

                {/* ✅ GLOBAL Dark Mode Toggle - Bottom Left */}
                <button
                    className="dark-mode-toggle"
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{
                        background: darkMode
                            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                            : 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
                        color: 'white'
                    }}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </Router>
        </AuthProvider>
    );
}

export default App;
