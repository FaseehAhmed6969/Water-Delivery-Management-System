import React from

'react';
import { Link } from 'react-router-dom';
import { mockOrders } from '../../services/mockData/orders';
import { mockSubscriptions } from '../../services/mockData/subscriptions';
import StatusBadge from '../../components/ui/StatusBadge';
const AdminDashboardPage: React.FC = () => {
const today = new Date().toISOString().split('T')[0];
const todayOrders = mockOrders.filter(o => o.createdAt.startsWith(today));
const pendingOrders = mockOrders.filter(o => o.status === 'pending');
const activeSubscriptions = mockSubscriptions.filter(s => s.status === 'active');
const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
const codPending = mockOrders
.filter(o => o.paymentType === 'COD' && ['assigned', 'outForDelivery'].includes(o.status))
.reduce((sum, o) => sum + o.totalAmount, 0);
const recentOrders = mockOrders.slice(0, 5);
return (
<div>
<div className="mb-6">
<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
<p className="text-gray-600 mt-1">Overview of your water delivery operations</p>
</div>
  {/* KPI Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-600">Today's Orders</div>
      <div className="text-3xl font-bold text-blue-600 mt-2">{todayOrders.length}</div>
      <div className="text-xs text-gray-500 mt-1">+12% from yesterday</div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-600">Today's Revenue</div>
      <div className="text-3xl font-bold text-green-600 mt-2">Rs. {todayRevenue}</div>
      <div className="text-xs text-gray-500 mt-1">+8% from yesterday</div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-600">Pending Deliveries</div>
      <div className="text-3xl font-bold text-orange-600 mt-2">{pendingOrders.length}</div>
      <div className="text-xs text-gray-500 mt-1">Needs assignment</div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-600">COD Pending</div>
      <div className="text-3xl font-bold text-purple-600 mt-2">Rs. {codPending}</div>
      <div className="text-xs text-gray-500 mt-1">Active deliveries</div>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Recent Orders */}
    <div className="lg:col-span-2 bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm">
          View All
        </Link>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {recentOrders.map(order => (
            <Link
              key={order.id}
              to={`/admin/orders`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Order #{order.id}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {order.items.length} items • Rs. {order.totalAmount}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>

    {/* Quick Stats */}
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-3">Active Subscriptions</h3>
        <div className="text-4xl font-bold text-green-600 mb-2">
          {activeSubscriptions.length}
        </div>
        <Link to="/admin/customers" className="text-blue-600 hover:text-blue-700 text-sm">
          View Details →
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-3">System Alerts</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <span>{pendingOrders.length} orders pending assignment</span>
          </div>
          <div className="flex items-start">
            <span className="text-yellow-500 mr-2">⚠️</span>
            <span>2 riders offline</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};
export default AdminDashboardPage;