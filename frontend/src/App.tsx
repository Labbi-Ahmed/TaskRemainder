import React, { useState } from 'react';
import RegistrationForm from './components/Auth/RegistrationForm';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardLayout from './components/Layout/DashboardLayout';
import TaskForm from './components/Dashboard/TaskForm';
import TaskList from './components/Dashboard/TaskList';
import Calendar from './components/Common/Calendar';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [activeView, setActiveView] = useState('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  // Mock tasks for the Task List page
  const mockTasks = [
    { id: 1, title: 'Finalize project proposal', dueDate: '2026-04-22T17:00:00Z', priority: 'High', status: 'Pending' },
    { id: 2, title: 'Team standup meeting', dueDate: '2026-04-22T10:00:00Z', priority: 'Medium', status: 'Pending' },
    { id: 3, title: 'Update documentation', dueDate: '2026-04-23T09:00:00Z', priority: 'Low', status: 'Completed' },
    { id: 4, title: 'Client follow-up call', dueDate: '2026-04-22T14:30:00Z', priority: 'High', status: 'Pending' },
    { id: 5, title: 'Weekly task review', dueDate: '2026-04-24T16:00:00Z', priority: 'Medium', status: 'Pending' },
    { id: 6, title: 'Check new YouTube tutorials', dueDate: '2026-04-25T11:00:00Z', priority: 'Low', status: 'Pending' },
    { id: 7, title: 'Grocery shopping', dueDate: '2026-04-22T19:00:00Z', priority: 'Medium', status: 'Pending' },
  ];

  const filteredTasks = mockTasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    // Date/Today filter
    const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
    const taskDate = new Date(taskDateStr).getTime();
    
    let matchesDate = true;
    
    if (showTodayOnly) {
      matchesDate = taskDateStr === '2026-04-22';
    } else if (startDate || endDate) {
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      matchesDate = taskDate >= start && taskDate <= end;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDateRange = () => {
    if (!startDate) return 'Select date range';
    if (startDate === endDate) return new Date(startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    return `${new Date(startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const renderDashboardView = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard onNewTask={() => setIsTaskModalOpen(true)} />;
      case 'tasks':
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Task List</h1>
                <p className="mt-1 text-gray-600">All your saved items and reminders in one place.</p>
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
              >
                + New Task
              </button>
            </header>

            {/* Filters and Search Bar */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <select 
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                    }}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 relative">
                  <button 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-sm ${startDate ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {formatDateRange()}
                    </span>
                  </button>

                  {isCalendarOpen && (
                    <Calendar 
                      startDate={startDate} 
                      endDate={endDate} 
                      onSelectRange={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                        if (start) setShowTodayOnly(false);
                      }}
                      onClose={() => setIsCalendarOpen(false)}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => {
                      if (!showTodayOnly) {
                        // Activate Due Today and clear only the manual date range
                        setShowTodayOnly(true);
                        setStartDate('');
                        setEndDate('');
                      } else {
                        // Deactivate Due Today
                        setShowTodayOnly(false);
                      }
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      showTodayOnly 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Due Today
                  </button>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setStartDate('');
                      setEndDate('');
                      setShowTodayOnly(false);
                    }}
                    className="text-xs text-gray-400 hover:text-indigo-600 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Showing <span className="text-indigo-600 font-bold">{filteredTasks.length}</span> tasks
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <TaskList tasks={filteredTasks} isLoading={false} title="Active Tasks" showViewAll={false} />
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.253 16.5 18.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Library</h1>
            <p className="text-gray-500 mt-2 max-w-md">Your saved content will appear here. We're still building this feature!</p>
          </div>
        );
      case 'schedule':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
            <p className="text-gray-500 mt-2 max-w-md">Plan your day and set reminders. Coming soon!</p>
          </div>
        );
      case 'categories':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Categories & Tags</h1>
            <p className="text-gray-500 mt-2 max-w-md">Organize your tasks with custom categories and tags. Under development.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-500 mt-2 max-w-md">Track your productivity and discipline score over time.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 mt-2 max-w-md">Manage your account and preferences.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <LoginPage onToggle={() => setCurrentPage('register')} onLogin={() => setCurrentPage('dashboard')} />;
      case 'register':
        return <RegistrationForm onToggle={() => setCurrentPage('login')} />;
      case 'dashboard':
        return (
          <DashboardLayout 
            activeView={activeView} 
            onViewChange={setActiveView} 
            onLogout={() => setCurrentPage('login')}
            onNewTask={() => setIsTaskModalOpen(true)}
          >
            {renderDashboardView()}
            
            {/* Global Task Modal */}
            {isTaskModalOpen && (
              <div className="fixed inset-0 z-[100] overflow-y-auto">
                <div 
                  className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" 
                  onClick={() => setIsTaskModalOpen(false)}
                />
                <div className="flex min-h-full items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-200">
                    <TaskForm 
                      onCancel={() => setIsTaskModalOpen(false)} 
                      onSubmit={(data) => {
                        console.log('Task Created:', data);
                        setIsTaskModalOpen(false);
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}
          </DashboardLayout>
        );
      default:
        return <LoginPage onToggle={() => setCurrentPage('register')} onLogin={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}

export default App;
