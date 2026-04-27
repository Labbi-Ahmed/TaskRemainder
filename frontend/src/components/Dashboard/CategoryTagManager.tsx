import React, { useState, useMemo } from 'react';
import { Category, Tag, TimeSlot } from '../../types';
import Button from '../Common/Button';
import Input from '../Common/Input';
import SearchableSelect from '../Common/SearchableSelect';
import ConfirmationModal from '../Common/ConfirmationModal';

interface CategoryTagManagerProps {
  categories: Category[];
  tags: Tag[];
  timeSlots: TimeSlot[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCategory: (id: string, category: Omit<Category, 'id'>) => void;
  onAddTag: (tag: Omit<Tag, 'id'>) => void;
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, tag: Omit<Tag, 'id'>) => void;
}

const CategoryTagManager: React.FC<CategoryTagManagerProps> = ({
  categories,
  tags,
  timeSlots,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
  onAddTag,
  onDeleteTag,
  onUpdateTag,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#10b981');
  
  // Selection State for Hybrid Binding
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  
  // Filtering state
  const [filterSlotId, setFilterSlotId] = useState('none');

  // Editing state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryColor, setEditCategoryColor] = useState('');

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');
  const [editTagTimeSlotId, setEditTagTimeSlotId] = useState('none');

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'category' | 'tag' | null;
    id: string | null;
    name: string;
  }>({ isOpen: false, type: null, id: null, name: '' });

  const activeCategory = useMemo(() => 
    categories.find(c => c.id === activeCategoryId),
  [categories, activeCategoryId]);

  const filteredCategories = useMemo(() => 
    categories.filter(c => c.name.toLowerCase().includes(newCategoryName.toLowerCase())),
  [categories, newCategoryName]);

  const filteredTags = useMemo(() => {
    return tags.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(newTagName.toLowerCase());
      const matchesSlot = filterSlotId === 'none' || t.timeSlotId === filterSlotId;
      
      // Filter by Active Category (Hybrid logic)
      const matchesCategory = t.categoryId === (activeCategoryId || undefined);
      
      return matchesSearch && matchesSlot && matchesCategory;
    });
  }, [tags, newTagName, filterSlotId, activeCategoryId]);

  const categoryExists = categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase());
  const tagExists = tags.some(t => t.name.toLowerCase() === newTagName.trim().toLowerCase() && t.categoryId === (activeCategoryId || undefined));

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && !categoryExists) {
      onAddCategory({ name: newCategoryName.trim(), color: newCategoryColor });
      setNewCategoryName('');
    }
  };

  const handleStartEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    setEditCategoryColor(category.color);
  };

  const handleSaveEditCategory = () => {
    if (editingCategoryId && editCategoryName.trim()) {
      onUpdateCategory(editingCategoryId, { 
        name: editCategoryName.trim(), 
        color: editCategoryColor 
      });
      setEditingCategoryId(null);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim() && !tagExists) {
      onAddTag({ 
        name: newTagName.trim(), 
        color: newTagColor,
        timeSlotId: filterSlotId === 'none' ? undefined : filterSlotId,
        categoryId: activeCategoryId || undefined
      });
      setNewTagName('');
    }
  };

  const handleStartEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
    setEditTagTimeSlotId(tag.timeSlotId || 'none');
  };

  const handleSaveEditTag = () => {
    if (editingTag && editTagName.trim()) {
      onUpdateTag(editingTag.id, {
        name: editTagName.trim(),
        color: editTagColor,
        timeSlotId: editTagTimeSlotId === 'none' ? undefined : editTagTimeSlotId,
        // Category binding is immutable after creation
        categoryId: editingTag.categoryId
      });
      setEditingTag(null);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmModal.id && confirmModal.type) {
      if (confirmModal.type === 'category') {
        onDeleteCategory(confirmModal.id);
        if (activeCategoryId === confirmModal.id) setActiveCategoryId(null);
      } else {
        onDeleteTag(confirmModal.id);
      }
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const timeSlotOptions = useMemo(() => [
    { value: 'none', label: 'No Automatic Schedule' },
    ...timeSlots.map(slot => ({
      value: slot.id,
      label: `${slot.name} (${slot.hour}:${slot.minute.toString().padStart(2, '0')})`
    }))
  ], [timeSlots]);


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Manage Categories & Tags</h1>
        <p className="mt-1 text-gray-600 italic">Organization Tip: Select a category to create tags specifically for it, or stay in 'Global' for general scheduling.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-[600px]">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Topic Categories</h2>
                <p className="text-xs text-gray-500 mt-1">Select one to manage its specific tags.</p>
            </div>
            <button 
                onClick={() => setActiveCategoryId(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!activeCategoryId ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
                View Global
            </button>
          </div>
          
          <div className="p-6 flex flex-col flex-grow overflow-hidden">
            <form onSubmit={handleAddCategory} className="mb-6">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex-grow">
                  <Input
                    label="New Category"
                    placeholder="e.g., Work, Learning..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="h-10 w-10 rounded border border-gray-300 cursor-pointer" />
                  <Button type="submit" disabled={categoryExists || !newCategoryName.trim()}>Add</Button>
                </div>
              </div>
            </form>

            <div className="space-y-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => setActiveCategoryId(activeCategoryId === category.id ? null : category.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    activeCategoryId === category.id 
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500' 
                      : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                  }`}
                >
                    {editingCategoryId === category.id ? (
                        <div className="flex flex-grow items-center space-x-3" onClick={e => e.stopPropagation()}>
                             <input type="color" value={editCategoryColor} onChange={(e) => setEditCategoryColor(e.target.value)} className="h-8 w-8 rounded border border-gray-300" />
                             <input type="text" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} className="flex-grow px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500" autoFocus />
                             <button onClick={handleSaveEditCategory} className="p-1 text-green-600 hover:bg-green-100 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></button>
                             <button onClick={() => setEditingCategoryId(null)} className="p-1 text-red-500 hover:bg-red-100 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: category.color }} />
                                <span className={`font-bold text-sm ${activeCategoryId === category.id ? 'text-indigo-900' : 'text-gray-700'}`}>{category.name}</span>
                            </div>
                            <div className="flex items-center space-x-1 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); handleStartEditCategory(category); }} className="p-1 text-gray-600 hover:text-indigo-600">
<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                <button onClick={(e) => { e.stopPropagation(); setConfirmModal({ isOpen: true, type: 'category', id: category.id, name: category.name }); }} className="p-1 text-red-500 hover:text-red-700"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        </>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-[600px]">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-800">
                    {activeCategoryId ? `Tags for ${activeCategory?.name}` : 'Global Tags'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    {activeCategoryId ? 'Visible only with this category.' : 'Visible for all tasks.'}
                </p>
            </div>
            <div className={`w-8 h-8 rounded-full shadow-inner ${!activeCategoryId ? 'bg-gray-200' : ''}`} style={{ backgroundColor: activeCategory?.color }} />
          </div>
          
          <div className="p-6 flex flex-col flex-grow overflow-hidden">
            <div className="space-y-4 mb-6">
              <form onSubmit={handleAddTag} className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="flex-grow">
                    <Input
                      label="New Tag"
                      placeholder={`Add to ${activeCategory?.name || 'Global'}...`}
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="color" value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)} className="h-10 w-10 rounded border border-gray-300 cursor-pointer" />
                    <Button type="submit" disabled={tagExists || !newTagName.trim()}>Add</Button>
                  </div>
                </div>
                
                <SearchableSelect
                  label="Filter Routine"
                  options={timeSlotOptions}
                  value={filterSlotId}
                  onChange={setFilterSlotId}
                  placeholder="Select a routine to filter..."
                />
              </form>
            </div>

            <div className="flex flex-wrap gap-2 flex-grow overflow-y-auto pr-2 custom-scrollbar content-start border-t border-gray-50 pt-4">
              {filteredTags.length === 0 ? (
                <p className="w-full text-center py-8 text-gray-400 italic">No tags found for this view.</p>
              ) : (
                filteredTags.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="group relative flex flex-col space-y-1 px-3 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer hover:shadow-md min-w-[120px]"
                    style={{ backgroundColor: `${tag.color}05`, borderColor: `${tag.color}30` }}
                    onClick={() => handleStartEditTag(tag)}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: tag.color }}>{tag.name}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setConfirmModal({ isOpen: true, type: 'tag', id: tag.id, name: tag.name }); }} 
                        className="transition-all transform hover:scale-110 active:scale-95 group/del"
                        style={{ color: tag.color }}
                      >
                        <svg 
                          className="w-3.5 h-3.5 opacity-70 group-hover/del:opacity-100 transition-opacity" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {tag.timeSlotId && (
                      <div className="flex items-center text-[10px] text-gray-400 mt-1">
                        <svg 
                          className="w-3 h-3 mr-1 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate leading-tight">
                          {timeSlots.find(s => s.id === tag.timeSlotId)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tag Edit Modal */}
      {editingTag && (
        <div className="fixed inset-0 z-[110] overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setEditingTag(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Tag</h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
                  {editingTag.categoryId ? `Bound to: ${categories.find(c => c.id === editingTag.categoryId)?.name}` : 'Global Tag'}
                </span>
              </div>
              <div className="space-y-6">
                <Input label="Tag Name" value={editTagName} onChange={(e) => setEditTagName(e.target.value)} />
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tag Color</label>
                  <input type="color" value={editTagColor} onChange={(e) => setEditTagColor(e.target.value)} className="h-10 w-full rounded border border-gray-300 cursor-pointer" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Routine Slot</label>
                    <SearchableSelect options={timeSlotOptions} value={editTagTimeSlotId} onChange={setEditTagTimeSlotId} label="Routine" />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setEditingTag(null)}>Cancel</Button>
                <Button onClick={handleSaveEditTag}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={`Delete ${confirmModal.type === 'category' ? 'Category' : 'Tag'}`}
        message={`Are you sure you want to delete "${confirmModal.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        variant="danger"
      />
    </div>
  );
};

export default CategoryTagManager;
