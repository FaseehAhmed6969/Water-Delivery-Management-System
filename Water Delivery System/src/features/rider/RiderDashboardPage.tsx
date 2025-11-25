import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByRider } from '../../services/mockData/orders';
import { getRiderById } from '../../services/mockData/riders';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

const RiderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [rider, setRider] = useState<any>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const riderData = getRiderById(user!.id);
      const ordersData = getOrdersByRider(user!.id);
      setRider(riderData);
      setOrders(ordersData);
      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const todayOrders = orders.filter(o => ['assigned', 'outForDelivery'].includes(o.status));
  const deliveredToday = orders.filter(o => {
    const orderDate = new Date(o.createdAt).toDateString();
    const today = new Date().toDateString();
    return o.status === 'delivered' && orderDate === today;
  });

  const codCollected = todayOrders
    .filter(o => o.paymentType === 'COD' && o.status === 'outForDelivery')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {rider?.name}!</h1>
        <p className="text-gray-600 mt-1">Here are your deliveries for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Today's Deliveries</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{todayOrders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{deliveredToday.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">COD Collected</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">Rs. {codCollected}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">COD Balance</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">Rs. {rider?.codBalance}</div>
        </div>
      </div>

      {/* Today's Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Today's Assigned Orders</h2>
        </div>
        <div className="p-6">
          {todayOrders.length === 0 ? (
            <EmptyState
              title="No orders assigned"
              description="You don't have any deliveries assigned for today"
            />
          ) : (
            <div className="space-y-4">
              {todayOrders.map((order, index) => (
                <Link
                  key={order.id}
                  to={`/rider/orders/${order.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Order #{order.id}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {order.deliverySlot}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="ml-11 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium ml-2">{order.items.length} bottle(s)</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium ml-2">Rs. {order.totalAmount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment:</span>
                      <span className={`font-medium ml-2 ${order.paymentType === 'COD' ? 'text-orange-600' : 'text-green-600'}`}>
                        {order.paymentType}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* End of Day Summary */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mt-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Today's Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-green-100 text-sm">Total Deliveries</div>
            <div className="text-2xl font-bold">{deliveredToday.length}</div>
          </div>
          <div>
            <div className="text-green-100 text-sm">COD Collected</div>
            <div className="text-2xl font-bold">Rs. {codCollected}</div>
          </div>
          <div>
            <div className="text-green-100 text-sm">Returns</div>
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboardPage;