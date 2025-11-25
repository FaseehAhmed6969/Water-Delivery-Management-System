import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockOrders } from '../../services/mockData/orders';
import { mockSubscriptions } from '../../services/mockData/subscriptions';
import { getCustomerById } from '../../services/mockData/customers';
import StatusBadge from '../../components/ui/StatusBadge';

const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const customer = getCustomerById(user!.id);
  const myOrders = mockOrders.filter(o => o.customerId === user!.id);
  const upcomingOrders = myOrders.filter(o => ['pending', 'assigned', 'outForDelivery'].includes(o.status));
  const mySubscriptions = mockSubscriptions.filter(s => s.customerId === user!.id);
  const activeSubscriptions = mySubscriptions.filter(s => s.status === 'active');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {customer?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your deliveries</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Loyalty Points</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{customer?.loyaltyPoints}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Active Subscriptions</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{activeSubscriptions.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">{myOrders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Upcoming Deliveries</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">{upcomingOrders.length}</div>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upcoming Deliveries</h2>
          <Link to="/customer/orders" className="text-blue-600 hover:text-blue-700 text-sm">
            View All
          </Link>
        </div>
        <div className="p-6">
          {upcomingOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming deliveries</p>
          ) : (
            <div className="space-y-4">
              {upcomingOrders.slice(0, 3).map(order => (
                <Link
                  key={order.id}
                  to={`/customer/orders/${order.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">Order #{order.id}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {order.deliverySlot} • Rs. {order.totalAmount}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {order.items.length} item(s) • {order.paymentType}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/customer/orders"
          className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition"
        >
          <h3 className="font-semibold text-lg mb-2">Place New Order</h3>
          <p className="text-blue-100 text-sm">Order water bottles for delivery</p>
        </Link>
        <Link
          to="/customer/subscriptions"
          className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition"
        >
          <h3 className="font-semibold text-lg mb-2">Manage Subscriptions</h3>
          <p className="text-green-100 text-sm">Set up recurring deliveries</p>
        </Link>
        <Link
          to="/customer/support"
          className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition"
        >
          <h3 className="font-semibold text-lg mb-2">Get Support</h3>
          <p className="text-purple-100 text-sm">Report an issue or get help</p>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
