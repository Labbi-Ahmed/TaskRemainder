import React from 'react';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-lg transition duration-150 group ${
      active
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <div className={`flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`}>
      {icon}
    </div>
    {!collapsed && (
      <span className={`ml-3 text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300`}>
        {label}
      </span>
    )}
  </button>
);

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNewTask: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, collapsed, onToggleCollapse, onNewTask, onLogout }) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> 
    },
    { 
      id: 'tasks', 
      label: 'Task List', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> 
    },
    { 
      id: 'library', 
      label: 'Library', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.253 16.5 18.253" /></svg> 
    },
    { 
      id: 'schedule', 
      label: 'Schedule', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> 
    },
    { 
      id: 'categories', 
      label: 'Categories & Tags', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01" /></svg> 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
    },
  ];

  return (
    <div 
      className={`bg-white h-full border-r border-gray-100 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 flex items-center justify-between overflow-hidden">
        {!collapsed && <span className="text-xl font-bold text-indigo-600">Menu</span>}
        <button 
          onClick={onToggleCollapse}
          className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-indigo-600 transition-colors"
        >
          {collapsed ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          )}
        </button>
      </div>

      <div className="px-4 mb-4">
        <button 
          onClick={onNewTask}
          className={`flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${
            collapsed ? 'w-12 h-12 mx-auto' : 'w-full py-3 px-4'
          }`}
          title="Create New Task"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {!collapsed && <span className="ml-3 font-bold text-sm">New Task</span>}
        </button>
      </div>

      <nav className="flex-grow px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={activeView === item.id}
            onClick={() => onViewChange(item.id)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button 
          className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition duration-150 group"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          {!collapsed && <span className="ml-3 text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
