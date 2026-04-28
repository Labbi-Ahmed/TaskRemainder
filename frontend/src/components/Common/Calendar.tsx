"use client";
import React, { useState } from 'react';

interface CalendarProps {
  startDate: string;
  endDate: string;
  onSelectRange: (start: string, end: string) => void;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ startDate, endDate, onSelectRange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // Default to April 2026 for this project context
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDay = startDayOfMonth(year, month);
  
  const days = [];
  // Padding for first week
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Days of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    if (!startDate || (startDate && endDate && startDate !== endDate)) {
      // Start a new selection
      onSelectRange(dateStr, dateStr);
    } else {
      // Second click
      const start = new Date(startDate);
      const end = date;
      
      if (end < start) {
        onSelectRange(dateStr, startDate);
      } else {
        onSelectRange(startDate, dateStr);
      }
    }
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    const dStr = date.toISOString().split('T')[0];
    return dStr === startDate || dStr === endDate;
  };

  const isInRange = (date: Date | null) => {
    if (!date || !startDate || !endDate) return false;
    return date > new Date(startDate) && date < new Date(endDate);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="absolute top-full mt-2 right-0 z-[110] bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-bold text-gray-800">{monthNames[month]} {year}</span>
        <button 
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {date ? (
              <button
                onClick={() => handleDateClick(date)}
                className={`w-full h-full text-xs rounded-lg transition-all duration-150 flex items-center justify-center ${
                  isSelected(date) 
                    ? 'bg-indigo-600 text-white font-bold shadow-md' 
                    : isInRange(date)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {date.getDate()}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Calendar;
