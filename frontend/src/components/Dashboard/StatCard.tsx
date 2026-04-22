import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon, isLoading, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${color} transition duration-300 hover:shadow-lg ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{isLoading ? '...' : value}</p>
      </div>
      <div className="p-3 rounded-full bg-gray-50 text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
