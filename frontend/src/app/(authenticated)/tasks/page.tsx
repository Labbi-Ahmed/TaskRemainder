"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTaskContext } from '../../../context/TaskContext';
import TaskList from '../../../components/Dashboard/TaskList';
import TaskForm from '../../../components/Dashboard/TaskForm';
import Calendar from '../../../components/Common/Calendar';
import { Task } from '../../../types';

function TasksContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');

  const { 
    tasks, categories, tags, timeSlots, isLoading, counts,
    toggleTaskStatus, deleteTask, setTasks 
  } = useTaskContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (filterParam) {
      setStatusFilter(filterParam);
    }
  }, [filterParam]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status Filter logic
    let matchesStatus = true;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();
    const now = today.getTime();

    // Find which buckets are "active" today
    const activeTodaySlots = timeSlots.filter(slot => {
      if (slot.type === 'daily') return true;
      if (slot.type === 'weekly') return slot.daysOfWeek?.includes(dayOfWeek);
      if (slot.type === 'monthly') return slot.dayOfMonth === dayOfMonth;
      return false;
    }).map(s => s.id);

    if (statusFilter === 'Today') {
      const isDueToday = !!task.dueDate?.startsWith(todayStr);
      const isSlotToday = !!(task.timeSlotId && activeTodaySlots.includes(task.timeSlotId));
      matchesStatus = (isDueToday || isSlotToday) && task.status === 'Pending';
    } else if (statusFilter === 'Overdue') {
      matchesStatus = task.status === 'Pending' && !!task.dueDate && new Date(task.dueDate).getTime() < now;
    } else if (statusFilter !== 'All') {
      matchesStatus = task.status === statusFilter;
    }

    // Date Range Filter logic
    let matchesDate = true;
    if (startDate || endDate) {
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate.split('T')[0]).getTime();
        const start = startDate ? new Date(startDate).getTime() : -Infinity;
        const end = endDate ? new Date(endDate).getTime() : Infinity;
        matchesDate = taskDate >= start && taskDate <= end;
      } else {
        matchesDate = false;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDateRange = () => {
    if (!startDate) return 'Select date range';
    if (startDate === endDate) return new Date(startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    return `${new Date(startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Focus List</h1>
          <p className="mt-1 text-gray-500 font-medium">Manage and track all your saved items.</p>
        </div>
      </header>

      {/* Enhanced Filter Bar */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <nav className="flex flex-wrap items-center gap-2 p-1 bg-gray-100/80 rounded-2xl w-fit">
            {[
              { id: 'All', label: 'All', count: counts.all },
              { id: 'Today', label: 'Due Today', count: counts.today },
              { id: 'Pending', label: 'Pending', count: counts.pending },
              { id: 'Completed', label: 'Completed', count: counts.completed },
              { id: 'Overdue', label: 'Overdue', count: counts.overdue, color: 'text-red-600' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  statusFilter === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <span className={tab.id === 'Overdue' && statusFilter !== 'Overdue' ? tab.color : ''}>{tab.label}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-lg text-[10px] ${
                  statusFilter === tab.id ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200/50 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[240px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search items..."
                className="block w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative flex items-center">
              <button 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-bold pr-10 ${
                  startDate ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDateRange()}
              </button>

              {startDate && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="absolute right-3 p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  title="Clear date filter"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {isCalendarOpen && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <Calendar 
                    startDate={startDate} 
                    endDate={endDate} 
                    onSelectRange={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-300">
        <TaskList 
          tasks={filteredTasks} 
          categories={categories}
          tags={tags}
          timeSlots={timeSlots}
          isLoading={isLoading} 
          title={`${statusFilter} Items`} 
          showViewAll={false} 
          onToggleStatus={toggleTaskStatus}
          onEdit={(task) => {
            setEditingTask(task);
          }}
          onDelete={deleteTask}
        />
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setEditingTask(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-200">
              <TaskForm 
                initialData={editingTask}
                categories={categories}
                tags={tags}
                timeSlots={timeSlots}
                onCancel={() => setEditingTask(null)} 
                onSubmit={(data) => {
                  setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t));
                  setEditingTask(null);
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <TasksContent />
    </Suspense>
  );
}
