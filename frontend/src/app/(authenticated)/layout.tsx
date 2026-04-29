"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TaskProvider, useTaskContext } from '../../context/TaskContext';
import Sidebar from '../../components/Layout/Sidebar';
import UserBadge from '../../components/Common/UserBadge';
import { authUtils } from '../../utils/auth';
import TaskForm from '../../components/Dashboard/TaskForm';

function AuthenticatedLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, addTask, categories, tags, timeSlots } = useTaskContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const handleLogout = () => {
    authUtils.logout();
    router.push('/login');
  };

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
  };

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={handleLogout}
      />

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 flex-shrink-0 z-30">
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
          </div>

          <UserBadge
            user={user}
            onLogout={handleLogout}
            onNavigate={(view) => {
              if (view === 'profile') router.push('/settings/profile');
              else if (view === 'settings') router.push('/settings');
              else router.push('/dashboard');
            }}
          />
        </header>

        <main className="flex-grow overflow-y-auto bg-gray-50">
          {children}
        </main>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl shadow-indigo-200 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-40 group"
          title="Create New Task"
        >
          <svg className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            New Task (N)
          </span>
        </button>
      </div>

      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsTaskModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-200">
              <TaskForm
                categories={categories}
                tags={tags}
                timeSlots={timeSlots}
                onCancel={() => setIsTaskModalOpen(false)}
                onSubmit={(data) => {
                  addTask(data);
                  setIsTaskModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <TaskProvider>
      <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
    </TaskProvider>
  );
}
