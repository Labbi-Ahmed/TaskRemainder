"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Category, Tag, Task, TaskFormData, TimeSlot, User, NotificationSettings } from '../types';
import { authUtils } from '../utils/auth';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  timeSlots: TimeSlot[];
  user: User;
  isLoading: boolean;
  mounted: boolean;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, updatedCategory: Omit<Category, 'id'>) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, updatedTag: Omit<Tag, 'id'>) => void;
  addSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  deleteSlot: (id: string) => void;
  updateSlot: (id: string, updatedSlot: Omit<TimeSlot, 'id'>) => void;
  addTask: (data: TaskFormData) => void;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateSettings: (newSettings: NotificationSettings) => void;
  counts: {
    all: number;
    today: number;
    pending: number;
    completed: number;
    overdue: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const SAMPLE_DATE = '2026-01-01T00:00:00.000Z';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<User>(() => ({
    firstName: 'Ahmed',
    lastName: 'Labbi',
    email: 'ahmed@example.com',
    profilePicture: '',
    settings: {
      pushEnabled: false,
      emailEnabled: true,
      inAppEnabled: true,
      soundEnabled: true,
      dailyDigest: false,
      leadTimeMinutes: 15,
    }
  }));

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setMounted(true);

    const savedUser = localStorage.getItem('user_profile');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedCategories = localStorage.getItem('task_categories');
    setCategories(savedCategories ? JSON.parse(savedCategories) : [
      { id: '1', name: 'Work', color: '#6366f1' },
      { id: '2', name: 'Personal', color: '#10b981' },
      { id: '3', name: 'Learning', color: '#f59e0b' },
    ]);

    const savedTags = localStorage.getItem('task_tags');
    setTags(savedTags ? JSON.parse(savedTags) : [
      { id: '1', name: 'Tonight', color: '#ef4444' },
      { id: '2', name: 'Weekly', color: '#3b82f6', categoryId: '1' },
      { id: '3', name: 'React', color: '#06b6d4', categoryId: '3' },
    ]);

    const savedSlots = localStorage.getItem('task_time_slots');
    setTimeSlots(savedSlots ? JSON.parse(savedSlots) : [
      { id: '1', name: 'Morning Routine', type: 'daily', hour: 7, minute: 30 },
      { id: '2', name: 'Morning Commute', type: 'daily', hour: 8, minute: 30 },
      { id: '3', name: 'Lunch Break', type: 'daily', hour: 13, minute: 0 },
      { id: '4', name: 'Deep Learning', type: 'daily', hour: 20, minute: 0 },
      { id: '5', name: 'Weekend Learning', type: 'weekly', hour: 10, minute: 0, daysOfWeek: [0, 6] },
    ]);

    const savedTasks = localStorage.getItem('task_items');
    setTasks(savedTasks ? JSON.parse(savedTasks) : [
      { id: '1', title: 'Learn Advanced React Patterns', timeSlotId: '4', priority: 'High', status: 'Pending', category: '3', tags: ['3'], createdAt: SAMPLE_DATE, updatedAt: SAMPLE_DATE },
      { id: '2', title: 'Weekly Market Research', timeSlotId: '5', priority: 'Medium', status: 'Pending', category: '1', tags: ['2'], createdAt: SAMPLE_DATE, updatedAt: SAMPLE_DATE },
      { id: '3', title: 'Update documentation', dueDate: '2026-04-23T09:00:00Z', priority: 'Low', status: 'Completed', category: '1', tags: ['2'], createdAt: SAMPLE_DATE, updatedAt: SAMPLE_DATE },
      { id: '4', title: 'Quick: JavaScript Deep Dive', timeSlotId: '2', priority: 'High', status: 'Pending', category: '3', tags: ['1'], createdAt: SAMPLE_DATE, updatedAt: SAMPLE_DATE },
      { id: '5', title: 'Check new YouTube tutorials', timeSlotId: '1', priority: 'Low', status: 'Pending', category: '3', tags: ['1', '3'], createdAt: SAMPLE_DATE, updatedAt: SAMPLE_DATE },
    ]);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const reload = () => {
      const saved = localStorage.getItem('task_items');
      if (saved) setTasks(JSON.parse(saved));
    };
    window.addEventListener('extension-task-added', reload);
    return () => window.removeEventListener('extension-task-added', reload);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('user_profile', JSON.stringify(user));
  }, [user, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem('task_categories', JSON.stringify(categories));
  }, [categories, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem('task_tags', JSON.stringify(tags));
  }, [tags, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem('task_time_slots', JSON.stringify(timeSlots));
  }, [timeSlots, mounted]);

  useEffect(() => {
    if (mounted) localStorage.setItem('task_items', JSON.stringify(tasks));
  }, [tasks, mounted]);

  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: crypto.randomUUID() }]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateCategory = (id: string, updatedCategory: Omit<Category, 'id'>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
  };

  const addTag = (tag: Omit<Tag, 'id'>) => {
    setTags(prev => [...prev, { ...tag, id: crypto.randomUUID() }]);
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const updateTag = (id: string, updatedTag: Omit<Tag, 'id'>) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, ...updatedTag } : t));
  };

  const addSlot = (slot: Omit<TimeSlot, 'id'>) => {
    setTimeSlots(prev => [...prev, { ...slot, id: crypto.randomUUID() }]);
  };

  const deleteSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(s => s.id !== id));
    setTags(prev => prev.map(t => t.timeSlotId === id ? { ...t, timeSlotId: undefined } : t));
  };

  const updateSlot = (id: string, updatedSlot: Omit<TimeSlot, 'id'>) => {
    setTimeSlots(prev => prev.map(s => s.id === id ? { ...s, ...updatedSlot } : s));
  };

  const addTask = (data: TaskFormData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskStatus = (taskId: string) => {
    const now = new Date().toISOString();
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed', updatedAt: now }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setUser(prev => ({ ...prev, settings: newSettings }));
  };

  const counts = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date().getTime();

    return {
      all: tasks.length,
      today: tasks.filter(t => t.dueDate?.startsWith(todayStr) && t.status === 'Pending').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status === 'Pending' && t.dueDate && new Date(t.dueDate).getTime() < now).length
    };
  }, [tasks]);

  const value = {
    tasks,
    categories,
    tags,
    timeSlots,
    user,
    isLoading,
    mounted,
    setTasks,
    setUser,
    addCategory,
    deleteCategory,
    updateCategory,
    addTag,
    deleteTag,
    updateTag,
    addSlot,
    deleteSlot,
    updateSlot,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateSettings,
    counts
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
