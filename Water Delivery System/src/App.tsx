import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { UserRole } from './types';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';
import RiderLayout from './components/layout/RiderLayout';

// Auth
import LoginPage from './features/auth/LoginPage';
import LandingPage from './features/auth/LandingPage';

// Customer pages (placeholders for now)
import CustomerDashboardPage from './features/customer/CustomerDashboardPage';
import CustomerOrdersPage from './features/customer/CustomerOrdersPage';
import CustomerOrderDetailPage from './features/customer/CustomerOrderDetailPage';
import CustomerSubscriptionsPage from './features/customer/CustomerSubscriptionsPage';
import CustomerProfilePage from './features/customer/CustomerProfilePage';
import CustomerLoyaltyPage from './features/customer/CustomerLoyaltyPage';
import CustomerSupportPage from './features/customer/CustomerSupportPage';
import CustomerNotificationsPage from './features/customer/CustomerNotificationsPage';

// Admin pages (placeholders for now)
import AdminDashboardPage from './features/admin/AdminDashboardPage';
import AdminCustomersPage from './features/admin/AdminCustomersPage';
import AdminCustomerDetailPage from './features/admin/AdminCustomerDetailPage';
import AdminRidersPage from './features/admin/AdminRidersPage';
import AdminRiderDetailPage from './features/admin/AdminRiderDetailPage';
import AdminOrdersPage from './features/admin/AdminOrdersPage';
import AdminZonesPricingPage from './features/admin/AdminZonesPricingPage';
import AdminCouponsPage from './features/admin/AdminCouponsPage';
import AdminNotificationsPage from './features/admin/AdminNotificationsPage';

// Rider pages (placeholders for now)
import RiderDashboardPage from './features/rider/RiderDashboardPage';
import RiderOrderDetailPage from './features/rider/RiderOrderDetailPage';
import RiderNotificationsPage from './features/rider/RiderNotificationsPage';

interface RequireAuthProps {
  children: React.ReactElement;
  allowedRole: UserRole;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <RequireAuth allowedRole="customer">
            <CustomerLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<CustomerDashboardPage />} />
        <Route path="orders" element={<CustomerOrdersPage />} />
        <Route path="orders/:orderId" element={<CustomerOrderDetailPage />} />
        <Route path="subscriptions" element={<CustomerSubscriptionsPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
        <Route path="loyalty" element={<CustomerLoyaltyPage />} />
        <Route path="support" element={<CustomerSupportPage />} />
        <Route path="notifications" element={<CustomerNotificationsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRole="admin">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="customers/:customerId" element={<AdminCustomerDetailPage />} />
        <Route path="riders" element={<AdminRidersPage />} />
        <Route path="riders/:riderId" element={<AdminRiderDetailPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="zones" element={<AdminZonesPricingPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      {/* Rider Routes */}
      <Route
        path="/rider"
        element={
          <RequireAuth allowedRole="rider">
            <RiderLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<RiderDashboardPage />} />
        <Route path="orders/:orderId" element={<RiderOrderDetailPage />} />
        <Route path="notifications" element={<RiderNotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
