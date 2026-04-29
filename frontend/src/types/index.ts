export interface Category {
  id: string;
  name: string;
  color: string;
}

export type TimeSlotType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TimeSlot {
  id: string;
  name: string;
  type: TimeSlotType;
  hour: number;
  minute: number;
  daysOfWeek?: number[];   // For Weekly: 0-6
  weekOfMonth?: number;    // For Monthly: 1 (1st), 2 (2nd), 3 (3rd), 4 (4th), -1 (Last)
  dayOfMonth?: number;     // For Yearly/Monthly fallback: 1-31
  monthOfYear?: number;    // For Yearly: 0-11
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  timeSlotId?: string; // Optional link to a predefined time slot
  categoryId?: string; // Optional: Bind this tag to a specific category (Hybrid Model)
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

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  settings: NotificationSettings;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  soundEnabled: boolean;
  dailyDigest: boolean;
  leadTimeMinutes: number; // Remind X minutes before
  quietHoursStart?: string; // 24h format
  quietHoursEnd?: string;
}
