import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AlertBanner from '../../components/ui/AlertBanner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password, role);
    if (success) {
      navigate(`/${role}/dashboard`);
    } else {
      setError('Invalid credentials. Use password: "password"');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="rider">Rider</option>
            </select>
          </div>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
          <p className="font-semibold mb-2">Test Credentials:</p>
          <p>Customer: customer@test.com / password</p>
          <p>Admin: admin@test.com / password</p>
          <p>Rider: rider@test.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;