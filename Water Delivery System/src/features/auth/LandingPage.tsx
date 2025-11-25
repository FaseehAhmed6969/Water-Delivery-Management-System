import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          AquaPure Water Delivery
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Pure water delivered to your doorstep
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
