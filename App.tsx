import { useState } from 'react';
import { Login } from './components/Login';
import { CustomerDashboard } from './components/CustomerDashboard';
import { NewOrderForm } from './components/NewOrderForm';
import { OrderTracking } from './components/OrderTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerManagement } from './components/CustomerManagement';
import { AssignOrder } from './components/AssignOrder';
import { DeliveryWorkerDashboard } from './components/DeliveryWorkerDashboard';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'admin' | 'customer' | 'worker' | null;

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  bottleSize: string;
  quantity: number;
  address: string;
  status: 'pending' | 'assigned' | 'delivered';
  assignedTo?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  activeOrders: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Mock data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customerId: 'CUST001',
      customerName: 'John Smith',
      bottleSize: '20L',
      quantity: 5,
      address: '123 Main St, City Center',
      status: 'pending',
      createdAt: '2025-11-09T10:30:00'
    },
    {
      id: 'ORD002',
      customerId: 'CUST002',
      customerName: 'Sarah Johnson',
      bottleSize: '10L',
      quantity: 10,
      address: '456 Oak Ave, Downtown',
      status: 'assigned',
      assignedTo: 'Mike Wilson',
      createdAt: '2025-11-09T09:15:00'
    },
    {
      id: 'ORD003',
      customerId: 'CUST003',
      customerName: 'Robert Brown',
      bottleSize: '20L',
      quantity: 3,
      address: '789 Elm St, Suburb',
      status: 'delivered',
      assignedTo: 'Tom Davis',
      createdAt: '2025-11-08T14:20:00'
    }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 234-567-8901',
      address: '123 Main St, City Center'
    },
    {
      id: 'CUST002',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 234-567-8902',
      address: '456 Oak Ave, Downtown'
    },
    {
      id: 'CUST003',
      name: 'Robert Brown',
      email: 'robert.b@email.com',
      phone: '+1 234-567-8903',
      address: '789 Elm St, Suburb'
    }
  ]);

  const [workers, setWorkers] = useState<Worker[]>([
    { id: 'WRK001', name: 'Mike Wilson', phone: '+1 234-567-9001', activeOrders: 2 },
    { id: 'WRK002', name: 'Tom Davis', phone: '+1 234-567-9002', activeOrders: 1 },
    { id: 'WRK003', name: 'James Miller', phone: '+1 234-567-9003', activeOrders: 0 }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogin = (role: UserRole, userData: any) => {
    setUserRole(role);
    setCurrentUser(userData);
    
    if (role === 'admin') {
      setCurrentScreen('admin-dashboard');
    } else if (role === 'customer') {
      setCurrentScreen('customer-dashboard');
    } else if (role === 'worker') {
      setCurrentScreen('worker-dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleNewOrder = (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
    setCurrentScreen('order-tracking');
  };

  const handleAssignOrder = (orderId: string, workerName: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'assigned' as const, assignedTo: workerName }
        : order
    ));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      
      case 'customer-dashboard':
        return (
          <CustomerDashboard
            user={currentUser}
            orders={orders.filter(o => o.customerId === currentUser?.id)}
            onNavigate={(screen, order) => {
              setCurrentScreen(screen);
              if (order) setSelectedOrder(order);
            }}
            onLogout={handleLogout}
          />
        );
      
      case 'new-order':
        return (
          <NewOrderForm
            user={currentUser}
            onSubmit={handleNewOrder}
            onBack={() => setCurrentScreen('customer-dashboard')}
          />
        );
      
      case 'order-tracking':
        return (
          <OrderTracking
            order={selectedOrder}
            onBack={() => setCurrentScreen(userRole === 'customer' ? 'customer-dashboard' : 'admin-dashboard')}
          />
        );
      
      case 'admin-dashboard':
        return (
          <AdminDashboard
            orders={orders}
            customers={customers}
            onNavigate={(screen, order) => {
              setCurrentScreen(screen);
              if (order) setSelectedOrder(order);
            }}
            onLogout={handleLogout}
          />
        );
      
      case 'customer-management':
        return (
          <CustomerManagement
            customers={customers}
            onUpdateCustomers={setCustomers}
            onBack={() => setCurrentScreen('admin-dashboard')}
          />
        );
      
      case 'assign-order':
        return (
          <AssignOrder
            order={selectedOrder}
            workers={workers}
            onAssign={handleAssignOrder}
            onBack={() => setCurrentScreen('admin-dashboard')}
          />
        );
      
      case 'worker-dashboard':
        return (
          <DeliveryWorkerDashboard
            user={currentUser}
            orders={orders.filter(o => o.assignedTo === currentUser?.name)}
            onUpdateStatus={handleUpdateOrderStatus}
            onLogout={handleLogout}
          />
        );
      
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <Toaster />
    </>
  );
}
