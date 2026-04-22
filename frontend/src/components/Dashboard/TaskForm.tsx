import React, { useState } from 'react';
import Input from '../Common/Input';
import Select from '../Common/Select';
import Textarea from '../Common/Textarea';
import Button from '../Common/Button';

interface TaskFormProps {
  onCancel: () => void;
  onSubmit: (taskData: any) => void;
  initialData?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    contentLink: initialData?.contentLink || '',
    description: initialData?.description || '',
    notes: initialData?.notes || '',
    dueDate: initialData?.dueDate || '',
    priority: initialData?.priority || 'Medium',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date and time are required';
    
    if (formData.contentLink && !/^https?:\/\/.+/.test(formData.contentLink)) {
      newErrors.contentLink = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto border border-gray-100">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition duration-150"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Task Title</label>
            <Input
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="What do you want to save?"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Content Link (URL)</label>
            <Input
              label="Content Link"
              name="contentLink"
              type="url"
              value={formData.contentLink}
              onChange={handleChange}
              error={errors.contentLink}
              placeholder="https://example.com/article-or-video"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short summary of the content"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Notes</label>
            <Textarea
              label="Notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Why is this important? Any extra context?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Schedule Reminder</label>
            <Input
              label="Schedule Reminder"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Priority</label>
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={[
                { value: 'High', label: '🔥 High Priority' },
                { value: 'Medium', label: '⚡ Medium Priority' },
                { value: 'Low', label: '🌱 Low Priority' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Category</label>
            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Learning, Work, Personal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Tags</label>
            <Input
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Comma separated: video, react, urgent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-50">
          <Button 
            type="button" 
            variant="secondary" 
            fullWidth={false} 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isSubmitting} 
            fullWidth={false}
            className="px-10"
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
