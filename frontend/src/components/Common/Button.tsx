import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const baseStyles = 'group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    link: 'text-indigo-600 bg-transparent hover:text-indigo-500 p-0 border-0 focus:ring-0',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      {...props}
      className={`${variant !== 'link' ? baseStyles : 'font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none'} ${variants[variant]} ${widthStyle} ${className} ${
        props.disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
