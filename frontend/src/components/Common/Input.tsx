import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <label htmlFor={props.id || props.name} className="sr-only">
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : props.type}
          className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
            showPasswordToggle ? 'pr-10' : ''
          } ${className}`}
          placeholder={label}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 flex items-center z-20 focus:outline-none h-full"
            onClick={onTogglePassword}
            disabled={props.disabled}
          >
            {showPassword ? (
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-[10px] italic mt-1 px-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
