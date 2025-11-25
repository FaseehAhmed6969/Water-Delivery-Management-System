import React, { useState } from 'react';
import { mockCoupons } from '../../services/mockData/coupons';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminCouponsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: '',
    validFrom: '',
validTo: '',
usageLimit: '',
});
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
setShowForm(false);
setFormData({
code: '',
description: '',
discountType: 'percent',
discountValue: '',
validFrom: '',
validTo: '',
usageLimit: '',
});
};
return (
<div>
<div className="mb-6 flex justify-between items-center">
<div>
<h1 className="text-3xl font-bold text-gray-900">Coupons & Promotions</h1>
<p className="text-gray-600 mt-1">Create and manage discount coupons</p>
</div>
<Button onClick={() => setShowForm(!showForm)}>
{showForm ? 'Cancel' : 'Add Coupon'}
</Button>
</div>
  {showForm && (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Coupon</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Input
          label="Coupon Code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          required
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Type
          </label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({...formData, discountType: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="percent">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <Input
          label="Discount Value"
          type="number"
          value={formData.discountValue}
          onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
          required
        />
        <Input
          label="Valid From"
          type="date"
          value={formData.validFrom}
          onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
          required
        />
        <Input
          label="Valid To"
          type="date"
          value={formData.validTo}
          onChange={(e) => setFormData({...formData, validTo: e.target.value})}
          required
        />
        <Input
          label="Usage Limit"
          type="number"
          value={formData.usageLimit}
          onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
          required
        />
        <div className="col-span-2">
          <Button type="submit">Create Coupon</Button>
        </div>
      </form>
    </div>
  )}

  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Code
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Discount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Valid Until
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Usage
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {mockCoupons.map(coupon => (
          <tr key={coupon.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {coupon.code}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {coupon.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {coupon.validTo}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {coupon.timesUsed} / {coupon.usageLimit}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge status={coupon.isActive ? 'active' : 'inactive'} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <button className="text-blue-600 hover:text-blue-700 mr-3">Edit</button>
              <button className="text-red-600 hover:text-red-700">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
);
};
export default AdminCouponsPage;