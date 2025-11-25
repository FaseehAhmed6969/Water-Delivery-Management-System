import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById, getAddressesByCustomer } from '../../services/mockData/customers';
import { getOrdersByCustomer } from '../../services/mockData/orders';
import { getSubscriptionsByCustomer } from '../../services/mockData/subscriptions';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';

const AdminCustomerDetailPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = getCustomerById(customerId!);
  const addresses = getAddressesByCustomer(customerId!);
  const orders = getOrdersByCustomer(customerId!);
  const subscriptions = getSubscriptionsByCustomer(customerId!);

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Customer not found</p>
        <Link to="/admin/customers" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/customers" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← Back to Customers
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600 mt-1">{customer.email} • {customer.phone}</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary">Edit</Button>
            <Button size="sm" variant="danger">
              {customer.status === 'active' ? 'Block' : 'Unblock'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Active Subscriptions</div>
          <div className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Loyalty Points</div>
          <div className="text-2xl font-bold">{customer.loyaltyPoints}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Status</div>
          <div className="mt-2">
            <StatusBadge status={customer.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="border border-gray-200 rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} • Rs. {order.totalAmount}
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses & Subscriptions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Addresses</h2>
            <div className="space-y-2">
              {addresses.map(addr => (
                <div key={addr.id} className="border border-gray-200 rounded p-3 text-sm">
                  <div className="font-medium">{addr.label}</div>
                  <div className="text-gray-600">{addr.street}, {addr.city}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Subscriptions</h2>
            <div className="space-y-2">
              {subscriptions.map(sub => (
                <div key={sub.id} className="border border-gray-200 rounded p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{sub.bottleType} x {sub.quantity}</span>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="text-gray-600 mt-1">Every {sub.frequency}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetailPage;