import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSubscriptionsByCustomer } from '../../services/mockData/subscriptions';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import AlertBanner from '../../components/ui/AlertBanner';

const CustomerSubscriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const subscriptions = getSubscriptionsByCustomer(user!.id);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePause = (subId: string) => {
    setAlert({ type: 'success', message: `Subscription ${subId} has been paused` });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleResume = (subId: string) => {
    setAlert({ type: 'success', message: `Subscription ${subId} has been resumed` });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage your recurring water deliveries</p>
        </div>
        <Button>Create Subscription</Button>
      </div>

      {alert && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {subscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions"
          description="Set up a subscription for automatic recurring deliveries"
          action={<Button>Create Subscription</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptions.map(sub => (
            <div key={sub.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{sub.bottleType} Bottles</h3>
                  <p className="text-sm text-gray-600">Quantity: {sub.quantity}</p>
                </div>
                <StatusBadge status={sub.status} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency</span>
                  <span className="font-medium capitalize">{sub.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Delivery</span>
                  <span className="font-medium">{sub.nextDeliveryDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preferred Slot</span>
                  <span className="font-medium">{sub.preferredDeliverySlot}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {sub.status === 'active' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handlePause(sub.id)}
                  >
                    Pause
                  </Button>
                ) : sub.status === 'paused' ? (
                  <Button
                    size="sm"
                    variant="success"
                    className="flex-1"
                    onClick={() => handleResume(sub.id)}
                  >
                    Resume
                  </Button>
                ) : null}
                <Button size="sm" variant="secondary" className="flex-1">
                  Modify
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSubscriptionsPage;