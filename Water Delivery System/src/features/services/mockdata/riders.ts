import { Rider } from '../../types';

export const mockRiders: Rider[] = [
  {
    id: 'r1',
    name: 'Rider One',
    phone: '+92-300-1111111',
    branchId: 'b1',
    status: 'online',
    codBalance: 15000,
  },
  {
    id: 'r2',
    name: 'Imran Hassan',
    phone: '+92-321-2222222',
    branchId: 'b1',
    status: 'online',
    codBalance: 8500,
  },
  {
    id: 'r3',
    name: 'Zubair Khan',
    phone: '+92-333-3333333',
    branchId: 'b1',
    status: 'offline',
    codBalance: 3200,
  },
  {
    id: 'r4',
    name: 'Asif Mahmood',
    phone: '+92-345-4444444',
    branchId: 'b2',
    status: 'active',
    codBalance: 12000,
  },
];

export const getRiderById = (id: string): Rider | undefined => {
  return mockRiders.find(r => r.id === id);
};
