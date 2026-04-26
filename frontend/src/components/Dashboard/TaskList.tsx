import React, { useState, useRef, useEffect } from 'react';
import ConfirmationModal from '../Common/ConfirmationModal';
import { TaskSkeleton } from '../Common/Skeleton';
import { Task, Category, Tag } from '../../types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  categories: Category[];
  tags: Tag[];
  title?: string;
  showViewAll?: boolean;
  onViewChange?: () => void;
  onToggleStatus?: (taskId: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  isLoading, 
  categories,
  tags,
  title = 'Urgent Tasks', 
  showViewAll = true, 
  onViewChange,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'status';
    taskId: number | null;
    taskTitle: string;
  }>({
    isOpen: false,
    type: 'delete',
    taskId: null,
    taskTitle: ''
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is on any of the toggle buttons
      const isButtonClick = Object.values(buttonRefs.current).some(
        btn => btn && btn.contains(event.target as Node)
      );

      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !isButtonClick) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuToggle = (taskId: number) => {
    if (activeMenu === taskId) {
      setActiveMenu(null);
    } else {
      const button = buttonRefs.current[taskId];
      if (button) {
        const rect = button.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // If less than 200px space below, open upwards
        setMenuDirection(spaceBelow < 200 ? 'up' : 'down');
      }
      setActiveMenu(taskId);
    }
  };

  const displayTasks = title === 'Urgent Tasks' ? tasks.filter(t => t.status === 'Pending') : tasks;

  const handleOpenConfirm = (type: 'delete' | 'status', task: Task) => {
    setConfirmModal({
      isOpen: true,
      type,
      taskId: task.id,
      taskTitle: task.title
    });
    setActiveMenu(null);
  };

  const handleConfirmAction = () => {
    if (confirmModal.taskId !== null) {
      if (confirmModal.type === 'delete') {
        onDelete?.(confirmModal.taskId);
      } else {
        onToggleStatus?.(confirmModal.taskId);
      }
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const getCategory = (id?: string) => {
    if (!id) return null;
    return categories.find(c => c.id === id);
  };

  const getTag = (id: string) => {
    return tags.find(t => t.id === id);
  };

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col w-full relative">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center relative z-20 bg-white rounded-t-xl">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {showViewAll && (
          <button 
            onClick={onViewChange}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View All
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100 flex-grow relative">
        {isLoading ? (
          <>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </>
        ) : displayTasks.length > 0 ? (
          displayTasks.map((task) => {
            const category = getCategory(task.category);
            return (
              <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition duration-150">
                <div className="flex items-center overflow-hidden min-w-0">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-4 ${
                    task.priority === 'High' ? 'bg-red-500' : 
                    task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-semibold truncate ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {task.title}
                      </h4>
                      {category && (
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded text-white font-bold uppercase"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center mt-1 gap-2">
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      {task.tags?.map(tagId => {
                        const tag = getTag(tagId);
                        if (!tag) return null;
                        return (
                          <span 
                            key={tagId}
                            className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${tag.color}15`, 
                              color: tag.color,
                              border: `1px solid ${tag.color}30`
                            }}
                          >
                            #{tag.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status}
                  </span>
                  
                  <div className="relative">
                    <button 
                      ref={el => { buttonRefs.current[task.id] = el; }}
                      onClick={() => handleMenuToggle(task.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition duration-150 focus:outline-none"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {activeMenu === task.id && (
                      <div 
                        ref={menuRef}
                        className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100] transform transition-all duration-200 ease-out origin-top-right
                          ${menuDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}
                          animate-in fade-in zoom-in duration-200`}
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            onClick={() => {
                              onEdit?.(task);
                              setActiveMenu(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M17.114 8.454a2.121 2.121 0 00-3 0l-9.586 9.586V21h2.96l9.586-9.586a2.121 2.121 0 000-3l-1.114-1.114z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleOpenConfirm('status', task)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
                          </button>
                          <button
                            onClick={() => handleOpenConfirm('delete', task)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            role="menuitem"
                          >
                            <svg className="mr-3 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <svg className="h-12 w-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p>No tasks found matching your filters.</p>
          </div>
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center rounded-b-xl relative z-20">
         <div className="flex -space-x-2 mr-4">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
              </div>
            ))}
         </div>
         <p className="text-xs text-gray-500">Shared tasks with 3 teammates</p>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'delete' ? 'Delete Task' : 'Update Task Status'}
        message={confirmModal.type === 'delete' 
          ? `Are you sure you want to delete "${confirmModal.taskTitle}"? This action cannot be undone.`
          : `Do you want to mark "${confirmModal.taskTitle}" as ${tasks.find(t => t.id === confirmModal.taskId)?.status === 'Completed' ? 'Pending' : 'Completed'}?`
        }
        confirmLabel={confirmModal.type === 'delete' ? 'Delete' : 'Confirm'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        variant={confirmModal.type === 'delete' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default TaskList;
