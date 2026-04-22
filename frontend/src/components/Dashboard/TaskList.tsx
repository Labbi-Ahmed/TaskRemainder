import React from 'react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
}

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading }) => {
  const pendingTasks = tasks.filter(t => t.status === 'Pending');

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Urgent Tasks</h3>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View All</button>
      </div>
      <div className="divide-y divide-gray-100 flex-grow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading your tasks...</div>
        ) : pendingTasks.length > 0 ? (
          pendingTasks.map((task) => (
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
  );
};

export default TaskList;
