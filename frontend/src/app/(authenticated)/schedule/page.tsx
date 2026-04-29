"use client";
import React from 'react';
import { useTaskContext } from '../../../context/TaskContext';
import ScheduleMenu from '../../../components/Dashboard/ScheduleMenu';

export default function SchedulePage() {
  const { timeSlots, addSlot, deleteSlot, updateSlot } = useTaskContext();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ScheduleMenu
        timeSlots={timeSlots}
        onAddSlot={addSlot}
        onDeleteSlot={deleteSlot}
        onUpdateSlot={updateSlot}
      />
    </div>
  );
}
