export enum EnergyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface MedicationLog {
  id: string;
  name: string; // Optional, can be "Quick Dose"
  timestamp: number;
  taken: boolean;
  photoUrl?: string;
}

export interface DailyRecord {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  timestamp: number;
  
  // Mood
  moodValue: number; // -5 to +5
  energyLevel: EnergyLevel;
  keywords: string[];
  note: string;

  // Sleep
  sleepTime: string; // HH:mm
  wakeTime: string; // HH:mm
  sleepQuality: number; // 1-5
  sleepIssues: string[]; // 'Insomnia', 'Early Wake', etc.

  // Triggers/Events
  events: string[]; // 'Conflict', 'Alcohol', etc.
  eventImpact: 'negative' | 'neutral' | 'positive';

  // Warnings
  warningSigns: string[]; // 'Impulse Shopping', etc.
}

export interface AppState {
  records: DailyRecord[];
  medications: MedicationLog[];
  safetyPlan: SafetyPlan;
}

export interface SafetyPlan {
  contacts: { name: string; phone: string; relation: string }[];
  reminders: string[]; // "You are not your thoughts"
}

export type ViewState = 'record' | 'dashboard' | 'safety' | 'settings';
