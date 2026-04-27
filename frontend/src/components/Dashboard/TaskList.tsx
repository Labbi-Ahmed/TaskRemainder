import React, { useState, useRef, useEffect, useMemo } from 'react';
import ConfirmationModal from '../Common/ConfirmationModal';
import TaskDetailModal from './TaskDetailModal';
import { TaskSkeleton } from '../Common/Skeleton';
import { Task, Category, Tag, TimeSlot } from '../../types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  categories: Category[];
  tags: Tag[];
  timeSlots: TimeSlot[];
  title?: string;
  showViewAll?: boolean;
  onViewChange?: () => void;
  onToggleStatus?: (taskId: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

const ITEMS_PER_PAGE = 5;

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  isLoading, 
  categories,
  tags,
  timeSlots,
  title = 'Urgent Tasks', 
  showViewAll = true, 
  onViewChange,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset pagination when tasks change (e.g. filter changes from parent)
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [tasks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
        setMenuDirection(spaceBelow < 200 ? 'up' : 'down');
      }
      setActiveMenu(taskId);
    }
  };

  const allFilteredTasks = useMemo(() => {
    return title === 'Urgent Tasks' ? tasks.filter(t => t.status === 'Pending') : tasks;
  }, [tasks, title]);

  const displayTasks = useMemo(() => {
    return allFilteredTasks.slice(0, visibleCount);
  }, [allFilteredTasks, visibleCount]);

  const hasMore = visibleCount < allFilteredTasks.length;

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!hasMore || isLoading || isPaginationLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isPaginationLoading, visibleCount]);

  const loadMoreItems = () => {
    setIsPaginationLoading(true);
    // Simulate loading delay for better UX feel
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsPaginationLoading(false);
    }, 800);
  };

  const handleOpenConfirm = (type: 'delete' | 'status', task: Task) => {
    setConfirmModal({
      isOpen: true,
      type,
      taskId: task.id,
      taskTitle: task.title
    });
    setActiveMenu(null);
  };

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

  const formatSchedule = (task: Task) => {
    if (task.timeSlotId) {
      const slot = timeSlots.find(s => s.id === task.timeSlotId);
      return slot ? `Next Reminder: ${slot.name}` : 'Schedule: Bucket';
    }
    if (task.dueDate) {
      return `Due: ${new Date(task.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`;
    }
    return 'No active reminder';
  };

  const formatTime = (hour: number, minute: number) => {
    const h = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
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
          </>
        ) : displayTasks.length > 0 ? (
          <>
            {displayTasks.map((task) => {
              const category = getCategory(task.category);
              return (
                <div 
                  key={task.id} 
                  onClick={() => setViewingTask(task)}
                  className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition duration-150 border-l-4 border-transparent hover:border-indigo-500 cursor-pointer group/item"
                >
                  <div className="flex items-center overflow-hidden min-w-0">
                    <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mr-4 ${
                      task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                      task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-bold truncate group-hover/item:text-indigo-600 transition-colors ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        {category && (
                          <span 
                            className="text-[9px] px-1.5 py-0.5 rounded text-white font-black uppercase tracking-wider"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-1.5 space-y-2">
                        <div className="flex items-center text-[11px] text-gray-500 font-medium bg-gray-100/50 self-start px-2 py-0.5 rounded">
                          <svg className="w-3 h-3 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatSchedule(task)}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {task.tags?.map(tagId => {
                            const tag = getTag(tagId);
                            if (!tag) return null;
                            const slot = tag.timeSlotId ? timeSlots.find(s => s.id === tag.timeSlotId) : null;
                            return (
                              <div 
                                key={tagId}
                                className="flex items-center px-2 py-0.5 rounded-lg border transition-all space-x-1.5"
                                style={{ 
                                  backgroundColor: `${tag.color}08`, 
                                  color: tag.color,
                                  borderColor: `${tag.color}30`
                                }}
                              >
                                <span className="text-[10px] font-bold leading-none">#{tag.name}</span>
                                {slot && (
                                  <span className="text-[8px] opacity-70 font-medium border-l pl-1.5 border-current/20">
                                    {formatTime(slot.hour, slot.minute)}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-indigo-50 text-indigo-600'
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
            })}
            
            {/* Infinite Scroll Trigger & Loader */}
            {hasMore && (
              <div ref={loadMoreRef} className="py-8">
                {isPaginationLoading && (
                  <div className="space-y-0 divide-y divide-gray-100">
                    <TaskSkeleton />
                    <TaskSkeleton />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <svg className="h-12 w-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p>No tasks found.</p>
          </div>
        )}
      </div>

      <TaskDetailModal
        task={viewingTask}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        categories={categories}
        tags={tags}
        timeSlots={timeSlots}
        onEdit={onEdit}
        onDelete={onDelete}
      />

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
