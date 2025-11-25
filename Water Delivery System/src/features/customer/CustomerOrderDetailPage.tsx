import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, getItemsForOrder } from '../../services/mockData/orders';
import { getAddressById } from '../../services/mockData/customers';
import { getZoneById } from '../../services/mockData/zones';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import AlertBanner from '../../components/ui/AlertBanner';

const CustomerOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = getOrderById(orderId!);
  const items = getItemsForOrder(orderId!);
  const address = getAddressById(order?.deliveryAddressId || '');
  const zone = getZoneById(order?.zoneId || '');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Link to="/customer/orders" className="text-blue-600 hover:text-blue-700 mt-4

inline-block">
Back to Orders
</Link>
</div>
);
}
const handleReorder = () => {
setShowSuccess(true);
setTimeout(() => setShowSuccess(false), 3000);
};
return (
<div>
<div className="mb-6">
<Link to="/customer/orders" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
← Back to Orders
</Link>
<h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
<p className="text-gray-600 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
</div>

  {showSuccess && (
    <AlertBanner
      type="success"
      message="Order added to cart successfully!"
      onClose={() => setShowSuccess(false)}
    />
  )}

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Order Details */}
    <div className="lg:col-span-2 space-y-6">
      {/* Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <div className="font-medium">{item.bottleType} Bottle</div>
                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">Rs. {item.unitPrice * item.quantity}</div>
                <div className="text-sm text-gray-600">Rs. {item.unitPrice} each</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-semibold text-lg">Total Amount</span>
          <span className="font-bold text-xl text-blue-600">Rs. {order.totalAmount}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600">Delivery Address</div>
            <div className="font-medium">{address?.label}</div>
            <div className="text-gray-700">{address?.street}</div>
            <div className="text-gray-700">{address?.city}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Delivery Zone</div>
            <div className="font-medium">{zone?.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Delivery Slot</div>
            <div className="font-medium">{order.deliverySlot}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Order Summary Sidebar */}
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600">Current Status</div>
            <div className="mt-1">
              <StatusBadge status={order.status} />
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Payment Method</div>
            <div className="font-medium">{order.paymentType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Order Source</div>
            <div className="font-medium capitalize">{order.source}</div>
          </div>
        </div>
      </div>

      {order.status === 'delivered' && (
        <Button onClick={handleReorder} className="w-full" variant="success">
          Reorder
        </Button>
      )}

      <Link to="/customer/support" className="block">
        <Button className="w-full" variant="secondary">
          Report Issue
        </Button>
      </Link>
    </div>
  </div>
</div>
);
};
export default CustomerOrderDetailPage;