export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  contentLink?: string;
  description?: string;
  notes?: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Missed';
  category?: string; // ID of the category
  tags?: string[]; // IDs of the tags
}
