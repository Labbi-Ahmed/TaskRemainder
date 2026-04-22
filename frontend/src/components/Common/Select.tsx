import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={props.id || props.name} className="sr-only">
        {label}
      </label>
      <select
        {...props}
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${className}`}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-[10px] italic mt-1 px-1">{error}</p>}
    </div>
  );
};

export default Select;
