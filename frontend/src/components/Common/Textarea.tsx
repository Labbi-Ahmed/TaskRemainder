import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={props.id || props.name} className="sr-only">
        {label}
      </label>
      <textarea
        {...props}
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${className}`}
        placeholder={label}
      />
      {error && <p className="text-red-500 text-[10px] italic mt-1 px-1">{error}</p>}
    </div>
  );
};

export default Textarea;
