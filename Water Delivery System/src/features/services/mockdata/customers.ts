import { Customer, Address } from '../../types';

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'customer@test.com',
    phone: '+92-300-1234567',
    loyaltyPoints: 450,
    status: 'active',
  },
  {
    id: 'c2',
    name: 'Sarah Khan',
    email: 'sarah.khan@email.com',
    phone: '+92-321-9876543',
    loyaltyPoints: 280,
    status: 'active',
  },
  {
    id: 'c3',
    name: 'Ahmed Ali',
    email: 'ahmed.ali@email.com',
    phone: '+92-333-4567890',
    loyaltyPoints: 120,
    status: 'active',
  },
  {
    id: 'c4',
    name: 'Fatima Malik',
    email: 'fatima.m@email.com',
    phone: '+92-345-2345678',
    loyaltyPoints: 650,
    status: 'blocked',
  },
];

export const mockAddresses: Address[] = [
  {
    id: 'addr1',
    customerId: 'c1',
    label: 'Home',
    street: 'House 123, Street 45, F-7/3',
    city: 'Islamabad',
    zoneId: 'z1',
    isDefault: true,
  },
  {
    id: 'addr2',
    customerId: 'c1',
    label: 'Office',
    street: 'Office 301, Blue Area',
    city: 'Islamabad',
    zoneId: 'z2',
    isDefault: false,
  },
  {
    id: 'addr3',
    customerId: 'c2',
    label: 'Home',
    street: 'House 67, G-10/4',
    city: 'Islamabad',
    zoneId: 'z1',
    isDefault: true,
  },
];

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(c => c.id === id);
};

export const getAddressesByCustomer = (customerId: string): Address[] => {
  return mockAddresses.filter(a => a.customerId === customerId);
};

export const getAddressById = (id: string): Address | undefined => {
  return mockAddresses.find(a => a.id === id);
};
