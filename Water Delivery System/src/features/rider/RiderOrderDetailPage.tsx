import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById, getItemsForOrder } from '../../services/mockData/orders';
import { getAddressById, getCustomerById } from '../../services/mockData/customers';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import AlertBanner from '../../components/ui/AlertBanner';

const RiderOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = getOrderById(orderId!);
  const items = getItemsForOrder(orderId!);
  const address = getAddressById(order?.deliveryAddressId || '');
  const customer = getCustomerById(order?.customerId || '');

  const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showBottleReturn, setShowBottleReturn] = useState(false);
  const [bottleReturnData, setBottleReturnData] = useState({
    count: '',
    condition: 'good',
  });

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Link to="/rider/dashboard" className="text-green-600 hover:text-green-700 mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus);
    setSuccessMessage(`Order status updated to ${newStatus}`);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      if (newStatus === 'delivered') {
        navigate('/rider/dashboard');
      }
    }, 2000);
  };

  const handleBottleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBottleReturn(false);
    setSuccessMessage(`Bottle return recorded: ${bottleReturnData.count} bottles (${bottleReturnData.condition})`);
    setShowSuccess(true);
    setBottleReturnData({ count: '', condition: 'good' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/rider/dashboard" className="text-green-600 hover:text-green-700 text-sm mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
        <p className="text-gray-600 mt-1">Delivery details and status management</p>
      </div>

      {showSuccess && (
        <AlertBanner
          type="success"
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Delivery Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Customer</div>
                <div className="font-medium text-lg">{customer?.name}</div>
                <div className="text-sm text-gray-600">{customer?.phone}</div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">Delivery Address</div>
                <div className="font-medium">{address?.label}</div>
                <div className="text-gray-700">{address?.street}</div>
                <div className="text-gray-700">{address?.city}</div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">Delivery Slot</div>
                <div className="font-medium text-lg text-green-700">{order.deliverySlot}</div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">Special Instructions</div>
                <div className="text-gray-700">Call before arrival</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <div className="font-medium text-lg">{item.bottleType} Bottle</div>
                    <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-lg">Rs. {item.unitPrice * item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-center">
              <span className="font-semibold text-lg">Total Amount</span>
              <span className="font-bold text-2xl text-green-600">Rs. {order.totalAmount}</span>
            </div>
            {order.paymentType === 'COD' && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded p-3">
                <div className="flex items-center text-orange-800">
                  <span className="font-medium">💵 Cash on Delivery - Collect Rs. {order.totalAmount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottle Returns */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Bottle Returns</h2>
              <Button size="sm" onClick={() => setShowBottleReturn(!showBottleReturn)}>
                {showBottleReturn ? 'Cancel' : 'Record Return'}
              </Button>
            </div>

            {showBottleReturn && (
              <form onSubmit={handleBottleReturn} className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Bottles
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bottleReturnData.count}
                    onChange={(e) => setBottleReturnData({...bottleReturnData, count: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={bottleReturnData.condition}
                    onChange={(e) => setBottleReturnData({...bottleReturnData, condition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="good">Good</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
                <Button type="submit" size="sm">Submit Return</Button>
              </form>
            )}
          </div>
        </div>

        {/* Status Management Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Current Status</div>
              <StatusBadge status={currentStatus} />
            </div>

            <div className="space-y-3">
              {currentStatus === 'assigned' && (
                <Button
                  onClick={() => handleStatusUpdate('outForDelivery')}
                  className="w-full"
                  variant="primary"
                >
                  Start Delivery
                </Button>
              )}

              {currentStatus === 'outForDelivery' && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate('delivered')}
                    className="w-full"
                    variant="success"
                  >
                    Mark as Delivered
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('returned')}
                    className="w-full"
                    variant="danger"
                  >
                    Mark as Returned
                  </Button>
                </>
              )}

              {(currentStatus === 'delivered' || currentStatus === 'returned') && (
                <div className="text-center py-4 text-green-600 font-medium">
                  ✓ Delivery completed
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type</span>
                <span className="font-medium">{order.paymentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">Rs. {order.totalAmount}</span>
              </div>
              {order.paymentType === 'COD' && currentStatus === 'outForDelivery' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="bg-orange-100 text-orange-800 p-2 rounded text-xs text-center font-medium">
                    Collect cash before marking as delivered
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 text-sm">
            <div className="font-medium text-green-900 mb-2">Navigation Help</div>
            <div className="text-green-800">
              Use Google Maps or your preferred navigation app to reach the delivery address.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderOrderDetailPage;