import React from 'react';
import { Task, Category, Tag, TimeSlot } from '../../types';
import Button from '../Common/Button';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  tags: Tag[];
  timeSlots: TimeSlot[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  categories,
  tags,
  timeSlots,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !task) return null;

  const category = categories.find(c => c.id === task.category);
  
  const taskTags = task.tags?.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[];

  const formatSchedule = () => {
    if (task.timeSlotId) {
      const slot = timeSlots.find(s => s.id === task.timeSlotId);
      return slot ? `${slot.name} (${slot.hour}:${slot.minute.toString().padStart(2, '0')})` : 'Bucket Routine';
    }
    if (task.dueDate) {
      return new Date(task.dueDate).toLocaleString([], { 
        dateStyle: 'full', 
        timeStyle: 'short' 
      });
    }
    return 'No schedule set';
  };

  const priorityColors = {
    High: 'text-red-700 bg-red-50 border-red-100',
    Medium: 'text-yellow-700 bg-yellow-50 border-yellow-100',
    Low: 'text-green-700 bg-green-50 border-green-100'
  };

  const statusColors = {
    Pending: 'text-indigo-700 bg-indigo-50 border-indigo-100',
    Completed: 'text-green-700 bg-green-50 border-green-100',
    Missed: 'text-gray-700 bg-gray-50 border-gray-100'
  };

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header with Category Color Strip */}
          <div 
            className="h-2 w-full" 
            style={{ backgroundColor: category?.color || '#e5e7eb' }}
          />

          <div className="px-6 py-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                {category && (
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white mb-2"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                )}
                <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
                  {task.title}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${priorityColors[task.priority]}`}>
                {task.priority} Priority
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>

            <div className="space-y-6">
              {/* Schedule */}
              <div className="flex items-start space-x-3 text-sm">
                <div className="mt-0.5 text-indigo-500 bg-indigo-50 p-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-0.5">Scheduled For</p>
                  <p className="text-gray-600 font-medium">{formatSchedule()}</p>
                </div>
              </div>

              {/* Content Link */}
              {task.contentLink && (
                <div className="flex items-start space-x-3 text-sm">
                  <div className="mt-0.5 text-blue-500 bg-blue-50 p-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-0.5">Content Link</p>
                    <a 
                      href={task.contentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium break-all underline decoration-blue-200 underline-offset-2 hover:decoration-blue-500 transition-all block"
                    >
                      {task.contentLink}
                    </a>
                  </div>
                </div>
              )}

              {/* Description */}
              {task.description && (
                <div className="flex items-start space-x-3 text-sm">
                  <div className="mt-0.5 text-gray-500 bg-gray-50 p-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-0.5">Description</p>
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{task.description}</p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {taskTags.length > 0 && (
                <div className="flex items-start space-x-3 text-sm">
                  <div className="mt-0.5 text-pink-500 bg-pink-50 p-1.5 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-1.5">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {taskTags.map(tag => (
                        <span 
                          key={tag.id}
                          className="px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all"
                          style={{ 
                            backgroundColor: `${tag.color}08`, 
                            color: tag.color,
                            borderColor: `${tag.color}30`
                          }}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {task.notes && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="font-bold text-amber-900 uppercase text-[10px] tracking-wider mb-1 flex items-center">
                    <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M17.114 8.454a2.121 2.121 0 00-3 0l-9.586 9.586V21h2.96l9.586-9.586a2.121 2.121 0 000-3l-1.114-1.114z" />
                    </svg>
                    Notes
                  </p>
                  <p className="text-amber-800 text-sm italic leading-relaxed whitespace-pre-wrap">{task.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                onEdit?.(task);
                onClose();
              }}
            >
              Edit Task
            </Button>
            <Button 
              variant="secondary" 
              className="w-full sm:w-auto"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
                  onDelete?.(task.id);
                  onClose();
                }
              }}
            >
              <span className="text-red-600">Delete</span>
            </Button>
            <Button 
              variant="secondary" 
              className="w-full sm:w-auto sm:mr-auto"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
