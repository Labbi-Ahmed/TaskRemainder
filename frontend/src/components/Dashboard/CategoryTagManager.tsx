import React, { useState, useMemo } from 'react';
import { Category, Tag } from '../../types';
import Button from '../Common/Button';
import Input from '../Common/Input';
import ConfirmationModal from '../Common/ConfirmationModal';

interface CategoryTagManagerProps {
  categories: Category[];
  tags: Tag[];
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
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
  onAddTag,
  onDeleteTag,
  onUpdateTag,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1'); // Default indigo
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#10b981'); // Default emerald

  // Editing state for categories (inline)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryColor, setEditCategoryColor] = useState('');

  // Editing state for tags (modal)
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'category' | 'tag' | null;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: ''
  });

  // Filtered lists for "Search-before-Add"
  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(newCategoryName.toLowerCase())
    );
  }, [categories, newCategoryName]);

  const filteredTags = useMemo(() => {
    return tags.filter(t => 
      t.name.toLowerCase().includes(newTagName.toLowerCase())
    );
  }, [tags, newTagName]);

  // Check for exact duplicates
  const categoryExists = categories.some(
    c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase()
  );
  
  const tagExists = tags.some(
    t => t.name.toLowerCase() === newTagName.trim().toLowerCase()
  );

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
      onAddTag({ name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
    }
  };

  const handleStartEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
  };

  const handleSaveEditTag = () => {
    if (editingTag && editTagName.trim()) {
      onUpdateTag(editingTag.id, {
        name: editTagName.trim(),
        color: editTagColor
      });
      setEditingTag(null);
    }
  };

  const openDeleteConfirm = (type: 'category' | 'tag', item: Category | Tag) => {
    setConfirmModal({
      isOpen: true,
      type,
      id: item.id,
      name: item.name
    });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.id && confirmModal.type) {
      if (confirmModal.type === 'category') {
        onDeleteCategory(confirmModal.id);
      } else {
        onDeleteTag(confirmModal.id);
      }
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Manage Categories & Tags</h1>
        <p className="mt-1 text-gray-600">Organize your tasks with custom categories and tags.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-[600px]">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Topic Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1">Group similar tasks together.</p>
          </div>
          
          <div className="p-6 flex flex-col flex-grow overflow-hidden">
            <form onSubmit={handleAddCategory} className="mb-6">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex-grow">
                  <Input
                    label="Search or Add Category"
                    placeholder="Type to search or add..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    title="Choose category color"
                  />
                  <Button 
                    type="submit" 
                    className="whitespace-nowrap"
                    disabled={categoryExists || !newCategoryName.trim()}
                  >
                    Add New
                  </Button>
                </div>
              </div>
              {categoryExists && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium italic">
                  This category already exists.
                </p>
              )}
            </form>

            <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {filteredCategories.length === 0 ? (
                <p className="text-center py-4 text-gray-400 italic">
                  {newCategoryName ? 'No matching categories found.' : 'No categories yet.'}
                </p>
              ) : (
                filteredCategories.map((category) => (
                  <div 
                    key={category.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      editingCategoryId === category.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {editingCategoryId === category.id ? (
                      <div className="flex flex-grow items-center space-x-3">
                        <input
                          type="color"
                          value={editCategoryColor}
                          onChange={(e) => setEditCategoryColor(e.target.value)}
                          className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-grow px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          autoFocus
                        />
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={handleSaveEditCategory}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Save"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => setEditingCategoryId(null)}
                            className="p-1 text-gray-400 hover:bg-gray-200 rounded transition-colors"
                            title="Cancel"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-gray-700">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleStartEditCategory(category)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit category"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => openDeleteConfirm('category', category)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete category"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-[600px]">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01" />
              </svg>
              Priority & Time Tags
            </h2>
            <p className="text-sm text-gray-500 mt-1">Define when or how to handle content.</p>
          </div>
          
          <div className="p-6 flex flex-col flex-grow overflow-hidden">
            <form onSubmit={handleAddTag} className="mb-6">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex-grow">
                  <Input
                    label="Search or Add Tag"
                    placeholder="Type to search or add..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    title="Choose tag color"
                  />
                  <Button 
                    type="submit" 
                    className="whitespace-nowrap"
                    disabled={tagExists || !newTagName.trim()}
                  >
                    Add New
                  </Button>
                </div>
              </div>
              {tagExists && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium italic">
                  This tag already exists.
                </p>
              )}
            </form>

            <div className="flex flex-wrap gap-2 flex-grow overflow-y-auto pr-2 custom-scrollbar content-start">
              {filteredTags.length === 0 ? (
                <p className="w-full text-center py-4 text-gray-400 italic">
                  {newTagName ? 'No matching tags found.' : 'No tags yet.'}
                </p>
              ) : (
                filteredTags.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="group relative flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer hover:shadow-sm"
                    style={{ 
                      backgroundColor: `${tag.color}10`, 
                      borderColor: `${tag.color}40`,
                      color: tag.color 
                    }}
                    onClick={() => handleStartEditTag(tag)}
                  >
                    <span>{tag.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteConfirm('tag', tag);
                      }}
                      className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                      title="Delete tag"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                      </svg>
                    </button>
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
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" 
            onClick={() => setEditingTag(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200 bg-white rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Edit Tag</h3>
                <button 
                  onClick={() => setEditingTag(null)}
                  className="text-gray-400 hover:text-gray-600 transition duration-150"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tag Name</label>
                  <Input
                    label="Tag Name"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    placeholder="Enter tag name..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tag Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={editTagColor}
                      onChange={(e) => setEditTagColor(e.target.value)}
                      className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <div className="flex-grow p-2 rounded border border-gray-100 bg-gray-50 flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: editTagColor }}
                      />
                      <span className="text-sm font-mono text-gray-600 lowercase">{editTagColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setEditingTag(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditTag} disabled={!editTagName.trim()}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={`Delete ${confirmModal.type === 'category' ? 'Category' : 'Tag'}`}
        message={`Are you sure you want to delete the ${confirmModal.type} "${confirmModal.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        variant="danger"
      />
    </div>
  );
};

export default CategoryTagManager;
