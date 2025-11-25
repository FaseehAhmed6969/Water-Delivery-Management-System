import { Coupon } from '../../types';

export const mockCoupons: Coupon[] = [
  {
    id: 'cp1',
    code: 'WELCOME20',
    description: '20% off on first order',
    discountType: 'percent',
    discountValue: 20,
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
    usageLimit: 100,
    timesUsed: 45,
    isActive: true,
  },
  {
    id: 'cp2',
    code: 'FLAT50',
    description: 'Flat Rs.50 off',
    discountType: 'fixed',
    discountValue: 50,
    validFrom: '2025-11-15',
    validTo: '2025-11-30',
    usageLimit: 200,
    timesUsed: 178,
    isActive: true,
  },
  {
    id: 'cp3',
    code: 'SUMMER15',
    description: '15% off on all orders',
    discountType: 'percent',
    discountValue: 15,
    validFrom: '2025-06-01',
    validTo: '2025-08-31',
    usageLimit: 500,
    timesUsed: 500,
    isActive: false,
  },
];

export const getCouponByCode = (code: string): Coupon | undefined => {
  return mockCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
};
