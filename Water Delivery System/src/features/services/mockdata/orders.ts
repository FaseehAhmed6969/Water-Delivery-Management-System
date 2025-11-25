import { Order, OrderItem } from '../../types';

export const mockOrderItems: OrderItem[] = [
  { id: 'oi1', orderId: 'o1', bottleType: '19L', quantity: 2, unitPrice: 150 },
  { id: 'oi2', orderId: 'o2', bottleType: '19L', quantity: 4, unitPrice: 150 },
  { id: 'oi3', orderId: 'o3', bottleType: '19L', quantity: 3, unitPrice: 150 },
  { id: 'oi4', orderId: 'o3', bottleType: '6L', quantity: 5, unitPrice: 80 },
  { id: 'oi5', orderId: 'o4', bottleType: '19L', quantity: 2, unitPrice: 150 },
  { id: 'oi6', orderId: 'o5', bottleType: '19L', quantity: 6, unitPrice: 150 },
  { id: 'oi7', orderId: 'o6', bottleType: '19L', quantity: 1, unitPrice: 150 },
  { id: 'oi8', orderId: 'o7', bottleType: '19L', quantity: 3, unitPrice: 150 },
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    customerId: 'c1',
    branchId: 'b1',
    zoneId: 'z1',
    riderId: 'r1',
    items: [mockOrderItems[0]],
    totalAmount: 350,
    status: 'delivered',
    deliveryAddressId: 'addr1',
    deliverySlot: '2025-11-20 10:00-12:00',
    paymentType: 'COD',
    source: 'oneOff',
    createdAt: '2025-11-20T08:30:00Z',
  },
  {
    id: 'o2',
    customerId: 'c1',
    branchId: 'b1',
    zoneId: 'z1',
    riderId: 'r1',
    items: [mockOrderItems[1]],
    totalAmount: 650,
    status: 'outForDelivery',
    deliveryAddressId: 'addr1',
    deliverySlot: '2025-11-25 14:00-16:00',
    paymentType: 'COD',
    source: 'subscription',
    createdAt: '2025-11-25T09:00:00Z',
  },
  {
    id: 'o3',
    customerId: 'c2',
    branchId: 'b1',
    zoneId: 'z1',
    riderId: 'r2',
    items: [mockOrderItems[2], mockOrderItems[3]],
    totalAmount: 900,
    status: 'assigned',
    deliveryAddressId: 'addr3',
    deliverySlot: '2025-11-25 10:00-12:00',
    paymentType: 'prepaid',
    source: 'oneOff',
    createdAt: '2025-11-25T07:15:00Z',
  },
  {
    id: 'o4',
    customerId: 'c1',
    branchId: 'b1',
    zoneId: 'z2',
    items: [mockOrderItems[4]],
    totalAmount: 380,
    status: 'pending',
    deliveryAddressId: 'addr2',
    deliverySlot: '2025-11-26 10:00-12:00',
    paymentType: 'COD',
    source: 'oneOff',
    createdAt: '2025-11-25T10:30:00Z',
  },
  {
    id: 'o5',
    customerId: 'c3',
    branchId: 'b1',
    zoneId: 'z3',
    riderId: 'r2',
    items: [mockOrderItems[5]],
    totalAmount: 950,
    status: 'delivered',
    deliveryAddressId: 'addr1',
    deliverySlot: '2025-11-22 14:00-16:00',
    paymentType: 'online',
    source: 'oneOff',
    createdAt: '2025-11-22T08:00:00Z',
  },
  {
    id: 'o6',
    customerId: 'c1',
    branchId: 'b1',
    zoneId: 'z1',
    items: [mockOrderItems[6]],
    totalAmount: 200,
    status: 'cancelled',
    deliveryAddressId: 'addr1',
    deliverySlot: '2025-11-23 10:00-12:00',
    paymentType: 'COD',
    source: 'oneOff',
    createdAt: '2025-11-23T09:00:00Z',
  },
  {
    id: 'o7',
    customerId: 'c4',
    branchId: 'b1',
    zoneId: 'z1',
    riderId: 'r3',
    items: [mockOrderItems[7]],
    totalAmount: 500,
    status: 'returned',
    deliveryAddressId: 'addr1',
    deliverySlot: '2025-11-24 14:00-16:00',
    paymentType: 'COD',
    source: 'oneOff',
    createdAt: '2025-11-24T10:00:00Z',
  },
];

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find(o => o.id === id);
};

export const getOrdersByCustomer = (customerId: string): Order[] => {
  return mockOrders.filter(o => o.customerId === customerId);
};

export const getOrdersByRider = (riderId: string): Order[] => {
  return mockOrders.filter(o => o.riderId === riderId);
};

export const getOrdersByStatus = (status: string): Order[] => {
  if (status === 'all') return mockOrders;
  return mockOrders.filter(o => o.status === status);
};

export const getItemsForOrder = (orderId: string): OrderItem[] => {
  return mockOrderItems.filter(i => i.orderId === orderId);
};
