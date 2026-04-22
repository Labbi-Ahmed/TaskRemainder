import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    dueTodayTasks: 0,
    recentTasks: [],
    nextReminder: null,
    disciplineScore: 85 // Mock percentage
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock Data
        setStats({
          totalTasks: 24,
          pendingTasks: 12,
          completedTasks: 12,
          dueTodayTasks: 4,
          disciplineScore: 78,
          nextReminder: {
            title: 'Weekly Sync Meeting',
            time: '2026-04-22T10:00:00Z',
            type: 'Meeting'
          },
          recentTasks: [
            { id: 1, title: 'Finalize project proposal', dueDate: '2026-04-22T17:00:00Z', priority: 'High', status: 'Pending' },
            { id: 2, title: 'Team standup meeting', dueDate: '2026-04-22T10:00:00Z', priority: 'Medium', status: 'Pending' },
            { id: 3, title: 'Update documentation', dueDate: '2026-04-23T09:00:00Z', priority: 'Low', status: 'Completed' },
            { id: 4, title: 'Client follow-up call', dueDate: '2026-04-22T14:30:00Z', priority: 'High', status: 'Pending' },
            { id: 5, title: 'Weekly task review', dueDate: '2026-04-24T16:00:00Z', priority: 'Medium', status: 'Pending' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, color, icon }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${color} transition duration-300 hover:shadow-lg`}>
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Stay disciplined, stay productive.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200">
            Export Report
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200">
            + New Task
          </button>
        </div>
      </header>

      {/* Top Section: Stats & Next Reminder */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Tasks" 
            value={stats.totalTasks} 
            color="border-indigo-500"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingTasks} 
            color="border-yellow-500"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard 
            title="Completed" 
            value={stats.completedTasks} 
            color="border-green-500"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard 
            title="Due Today" 
            value={stats.dueTodayTasks} 
            color="border-red-500"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>

        {/* Next Reminder Highlight */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-100 mb-4 flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Next Reminder
            </h3>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-indigo-400 rounded w-3/4"></div>
                <div className="h-6 bg-indigo-400 rounded w-1/2"></div>
              </div>
            ) : stats.nextReminder ? (
              <>
                <p className="text-xl font-bold leading-tight">{stats.nextReminder.title}</p>
                <p className="mt-2 text-indigo-100 text-sm font-medium">
                  At {new Date(stats.nextReminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="mt-4 inline-block bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold">
                  {stats.nextReminder.type}
                </div>
              </>
            ) : (
              <p className="text-indigo-100">No upcoming reminders</p>
            )}
          </div>
          <svg className="absolute -bottom-4 -right-4 h-24 w-24 text-white opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Discipline & Progress Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-800 self-start mb-6">Life Discipline Score</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - stats.disciplineScore / 100)}
                strokeLinecap="round"
                className="text-indigo-600 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-gray-800">{stats.disciplineScore}%</span>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Excellent</p>
            </div>
          </div>
          <p className="mt-8 text-sm text-center text-gray-600 px-4">
            You've completed <span className="font-bold text-green-600">12 tasks</span> on time this week. Your discipline is improving!
          </p>
          <div className="mt-6 w-full space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Task Completion</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-[85%]" />
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>On-time Rate</span>
              <span>72%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-[72%]" />
            </div>
          </div>
        </div>

        {/* Urgent Tasks List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Urgent Tasks</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View All</button>
          </div>
          <div className="divide-y divide-gray-100 flex-grow">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">Loading your tasks...</div>
            ) : stats.recentTasks.filter(t => t.status === 'Pending').length > 0 ? (
              stats.recentTasks.filter(t => t.status === 'Pending').map((task) => (
                <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition duration-150">
                  <div className="flex items-center overflow-hidden">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-4 ${
                      task.priority === 'High' ? 'bg-red-500' : 
                      task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{task.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(task.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <button className="p-2 text-gray-400 hover:text-green-600 transition duration-150" title="Complete">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition duration-150" title="Edit">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M17.114 8.454a2.121 2.121 0 00-3 0l-9.586 9.586V21h2.96l9.586-9.586a2.121 2.121 0 000-3l-1.114-1.114z" /></svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <svg className="h-12 w-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <p>No urgent tasks. Relax!</p>
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center">
             <div className="flex -space-x-2 mr-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
             </div>
             <p className="text-xs text-gray-500">Shared tasks with 3 teammates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
