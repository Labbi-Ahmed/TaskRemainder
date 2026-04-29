"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../../../components/Dashboard/Dashboard';
import { useTaskContext } from '../../../context/TaskContext';
import TaskForm from '../../../components/Dashboard/TaskForm';
import { Task } from '../../../types';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { tasks, categories, tags, timeSlots, isLoading, toggleTaskStatus, deleteTask, setTasks } = useTaskContext();
  const [editingTask, setEditingTask] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewChange = (view: string) => {
    if (view === 'tasks') {
      router.push('/tasks');
    } else if (view === 'today') {
      router.push('/tasks?filter=Today');
    }
  };

  return (
    <>
      <Dashboard 
        tasks={tasks}
        categories={categories}
        tags={tags}
        timeSlots={timeSlots}
        isLoading={isLoading}
        onNewTask={() => {}} 
        onViewChange={handleViewChange}
        onToggleStatus={toggleTaskStatus}
        onEdit={handleEditTask}
        onDelete={deleteTask}
      />
...
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-200">
              <TaskForm 
                initialData={editingTask}
                categories={categories}
                tags={tags}
                timeSlots={timeSlots}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setEditingTask(null);
                }} 
                onSubmit={(data) => {
                  setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...data } : t));
                  setIsEditModalOpen(false);
                  setEditingTask(null);
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
