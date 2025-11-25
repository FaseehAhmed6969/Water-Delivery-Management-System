import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <nav className="hidden md:flex space-x-4 text-sm">
                <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
                <Link to="/admin/customers" className="hover:text-gray-300">Customers</Link>
                <Link to="/admin/riders" className="hover:text-gray-300">Riders</Link>
                <Link to="/admin/orders" className="hover:text-gray-300">Orders</Link>
                <Link to="/admin/zones" className="hover:text-gray-300">Zones</Link>
                <Link to="/admin/coupons" className="hover:text-gray-300">Coupons</Link>
                <Link to="/admin/notifications" className="hover:text-gray-300">Notifications</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
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

export default AdminLayout;

END FILE

7. src/components/layout/RiderLayout.tsx

import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RiderLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Rider Portal</h1>
              <nav className="flex space-x-4">
                <Link to="/rider/dashboard" className="hover:text-green-200">Dashboard</Link>
                <Link to="/rider/notifications" className="hover:text-green-200">Notifications</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded text-sm"
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

export default RiderLayout;
