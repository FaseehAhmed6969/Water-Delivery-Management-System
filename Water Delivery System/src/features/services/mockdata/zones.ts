import { Zone, Branch } from '../../types';

export const mockBranches: Branch[] = [
  {
    id: 'b1',
    name: 'Islamabad Central',
    location: 'Blue Area, Islamabad',
    zoneIds: ['z1', 'z2', 'z3'],
  },
  {
    id: 'b2',
    name: 'Rawalpindi Branch',
    location: 'Saddar, Rawalpindi',
    zoneIds: ['z4', 'z5'],
  },
];

export const mockZones: Zone[] = [
  {
    id: 'z1',
    name: 'F-Sector',
    description: 'F-6, F-7, F-8, F-10, F-11',
    baseDeliveryFee: 50,
    branchId: 'b1',
    isActive: true,
  },
  {
    id: 'z2',
    name: 'Blue Area',
    description: 'Commercial district',
    baseDeliveryFee: 80,
    branchId: 'b1',
    isActive: true,
  },
  {
    id: 'z3',
    name: 'G-Sector',
    description: 'G-6, G-7, G-9, G-10, G-11',
    baseDeliveryFee: 50,
    branchId: 'b1',
    isActive: true,
  },
  {
    id: 'z4',
    name: 'Saddar',
    description: 'Saddar area',
    baseDeliveryFee: 60,
    branchId: 'b2',
    isActive: true,
  },
  {
    id: 'z5',
    name: 'Bahria Town',
    description: 'Bahria Town Phase 1-8',
    baseDeliveryFee: 100,
    branchId: 'b2',
    isActive: false,
  },
];

export const getZoneById = (id: string): Zone | undefined => {
  return mockZones.find(z => z.id === id);
};

export const getBranchById = (id: string): Branch | undefined => {
  return mockBranches.find(b => b.id === id);
};
