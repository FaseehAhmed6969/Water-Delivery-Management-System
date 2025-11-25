export type UserRole = 'customer' | 'admin' | 'rider';

export type OrderStatus = 'pending' | 'assigned' | 'outForDelivery' | 'delivered' | 'returned' | 'cancelled';
export type PaymentType = 'COD' | 'prepaid' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type SubscriptionFrequency = 'weekly' | 'biWeekly' | 'monthly';
export type IssueStatus = 'open' | 'inProgress' | 'resolved';
export type IssuePriority = 'low' | 'medium' | 'high';
export type IssueType = 'lateDelivery' | 'damagedBottle' | 'wrongQuantity' | 'other';
export type BottleCondition = 'good' | 'damaged';
export type BottleReturnStatus = 'pending' | 'approved' | 'rejected';
export type NotificationType = 'orderUpdate' | 'promotion' | 'systemAlert' | 'riderAlert';
export type DiscountType = 'percent' | 'fixed';
export type CustomerStatus = 'active' | 'blocked';
export type RiderStatus = 'active' | 'inactive' | 'online' | 'offline';
export type AdminRole = 'superAdmin' | 'branchAdmin';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  status: CustomerStatus;
}

export interface Address {
  id: string;
  customerId: string;
  label: string;
  street: string;
  city: string;
  zoneId: string;
  isDefault: boolean;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  branchId: string;
  status: RiderStatus;
  codBalance: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  zoneIds: string[];
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  baseDeliveryFee: number;
  branchId: string;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  bottleType: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  branchId: string;
  zoneId: string;
  riderId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddressId: string;
  deliverySlot: string;
  paymentType: PaymentType;
  source: 'oneOff' | 'subscription';
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  bottleType: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  nextDeliveryDate: string;
  preferredDeliverySlot: string;
  status: SubscriptionStatus;
  lastGeneratedOrderId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface BottleReturn {
  id: string;
  orderId: string;
  customerId: string;
  riderId: string;
  bottleCount: number;
  condition: BottleCondition;
  status: BottleReturnStatus;
  date: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentType;
  status: PaymentStatus;
  transactionRef?: string;
  createdAt: string;
  settledAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole;
  type: NotificationType;
  message: string;
  targetId?: string;
  read: boolean;
  createdAt: string;
}

export interface IssueTicket {
  id: string;
  customerId: string;
  orderId?: string;
  issueType: IssueType;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
  resolvedAt?: string;
  assignedAdminId?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}