import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByCustomer } from '../../services/mockData/orders';
import { getTicketsByCustomer } from '../../services/mockData/tickets';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AlertBanner from '../../components/ui/AlertBanner';
import StatusBadge from '../../components/ui/StatusBadge';

const CustomerSupportPage: React.FC = () => {
  const { user } = useAuth();
  const orders = getOrdersByCustomer(user!.id);
  const tickets = getTicketsByCustomer(user!.id);

  const [formData, setFormData] = useState({
    orderId: '',
    issueType: 'lateDelivery',
    description: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const issueTypes = [
    { value: 'lateDelivery', label: 'Late Delivery' },
    { value: 'damagedBottle', label: 'Damaged Bottle' },
    { value: 'wrongQuantity', label: 'Wrong Quantity' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe your issue';
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowSuccess(true);
    setFormData({ orderId: '', issueType: 'lateDelivery', description: '' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
        <p className="text-gray-600 mt-1">Report an issue or get help with your orders</p>
      </div>

      {showSuccess && (
        <AlertBanner
          type="success"
          message="Support ticket submitted successfully! Our team will contact you soon."
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Issue Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Report an Issue</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Order (Optional)
              </label>
              <select
                value={formData.orderId}
                onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select an order</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>
                    Order #{order.id} - {new Date(order.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Type
              </label>
              <select
                value={formData.issueType}
                onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {issueTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-md`}
                placeholder="Please describe your issue in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <Button type="submit">Submit Ticket</Button>
          </form>
        </div>

        {/* My Tickets */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No support tickets yet</p>
          ) : (
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">Ticket #{ticket.id}</div>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {ticket.issueType.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{ticket.description}</div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                  {ticket.resolvedAt && (
                    <div className="text-xs text-green-600 mt-1">
                      Resolved: {new Date(ticket.resolvedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-lg mb-3">Frequently Asked Questions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="font-medium text-gray-900">How do I track my order?</div>
            <div className="text-gray-600">Visit the Orders page to see real-time status updates.</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">What if I receive a damaged bottle?</div>
            <div className="text-gray-600">Report it immediately through this form, and we'll replace it.</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">How do I cancel my subscription?</div>
            <div className="text-gray-600">Go to Subscriptions page and click Cancel on the desired subscription.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportPage;