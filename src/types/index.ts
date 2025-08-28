export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BloodPressureReading {
  id: string;
  userId: string;
  systolic: number;
  diastolic: number;
  date: string;
  time: string;
  notes?: string;
  createdAt: Date;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string; // 'daily', 'twice_daily', 'weekly', etc.
  times: string[]; // Array of times like ['08:00', '20:00']
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationLog {
  id: string;
  userId: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'taken' | 'missed' | 'skipped';
  date: string;
  notes?: string;
  createdAt: Date;
}

export interface NotificationSchedule {
  id: string;
  userId: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  isActive: boolean;
  lastSent?: Date;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
