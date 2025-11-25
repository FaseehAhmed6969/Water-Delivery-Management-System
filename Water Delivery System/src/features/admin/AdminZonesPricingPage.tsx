import React from 'react';
import { mockZones } from '../../services/mockData/zones';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';

const AdminZonesPricingPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zones & Pricing</h1>
          <p className="text-gray-600 mt-1">Manage delivery zones and pricing</p>
        </div>
        <Button>Add Zone</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockZones.map(zone => (
          <div key={zone.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{zone.name}</h3>
              <StatusBadge status={zone.isActive ? 'active' : 'inactive'} />
            </div>
            <p className="text-sm text-gray-600 mb-4">{zone.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Base Delivery Fee</span>
              <span className="text-lg font-bold text-blue-600">Rs. {zone.baseDeliveryFee}</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" className="flex-1">
                Edit
              </Button>
              <Button size="sm" variant={zone.isActive ? 'danger' : 'success'} className="flex-1">
                {zone.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminZonesPricingPage;
