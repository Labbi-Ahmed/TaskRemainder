"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Input from '../Common/Input';
import Select from '../Common/Select';
import SearchableSelect from '../Common/SearchableSelect';
import Textarea from '../Common/Textarea';
import Button from '../Common/Button';
import { Category, Tag, TimeSlot } from '../../types';

interface TaskFormProps {
  onCancel: () => void;
  onSubmit: (taskData: any) => void;
  initialData?: any;
  categories: Category[];
  tags: Tag[];
  timeSlots: TimeSlot[];
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel, onSubmit, initialData, categories, tags, timeSlots }) => {
  // Format initial date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatInitialDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [scheduleSelection, setScheduleSelection] = useState<string>(
    initialData?.timeSlotId ? initialData.timeSlotId : (initialData?.dueDate ? 'custom' : '')
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    contentLink: initialData?.contentLink || '',
    description: initialData?.description || '',
    notes: initialData?.notes || '',
    dueDate: formatInitialDate(initialData?.dueDate),
    priority: initialData?.priority || 'Medium',
    category: initialData?.category || '',
    tags: (initialData?.tags || []) as string[],
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

  const handleCategoryChange = (val: string) => {
    setFormData(prev => ({ ...prev, category: val }));
    if (errors.category) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const handleScheduleChange = (val: string) => {
    setScheduleSelection(val);
    if (errors.scheduleSelection) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.scheduleSelection;
        return newErrors;
      });
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      const index = currentTags.indexOf(tagId);
      if (index > -1) {
        currentTags.splice(index, 1);
      } else {
        currentTags.push(tagId);
      }
      return { ...prev, tags: currentTags };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    
    if (scheduleSelection === 'custom' && !formData.dueDate) {
      newErrors.dueDate = 'Due date and time are required for custom scheduling';
    }
    
    if (scheduleSelection !== 'custom' && !scheduleSelection) {
      newErrors.scheduleSelection = 'Please select a schedule option';
    }
    
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
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const validTags = formData.tags.filter(tagId => {
        const tag = tags.find(t => t.id === tagId);
        if (!tag) return false;
        return tag.categoryId === (formData.category || undefined);
      });

      const taskData = {
        ...formData,
        tags: validTags,
        dueDate: scheduleSelection === 'custom' ? new Date(formData.dueDate).toISOString() : undefined,
        timeSlotId: scheduleSelection !== 'custom' ? scheduleSelection : undefined
      };
      
      onSubmit(taskData);
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scheduleOptions = useMemo(() => [
    { value: 'custom', label: '🗓️ Custom Time Slot', isSpecial: true },
    ...timeSlots.map(slot => ({
      value: slot.id,
      label: `${slot.name} (${slot.hour}:${slot.minute.toString().padStart(2, '0')})`
    }))
  ], [timeSlots]);

  const categoryOptions = useMemo(() => 
    categories.map(c => ({ value: c.id, label: c.name, color: c.color })),
    [categories]
  );

  const filteredTags = useMemo(() => {
    return tags.filter(tag => {
      if (formData.category) {
        return tag.categoryId === formData.category;
      } else {
        return !tag.categoryId;
      }
    });
  }, [tags, formData.category]);

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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Notes</label>
            <Textarea
              label="Notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Extra context or thoughts..."
            />
          </div>

          {/* Unified Scheduling UI */}
          <div className="md:col-span-2 space-y-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Schedule Reminder</label>
            
            <div className="space-y-4">
              <SearchableSelect
                label="Select Time"
                options={scheduleOptions}
                value={scheduleSelection}
                onChange={handleScheduleChange}
                error={errors.scheduleSelection}
                placeholder="Select a time slot"
              />

              {scheduleSelection === 'custom' && (
                <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Input
                    label="Custom Time Slot"
                    name="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={handleChange}
                    error={errors.dueDate}
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic ml-1 font-medium">Pick an exact time for this notification.</p>
                </div>
              )}
            </div>
            {scheduleSelection !== 'custom' && scheduleSelection && (
              <p className="text-[10px] text-gray-400 italic ml-1 font-medium">Assigned to a recurring routine bucket.</p>
            )}
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
            <SearchableSelect
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={handleCategoryChange}
              error={errors.category}
              placeholder="Search category..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {formData.category ? `Tags for ${categories.find(c => c.id === formData.category)?.name}` : 'Global Tags'}
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-white min-h-[50px]">
              {filteredTags.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No relevant tags available.</p>
              ) : (
                filteredTags.map((tag) => {
                  const isSelected = formData.tags.includes(tag.id);
                  const slot = tag.timeSlotId ? timeSlots.find(s => s.id === tag.timeSlotId) : null;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-200 flex items-center space-x-1.5 ${
                        isSelected 
                          ? 'text-white shadow-md' 
                          : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? tag.color : undefined,
                        borderColor: isSelected ? tag.color : undefined
                      }}
                    >
                      <span className="flex items-center">
                        {slot && (
                            <svg className="w-2.5 h-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {tag.name}
                      </span>
                      {slot && (
                        <span className={`text-[8px] border-l pl-1.5 font-medium ${isSelected ? 'text-white/80 border-white/20' : 'text-gray-300 border-gray-100'}`}>
                           {slot.hour}:{slot.minute.toString().padStart(2, '0')}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
            <p className="text-[9px] text-gray-400 mt-2 italic ml-1">* Select a category above to see related tags.</p>
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
