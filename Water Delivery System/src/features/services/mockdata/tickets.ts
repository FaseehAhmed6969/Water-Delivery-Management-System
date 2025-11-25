import { IssueTicket } from '../../types';

export const mockTickets: IssueTicket[] = [
  {
    id: 't1',
    customerId: 'c1',
    orderId: 'o1',
    issueType: 'damagedBottle',
    description: 'One bottle was damaged during delivery',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2025-11-20T12:00:00Z',
    resolvedAt: '2025-11-20T15:00:00Z',
    assignedAdminId: 'a1',
  },
  {
    id: 't2',
    customerId: 'c2',
    orderId: 'o3',
    issueType: 'wrongQuantity',
    description: 'Received 2 bottles instead of 3',
    status: 'inProgress',
    priority: 'high',
    createdAt: '2025-11-25T10:00:00Z',
    assignedAdminId: 'a1',
  },
];

export const getTicketsByCustomer = (customerId: string): IssueTicket[] => {
  return mockTickets.filter(t => t.customerId === customerId);
};
