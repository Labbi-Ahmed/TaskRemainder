import React, { useState, useRef, useEffect, useMemo } from 'react';

interface Option {
  value: string;
  label: string;
  color?: string;
}

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  error?: string;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  onClear,
  error,
  placeholder = 'Select an option...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(() => 
    options.find(opt => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
        onClear();
    } else {
        // Fallback: If no onClear is provided, try to find an 'all' or empty option
        const resetVal = options.find(o => o.value === 'all' || o.value === '')?.value || '';
        onChange(resetVal);
    }
    setIsOpen(false);
  };

  const isSelectedAndClearable = selectedOption && selectedOption.value !== 'all' && selectedOption.value !== '';

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="sr-only">{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 border rounded-md cursor-pointer transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white text-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 hover:border-indigo-300 shadow-sm`}
      >
        <div className="flex items-center truncate flex-grow">
          {selectedOption ? (
            <>
              {selectedOption.color && (
                <div 
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0 border border-black/5" 
                  style={{ backgroundColor: selectedOption.color }}
                />
              )}
              <span className="text-gray-900 font-medium truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center ml-2 space-x-1.5 flex-shrink-0 border-l pl-2 border-gray-100">
            {isSelectedAndClearable && (
                <button
                    onClick={handleClear}
                    className="p-0.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all transform hover:scale-110"
                    title="Clear Selection"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[110] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 text-sm border-gray-100 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <ul className="max-h-[200px] overflow-y-auto py-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-xs text-center text-gray-400 italic">No results found</li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 transition-colors ${
                    value === option.value ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-700'
                  }`}
                >
                  {option.color && (
                    <div 
                      className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <svg className="ml-auto w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      
      {error && <p className="text-red-500 text-[10px] italic mt-1 px-1">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
