import React from 'react';
import { getNotificationsByUser } from '../../services/mockData/notifications';
import EmptyState from '../../components/ui/EmptyState';

const AdminNotificationsPage: React.FC = () => {
  const notifications = getNotificationsByUser('a1', 'admin');

  const getIcon = (type: string) => {
    switch (type) {
      case 'systemAlert':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">System alerts and important updates</p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="All caught up!" />
      ) : (
        <div className="bg-white rounded-lg shadow">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-6 border-b border-gray-200 last:border-b-0 ${
                !notification.read ? 'bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="text-3xl mr-4">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                {!notification.read && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;