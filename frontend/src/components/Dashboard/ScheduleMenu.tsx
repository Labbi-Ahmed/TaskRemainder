"use client";
import React, { useState } from 'react';
import { TimeSlot, TimeSlotType } from '../../types';
import Button from '../Common/Button';
import Input from '../Common/Input';
import SearchableSelect from '../Common/SearchableSelect';
import ConfirmationModal from '../Common/ConfirmationModal';

interface ScheduleMenuProps {
  timeSlots: TimeSlot[];
  onAddSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  onDeleteSlot: (id: string) => void;
  onUpdateSlot: (id: string, slot: Omit<TimeSlot, 'id'>) => void;
}

const ScheduleMenu: React.FC<ScheduleMenuProps> = ({
  timeSlots,
  onAddSlot,
  onDeleteSlot,
  onUpdateSlot,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TimeSlotType>('daily');
  const [time, setTime] = useState('09:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [weekOfMonth, setWeekOfMonth] = useState(1);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [monthOfYear, setMonthOfYear] = useState(0);

  // Edit state
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<TimeSlotType>('daily');
  const [editTime, setEditTime] = useState('09:00');
  const [editDaysOfWeek, setEditDaysOfWeek] = useState<number[]>([]);
  const [editWeekOfMonth, setEditWeekOfMonth] = useState(1);
  const [editDayOfMonth, setEditDayOfMonth] = useState(1);
  const [editMonthOfYear, setEditMonthOfYear] = useState(0);

  // Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<TimeSlot | null>(null);

  const daysOptions = [
    { value: '0', label: 'Sunday', short: 'Sun' },
    { value: '1', label: 'Monday', short: 'Mon' },
    { value: '2', label: 'Tuesday', short: 'Tue' },
    { value: '3', label: 'Wednesday', short: 'Wed' },
    { value: '4', label: 'Thursday', short: 'Thu' },
    { value: '5', label: 'Friday', short: 'Fri' },
    { value: '6', label: 'Saturday', short: 'Sat' },
  ];

  const occurrenceOptions = [
    { value: '1', label: 'First' },
    { value: '2', label: 'Second' },
    { value: '3', label: 'Third' },
    { value: '4', label: 'Fourth' },
    { value: '-1', label: 'Last' },
  ];

  const monthsOptions = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString()
  }));

  const repeatOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const [hour, minute] = time.split(':').map(Number);
    onAddSlot({
      name: name.trim(),
      type,
      hour,
      minute,
      daysOfWeek: (type === 'weekly' || type === 'monthly') ? daysOfWeek : undefined,
      weekOfMonth: type === 'monthly' ? weekOfMonth : undefined,
      dayOfMonth: (type === 'monthly' || type === 'yearly') ? dayOfMonth : undefined,
      monthOfYear: type === 'yearly' ? monthOfYear : undefined,
    });

    // Reset
    setName('');
    setType('daily');
    setTime('09:00');
    setDaysOfWeek([]);
  };

  const handleStartEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setEditName(slot.name);
    setEditType(slot.type);
    setEditTime(`${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`);
    setEditDaysOfWeek(slot.daysOfWeek || []);
    setEditWeekOfMonth(slot.weekOfMonth || 1);
    setEditDayOfMonth(slot.dayOfMonth || 1);
    setEditMonthOfYear(slot.monthOfYear || 0);
  };

  const handleSaveEdit = () => {
    if (!editingSlot || !editName.trim()) return;

    const [hour, minute] = editTime.split(':').map(Number);
    onUpdateSlot(editingSlot.id, {
      name: editName.trim(),
      type: editType,
      hour,
      minute,
      daysOfWeek: (editType === 'weekly' || editType === 'monthly') ? editDaysOfWeek : undefined,
      weekOfMonth: editType === 'monthly' ? editWeekOfMonth : undefined,
      dayOfMonth: (editType === 'monthly' || editType === 'yearly') ? editDayOfMonth : undefined,
      monthOfYear: editType === 'yearly' ? editMonthOfYear : undefined,
    });

    setEditingSlot(null);
  };

  const toggleDay = (day: number, isEdit = false, single = false) => {
    const current = isEdit ? editDaysOfWeek : daysOfWeek;
    const setter = isEdit ? setEditDaysOfWeek : setDaysOfWeek;
    
    if (single) {
        setter([day]);
        return;
    }

    if (current.includes(day)) {
      setter(current.filter(d => d !== day));
    } else {
      setter([...current, day].sort());
    }
  };

  const formatTime = (hour: number, minute: number) => {
    const h = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const renderRecurrenceOptions = (
      currentType: TimeSlotType, 
      currentDays: number[], 
      currentWeek: number, 
      currentMonthDay: number,
      currentYearMonth: number,
      isEdit = false
  ) => {
    switch (currentType) {
        case 'daily':
            return <p className="text-[10px] text-gray-400 italic mt-1 ml-1">Triggers every day at the selected time.</p>;
        
        case 'weekly':
            return (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Days</label>
                    <div className="grid grid-cols-7 gap-1">
                    {daysOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggleDay(parseInt(opt.value), isEdit)}
                            className={`h-9 w-full rounded-lg text-[10px] font-bold transition-all border ${
                                currentDays.includes(parseInt(opt.value))
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                            }`}
                        >
                            {opt.short}
                        </button>
                    ))}
                    </div>
                </div>
            );

        case 'monthly':
            return (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Occurrence</label>
                        <div className="flex flex-wrap gap-1">
                            {occurrenceOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => isEdit ? setEditWeekOfMonth(parseInt(opt.value)) : setWeekOfMonth(parseInt(opt.value))}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                        currentWeek === parseInt(opt.value)
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Of the Week</label>
                        <div className="grid grid-cols-7 gap-1">
                            {daysOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => toggleDay(parseInt(opt.value), isEdit, true)}
                                    className={`h-9 w-full rounded-lg text-[10px] font-bold transition-all border ${
                                        currentDays[0] === parseInt(opt.value)
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                                    }`}
                                >
                                    {opt.short}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 italic ml-1">e.g., "The {occurrenceOptions.find(o => parseInt(o.value) === currentWeek)?.label} {daysOptions.find(d => parseInt(d.value) === currentDays[0])?.label || 'Day'} of every month"</p>
                </div>
            );

        case 'yearly':
            return (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Month</label>
                            <SearchableSelect
                                label="Month"
                                value={currentYearMonth.toString()}
                                onChange={(val) => isEdit ? setEditMonthOfYear(parseInt(val)) : setMonthOfYear(parseInt(val))}
                                options={monthsOptions}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Date</label>
                            <SearchableSelect
                                label="Date"
                                value={currentMonthDay.toString()}
                                onChange={(val) => isEdit ? setEditDayOfMonth(parseInt(val)) : setDayOfMonth(parseInt(val))}
                                options={monthDayOptions}
                            />
                        </div>
                    </div>
                </div>
            );
        
        default:
            return null;
    }
  };

  const getSlotSummary = (slot: TimeSlot) => {
    switch (slot.type) {
      case 'daily': return 'Every Day';
      case 'weekly': return `Weekly on ${slot.daysOfWeek?.map(d => daysOptions[d].short).join(', ')}`;
      case 'monthly': 
        const occ = occurrenceOptions.find(o => o.value === slot.weekOfMonth?.toString())?.label;
        const day = daysOptions.find(d => d.value === slot.daysOfWeek?.[0]?.toString())?.label;
        return `Monthly on the ${occ} ${day}`;
      case 'yearly':
        const month = monthsOptions.find(m => m.value === slot.monthOfYear?.toString())?.label;
        return `Yearly on ${month} ${slot.dayOfMonth}`;
      default: return slot.type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Schedule Menu</h1>
        <p className="mt-1 text-gray-600">Define custom time slots for your smart tags.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Slot Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Time Slot</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Slot Name"
                placeholder="e.g., Morning Commute"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Repeat Type</label>
                <SearchableSelect
                  label="Repeat Type"
                  value={type}
                  onChange={(val) => setType(val as TimeSlotType)}
                  options={repeatOptions}
                />
              </div>

              {renderRecurrenceOptions(type, daysOfWeek, weekOfMonth, dayOfMonth, monthOfYear)}

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Target Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <Button type="submit" className="w-full mt-6">
                Add Slot
              </Button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Your Time Slots</h2>
            </div>
            <div className="p-6">
              {timeSlots.length === 0 ? (
                <p className="text-center py-8 text-gray-400 italic">No time slots defined yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timeSlots.map((slot) => (
                    <div 
                      key={slot.id}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:shadow-sm transition-shadow group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">{slot.name}</h3>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleStartEdit(slot)}
                            className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => {
                              setSlotToDelete(slot);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(slot.hour, slot.minute)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {getSlotSummary(slot)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-[110] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" 
            onClick={() => setEditingSlot(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 transform transition-all animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b">Edit Time Slot</h3>
              
              <div className="space-y-6">
                <Input
                  label="Slot Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Repeat Type</label>
                  <SearchableSelect
                    label="Repeat Type"
                    value={editType}
                    onChange={(val) => setEditType(val as TimeSlotType)}
                    options={repeatOptions}
                  />
                </div>

                {renderRecurrenceOptions(editType, editDaysOfWeek, editWeekOfMonth, editDayOfMonth, editMonthOfYear, true)}

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Target Time</label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setEditingSlot(null)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Time Slot"
        message={`Are you sure you want to delete the time slot "${slotToDelete?.name}"? Tags linked to this slot will no longer have an automatic schedule.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (slotToDelete) onDeleteSlot(slotToDelete.id);
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        variant="danger"
      />
    </div>
  );
};

export default ScheduleMenu;
