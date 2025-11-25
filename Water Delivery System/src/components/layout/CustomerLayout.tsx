import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">AquaPure</h1>
              <nav className="hidden md:flex space-x-4">
                <Link to="/customer/dashboard" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/customer/orders" className="hover:text-blue-200">Orders</Link>
                <Link to="/customer/subscriptions" className="hover:text-blue-200">Subscriptions</Link>
                <Link to="/customer/profile" className="hover:text-blue-200">Profile</Link>
                <Link to="/customer/loyalty" className="hover:text-blue-200">Loyalty</Link>
                <Link to="/customer/support" className="hover:text-blue-200">Support</Link>
                <Link to="/customer/notifications" className="hover:text-blue-200">Notifications</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
