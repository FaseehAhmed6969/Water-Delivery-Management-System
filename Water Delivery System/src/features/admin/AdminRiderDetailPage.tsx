import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRiderById } from '../../services/mockData/riders';
import { getOrdersByRider } from '../../services/mockData/orders';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';

const AdminRiderDetailPage: React.FC = () => {
  const { riderId } = useParams<{ riderId: string }>();
  const rider = getRiderById(riderId!);
  const orders = getOrdersByRider(riderId!);
  const todayOrders = orders.filter(o => ['assigned', 'outForDelivery'].includes(o.status));

  if (!rider) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Rider not found</p>
        <Link to="/admin/riders" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to Riders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/riders" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← Back to Riders
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{rider.name}</h1>
            <p className="text-gray-600 mt-1">{rider.phone}</p>
          </div>
          <Button size="sm">Edit</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Status</div>
          <div className="mt-2">
            <StatusBadge status={rider.status} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Today's Orders</div>
          <div className="text-2xl font-bold">{todayOrders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Deliveries</div>
          <div className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">COD Balance</div>
          <div className="text-2xl font-bold text-orange-600">Rs. {rider.codBalance}</div>
        </div>
      </div>

      {/* Today's Assigned Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Assigned Orders</h2>
        <div className="space-y-3">
          {todayOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders assigned today</p>
          ) : (
            todayOrders.map(order => (
              <div key={order.id} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {order.items.length} items • Rs. {order.totalAmount} • {order.paymentType}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{order.deliverySlot}</div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRiderDetailPage;