import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerById } from '../../services/mockData/customers';

const CustomerLoyaltyPage: React.FC = () => {
  const { user } = useAuth();
  const customer = getCustomerById(user!.id);

  const loyaltyHistory = [
    { date: '2025-11-20', action: 'Order Delivered', points: 50, orderId: 'o1' },
    { date: '2025-11-15', action: 'Order Delivered', points: 80, orderId: 'o5' },
    { date: '2025-11-10', action: 'Referral Bonus', points: 100 },
    { date: '2025-11-05', action: 'Order Delivered', points: 60, orderId: 'o3' },
    { date: '2025-10-28', action: 'Welcome Bonus', points: 100 },
  ];

  const rewards = [
    { points: 500, reward: 'Rs. 50 off on next order', available: false },
    { points: 1000, reward: 'Free 19L bottle', available: false },
    { points: 2000, reward: 'Rs. 200 off on next order', available: false },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Loyalty Rewards</h1>
        <p className="text-gray-600 mt-1">Earn points with every order and redeem exciting rewards</p>
      </div>

      {/* Points Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-6 text-white">
        <div className="text-center">
          <div className="text-sm uppercase tracking-wide mb-2">Your Balance</div>
          <div className="text-6xl font-bold mb-2">{customer?.loyaltyPoints}</div>
          <div className="text-blue-100">Loyalty Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Rewards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
          <div className="space-y-3">
            {rewards.map((reward, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${
                  (customer?.loyaltyPoints || 0) >= reward.points
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{reward.reward}</div>
                    <div className="text-sm text-gray-600">{reward.points} points required</div>
                  </div>
                  <button
                    disabled={(customer?.loyaltyPoints || 0) < reward.points}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      (customer?.loyaltyPoints || 0) >= reward.points
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Points History</h2>
          <div className="space-y-3">
            {loyaltyHistory.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <div className="font-medium text-sm">{item.action}</div>
                  <div className="text-xs text-gray-500">{item.date}</div>
                </div>
                <div className="text-green-600 font-semibold">+{item.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-lg mb-3">How to Earn Points</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Earn 10 points for every Rs. 100 spent</li>
          <li>• Get 100 points for every successful referral</li>
          <li>• Bonus points on subscription orders</li>
          <li>• Special promotions and seasonal bonuses</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerLoyaltyPage;