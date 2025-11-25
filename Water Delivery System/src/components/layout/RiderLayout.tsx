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
