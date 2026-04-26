import React, { useState, useEffect } from 'react';
import RegistrationForm from './components/Auth/RegistrationForm';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardLayout from './components/Layout/DashboardLayout';
import TaskForm from './components/Dashboard/TaskForm';
import TaskList from './components/Dashboard/TaskList';
import Calendar from './components/Common/Calendar';
import CategoryTagManager from './components/Dashboard/CategoryTagManager';
import ScheduleMenu from './components/Dashboard/ScheduleMenu';
import { authUtils } from './utils/auth';
import { Category, Tag, Task, TimeSlot } from './types';
import './App.css';

function App() {
  // Initialize state from localStorage or defaults
  const [currentPage, setCurrentPage] = useState(() => {
    if (authUtils.isAuthenticated()) return 'dashboard';
    return 'login';
  });
  
  const [activeView, setActiveView] = useState(() => {
    return authUtils.getView() || 'dashboard';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  // Categories and Tags State with localStorage persistence
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('task_categories');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Work', color: '#6366f1' },
      { id: '2', name: 'Personal', color: '#10b981' },
      { id: '3', name: 'Learning', color: '#f59e0b' },
    ];
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem('task_tags');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Tonight', color: '#ef4444' },
      { id: '2', name: 'Weekly', color: '#3b82f6' },
      { id: '3', name: 'React', color: '#06b6d4' },
    ];
  });

  // Time Slots State
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem('task_time_slots');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Morning Routine', type: 'daily', hour: 7, minute: 30 },
      { id: '2', name: 'Morning Commute', type: 'daily', hour: 8, minute: 30 },
      { id: '3', name: 'Lunch Break', type: 'daily', hour: 13, minute: 0 },
      { id: '4', name: 'Deep Learning', type: 'daily', hour: 20, minute: 0 },
      { id: '5', name: 'Weekend Learning', type: 'weekly', hour: 10, minute: 0, daysOfWeek: [0, 6] },
    ];
  });

  // Save to localStorage when categories, tags or time slots change
  useEffect(() => {
    localStorage.setItem('task_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('task_tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('task_time_slots', JSON.stringify(timeSlots));
  }, [timeSlots]);


  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateCategory = (id: string, updatedCategory: Omit<Category, 'id'>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
  };

  const handleAddTag = (tag: Omit<Tag, 'id'>) => {
    const newTag = { ...tag, id: Math.random().toString(36).substr(2, 9) };
    setTags(prev => [...prev, newTag]);
  };

  const handleDeleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTag = (id: string, updatedTag: Omit<Tag, 'id'>) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, ...updatedTag } : t));
  };

  const handleAddSlot = (slot: Omit<TimeSlot, 'id'>) => {
    const newSlot = { ...slot, id: Math.random().toString(36).substr(2, 9) };
    setTimeSlots(prev => [...prev, newSlot]);
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(s => s.id !== id));
    setTags(prev => prev.map(t => t.timeSlotId === id ? { ...t, timeSlotId: undefined } : t));
  };

  const handleUpdateSlot = (id: string, updatedSlot: Omit<TimeSlot, 'id'>) => {
    setTimeSlots(prev => prev.map(s => s.id === id ? { ...s, ...updatedSlot } : s));
  };

  // Persistence and loading simulation for activeView
  useEffect(() => {
    if (currentPage === 'dashboard') {
      authUtils.setView(activeView);
      
      // Simulate loading when view changes
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [activeView, currentPage]);

  // Sync auth state if changed elsewhere
  useEffect(() => {
    const checkAuth = () => {
      if (authUtils.isAuthenticated() && currentPage === 'login') {
        setCurrentPage('dashboard');
      } else if (!authUtils.isAuthenticated() && currentPage === 'dashboard') {
        setCurrentPage('login');
      }
    };
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [currentPage]);

  const handleLogout = () => {
    authUtils.logout();
    setCurrentPage('login');
    setActiveView('dashboard');
  };

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  // Mock tasks with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('task_items');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Learn Advanced React Patterns', timeSlotId: '4', priority: 'High', status: 'Pending', category: '3', tags: ['1', '3'] },
      { id: 2, title: 'Weekly Market Research', timeSlotId: '5', priority: 'Medium', status: 'Pending', category: '1', tags: ['2'] },
      { id: 3, title: 'Update documentation', dueDate: '2026-04-23T09:00:00Z', priority: 'Low', status: 'Completed', category: '1', tags: ['3'] },
      { id: 4, title: 'Quick: JavaScript Deep Dive', timeSlotId: '2', priority: 'High', status: 'Pending', category: '3', tags: ['1'] },
      { id: 5, title: 'Check new YouTube tutorials', timeSlotId: '1', priority: 'Low', status: 'Pending', category: '3', tags: ['2', '3'] },
    ];
  });

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('task_items', JSON.stringify(tasks));
  }, [tasks]);

  const handleToggleTaskStatus = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
          : task
      )
    );
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    let matchesDate = true;
    if (task.dueDate) {
        const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
        const taskDate = new Date(taskDateStr).getTime();
        
        if (showTodayOnly) {
            const todayStr = new Date('2026-04-22').toISOString().split('T')[0];
            matchesDate = taskDateStr === todayStr && task.status === 'Pending';
        } else if (startDate || endDate) {
            const start = startDate ? new Date(startDate).getTime() : -Infinity;
            const end = endDate ? new Date(endDate).getTime() : Infinity;
            matchesDate = taskDate >= start && taskDate <= end;
        }
    } else if (showTodayOnly || startDate || endDate) {
        // For bucket tasks, they don't have a strict due date, so they might not match date filters
        // Unless we decide they match "Today" if the bucket repeats today.
        // For now, keep it simple: strict filters only apply to strict dates.
        matchesDate = false;
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
        return (
          <Dashboard 
            tasks={tasks}
            categories={categories}
            tags={tags}
            timeSlots={timeSlots}
            isLoading={isLoading}
            onNewTask={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }} 
            onViewChange={setActiveView}
            onToggleStatus={handleToggleTaskStatus}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        );
      case 'tasks':
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Task List</h1>
                <p className="mt-1 text-gray-600">All your saved items and reminders in one place.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
              >
                + New Task
              </button>
            </header>

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
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <select 
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
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
                        setShowTodayOnly(true);
                        setStartDate('');
                        setEndDate('');
                      } else {
                        setShowTodayOnly(false);
                      }
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      showTodayOnly ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              <TaskList 
                tasks={filteredTasks} 
                categories={categories}
                tags={tags}
                timeSlots={timeSlots}
                isLoading={isLoading} 
                title="Active Tasks" 
                showViewAll={false} 
                onToggleStatus={handleToggleTaskStatus}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </div>
        );
      case 'categories':
        return (
          <CategoryTagManager 
            categories={categories}
            tags={tags}
            timeSlots={timeSlots}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateCategory={handleUpdateCategory}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
            onUpdateTag={handleUpdateTag}
          />
        );
      case 'schedule':
        return (
          <ScheduleMenu
            timeSlots={timeSlots}
            onAddSlot={handleAddSlot}
            onDeleteSlot={handleDeleteSlot}
            onUpdateSlot={handleUpdateSlot}
          />
        );
      case 'library':
      case 'analytics':
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.253 16.5 18.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeView}</h1>
            <p className="text-gray-500 mt-2 max-w-md">This feature is coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <LoginPage onToggle={() => setCurrentPage('register')} onLogin={handleLogin} />;
      case 'register':
        return <RegistrationForm onToggle={() => setCurrentPage('login')} />;
      case 'dashboard':
        return (
          <DashboardLayout 
            activeView={activeView} 
            onViewChange={setActiveView} 
            onLogout={handleLogout}
            onNewTask={() => setIsTaskModalOpen(true)}
          >
            {renderDashboardView()}
            
            {isTaskModalOpen && (
              <div className="fixed inset-0 z-[100] overflow-y-auto">
                <div 
                  className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" 
                  onClick={() => setIsTaskModalOpen(false)}
                />
                <div className="flex min-h-full items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-200">
                    <TaskForm 
                      initialData={editingTask}
                      categories={categories}
                      tags={tags}
                      timeSlots={timeSlots}
                      onCancel={() => {
                        setIsTaskModalOpen(false);
                        setEditingTask(null);
                      }} 
                      onSubmit={(data) => {
                        if (editingTask) {
                          setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...data } : t));
                        } else {
                          const newTask: Task = {
                            ...data,
                            id: tasks.length + 1,
                            status: 'Pending'
                          };
                          setTasks(prev => [newTask, ...prev]);
                        }
                        setIsTaskModalOpen(false);
                        setEditingTask(null);
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}
          </DashboardLayout>
        );
      default:
        return <LoginPage onToggle={() => setCurrentPage('register')} onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}

export default App;
