import { Subscription } from '../../types';

export const mockSubscriptions: Subscription[] = [
  {
    id: 's1',
    customerId: 'c1',
    bottleType: '19L',
    quantity: 4,
    frequency: 'weekly',
    nextDeliveryDate: '2025-12-02',
    preferredDeliverySlot: '10:00-12:00',
    status: 'active',
    lastGeneratedOrderId: 'o2',
  },
  {
    id: 's2',
    customerId: 'c2',
    bottleType: '19L',
    quantity: 2,
    frequency: 'biWeekly',
    nextDeliveryDate: '2025-12-05',
    preferredDeliverySlot: '14:00-16:00',
    status: 'active',
  },
  {
    id: 's3',
    customerId: 'c1',
    bottleType: '6L',
    quantity: 10,
    frequency: 'monthly',
    nextDeliveryDate: '2025-12-15',
    preferredDeliverySlot: '10:00-12:00',
    status: 'paused',
  },
  {
    id: 's4',
    customerId: 'c4',
    bottleType: '19L',
    quantity: 3,
    frequency: 'weekly',
    nextDeliveryDate: '2025-11-28',
    preferredDeliverySlot: '14:00-16:00',
    status: 'cancelled',
  },
];

export const getSubscriptionsByCustomer = (customerId: string): Subscription[] => {
  return mockSubscriptions.filter(s => s.customerId === customerId);
};
