import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerById, getAddressesByCustomer } from '../../services/mockData/customers';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AlertBanner from '../../components/ui/AlertBanner';

const CustomerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const customer = getCustomerById(user!.id);
  const addresses = getAddressesByCustomer(user!.id);

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: 'Islamabad',
  });
  const [addressErrors, setAddressErrors] = useState<{[key: string]: string}>({});

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {[key: string]: string} = {};

    if (!newAddress.label.trim()) errors.label = 'Label is required';
    if (!newAddress.street.trim()) errors.street = 'Street address is required';
    if (!newAddress.city.trim()) errors.city = 'City is required';

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    setAddressErrors({});
    setShowAddressForm(false);
    setNewAddress({ label: '', street: '', city: 'Islamabad' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account and delivery addresses</p>
      </div>

      {showSuccess && (
        <AlertBanner
          type="success"
          message="Changes saved successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="pt-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Delivery Addresses</h2>
            <Button
              size="sm"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              {showAddressForm ? 'Cancel' : 'Add New'}
            </Button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <Input
                label="Label (e.g., Home, Office)"
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                error={addressErrors.label}
              />
              <Input
                label="Street Address"
                value={newAddress.street}
                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                error={addressErrors.street}
              />
              <Input
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                error={addressErrors.city}
              />
              <Button type="submit" size="sm">Save Address</Button>
            </form>
          )}

          <div className="space-y-3">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center">
                      {addr.label}
                      {addr.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{addr.street}</div>
                    <div className="text-sm text-gray-600">{addr.city}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
