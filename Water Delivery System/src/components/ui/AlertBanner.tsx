import React from 'react';

interface AlertBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, onClose }) => {
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className={`border rounded-md p-4 mb-4 ${typeClasses[type]}`}>
      <div className="flex justify-between items-start">
        <p className="text-sm">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;

END FILE

12. src/components/ui/LoadingSpinner.tsx

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default LoadingSpinner;