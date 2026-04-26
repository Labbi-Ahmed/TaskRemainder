export interface Category {
  id: string;
  name: string;
  color: string;
}

export type TimeSlotType = 'daily' | 'weekly' | 'monthly';

export interface TimeSlot {
  id: string;
  name: string;
  type: TimeSlotType;
  hour: number;
  minute: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;   // 1-31
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  timeSlotId?: string; // Optional link to a predefined time slot
}

export interface Task {
  id: number;
  title: string;
  contentLink?: string;
  description?: string;
  notes?: string;
  dueDate?: string;     // ISO string for custom time
  timeSlotId?: string;  // ID of the predefined time slot bucket
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Missed';
  category?: string;    // ID of the category
  tags?: string[];      // IDs of the tags
}
