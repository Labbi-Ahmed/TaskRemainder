import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import TaskList from './TaskList';
import { Task, Category, Tag, TimeSlot } from '../../types';

interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  dueTodayTasks: number;
  recentTasks: Task[];
  nextReminder: {
    title: string;
    timeLabel: string;
    type: string;
  } | null;
  disciplineScore: number;
}

interface DashboardProps {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  timeSlots: TimeSlot[];
  isLoading?: boolean;
  onNewTask?: () => void;
  onViewChange?: (view: string) => void;
  onToggleStatus?: (taskId: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  tasks, 
  categories,
  tags,
  timeSlots,
  isLoading: propLoading, 
  onNewTask, 
  onViewChange, 
  onToggleStatus, 
  onEdit, 
  onDelete 
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    dueTodayTasks: 0,
    recentTasks: [],
    nextReminder: null,
    disciplineScore: 0
  });
  const [internalLoading, setInternalLoading] = useState(true);
  const isLoading = propLoading !== undefined ? propLoading : internalLoading;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (propLoading === undefined) setInternalLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const todayStr = new Date('2026-04-22').toISOString().split('T')[0];
        const dayOfWeek = new Date('2026-04-22').getDay();
        const dayOfMonth = new Date('2026-04-22').getDate();

        // Find which buckets are "active" today
        const activeTodaySlots = timeSlots.filter(slot => {
            if (slot.type === 'daily') return true;
            if (slot.type === 'weekly') return slot.daysOfWeek?.includes(dayOfWeek);
            if (slot.type === 'monthly') return slot.dayOfMonth === dayOfMonth;
            return false;
        }).map(s => s.id);

        const dueToday = tasks.filter(t => {
            if (t.status !== 'Pending') return false;
            if (t.dueDate && t.dueDate.startsWith(todayStr)) return true;
            if (t.timeSlotId && activeTodaySlots.includes(t.timeSlotId)) return true;
            return false;
        });

        const pending = tasks.filter(t => t.status === 'Pending');
        
        // Find next reminder
        let nextRem = null;
        if (pending.length > 0) {
            const firstWithDate = pending.find(t => t.dueDate);
            const firstWithSlot = pending.find(t => t.timeSlotId);
            
            if (firstWithDate) {
                nextRem = {
                    title: firstWithDate.title,
                    timeLabel: new Date(firstWithDate.dueDate!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'Custom'
                };
            } else if (firstWithSlot) {
                const slot = timeSlots.find(s => s.id === firstWithSlot.timeSlotId);
                nextRem = {
                    title: firstWithSlot.title,
                    timeLabel: slot ? `${slot.hour}:${slot.minute.toString().padStart(2, '0')}` : 'Scheduled',
                    type: 'Bucket'
                };
            }
        }

        const completedCount = tasks.filter(t => t.status === 'Completed').length;
        const pendingCount = pending.length;
        const totalCount = tasks.length;

        // Life Discipline Score Logic:
        // Completed: 100% value
        // Pending: 50% value (Commitment made, not yet fulfilled)
        // Missed: 0% value
        let calculatedScore = 100;
        if (totalCount > 0) {
          calculatedScore = Math.round(((completedCount * 1) + (pendingCount * 0.5)) / totalCount * 100);
        }

        setStats({
          totalTasks: totalCount,
          pendingTasks: pendingCount,
          completedTasks: completedCount,
          dueTodayTasks: dueToday.length,
          disciplineScore: calculatedScore,
          nextReminder: nextRem,
          recentTasks: tasks.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (propLoading === undefined) setInternalLoading(false);
      }
    };

    fetchDashboardData();
  }, [propLoading, tasks, timeSlots]);

  const getDisciplineStatus = (score: number) => {
    if (score >= 90) return { label: 'Elite', color: 'text-indigo-600' };
    if (score >= 75) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 50) return { label: 'Good', color: 'text-yellow-600' };
    if (score >= 30) return { label: 'Fair', color: 'text-orange-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const disciplineStatus = getDisciplineStatus(stats.disciplineScore);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Stay disciplined, stay productive.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onNewTask}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
          >
            + New Task
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Tasks" 
            value={stats.totalTasks} 
            color="border-indigo-500"
            isLoading={isLoading}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingTasks} 
            color="border-yellow-500"
            isLoading={isLoading}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard 
            title="Completed" 
            value={stats.completedTasks} 
            color="border-green-500"
            isLoading={isLoading}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard 
            title="Due Today" 
            value={stats.dueTodayTasks} 
            color="border-red-500"
            isLoading={isLoading}
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            onClick={() => onViewChange?.('tasks')}
          />
        </div>

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
                <p className="text-xl font-bold leading-tight truncate">{stats.nextReminder.title}</p>
                <p className="mt-2 text-indigo-100 text-sm font-medium">
                  At {stats.nextReminder.timeLabel}
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
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-800 self-start mb-6">Life Discipline Score</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
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
              <p className={`text-xs uppercase font-bold tracking-widest mt-1 ${disciplineStatus.color}`}>
                {disciplineStatus.label}
              </p>
            </div>
          </div>
          <p className="mt-8 text-sm text-center text-gray-600 px-4">
            {stats.completedTasks > 0 ? (
                <>You've completed <span className="font-bold text-green-600">{stats.completedTasks} tasks</span>. {stats.disciplineScore > 70 ? "Your discipline is impressive!" : "Keep pushing to improve your score!"}</>
            ) : (
                <>No tasks completed yet. Start your journey today!</>
            )}
          </p>
        </div>

        <div className="lg:col-span-2">
          <TaskList 
            tasks={tasks} 
            categories={categories}
            tags={tags}
            timeSlots={timeSlots}
            isLoading={isLoading} 
            onViewChange={() => onViewChange?.('tasks')}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
