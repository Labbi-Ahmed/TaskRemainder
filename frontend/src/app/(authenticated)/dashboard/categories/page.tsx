"use client";
import React from 'react';
import { useTaskContext } from '../../../../context/TaskContext';
import CategoryTagManager from '../../../../components/Dashboard/CategoryTagManager';

export default function CategoriesPage() {
  const { 
    categories, tags, timeSlots, 
    addCategory, deleteCategory, updateCategory,
    addTag, deleteTag, updateTag
  } = useTaskContext();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <CategoryTagManager 
        categories={categories}
        tags={tags}
        timeSlots={timeSlots}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onUpdateCategory={updateCategory}
        onAddTag={addTag}
        onDeleteTag={deleteTag}
        onUpdateTag={updateTag}
      />
    </div>
  );
}
