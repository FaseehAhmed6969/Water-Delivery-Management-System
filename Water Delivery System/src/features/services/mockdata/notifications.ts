import { Notification } from '../../types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'c1',
    role: 'customer',
    type: 'orderUpdate',
    message: 'Your order #o2 is out for delivery',
    targetId: 'o2',
    read: false,
    createdAt: '2025-11-25T09:30:00Z',
  },
  {
    id: 'n2',
    userId: 'c1',
    role: 'customer',
    type: 'promotion',
    message: 'Use code FLAT50 to get Rs.50 off on your next order',
    read: false,
    createdAt: '2025-11-25T08:00:00Z',
  },
  {
    id: 'n3',
    userId: 'c1',
    role: 'customer',
    type: 'orderUpdate',
    message: 'Your order #o1 has been delivered successfully',
    targetId: 'o1',
    read: true,
    createdAt: '2025-11-20T11:30:00Z',
  },
  {
    id: 'n4',
    userId: 'r1',
    role: 'rider',
    type: 'riderAlert',
    message: 'New order #o2 assigned to you',
    targetId: 'o2',
    read: false,
    createdAt: '2025-11-25T09:00:00Z',
  },
  {
    id: 'n5',
    userId: 'a1',
    role: 'admin',
    type: 'systemAlert',
    message: 'Order #o4 has been pending for 3 hours',
    targetId: 'o4',
    read: false,
    createdAt: '2025-11-25T13:30:00Z',
  },
];

export const getNotificationsByUser = (userId: string, role: string): Notification[] => {
  return mockNotifications.filter(n => n.userId === userId && n.role === role);
};
