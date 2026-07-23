export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  preferences: {
    favoriteColors: string[];
    naturePreference: NaturePreference;
    budgetLevel: BudgetLevel;
  };
  createdAt: string;
}

export type NaturePreference = 'Beach' | 'Mountains' | 'Forest' | 'Temples' | 'Wellness retreats' | 'Parks' | 'Lakes' | 'Quiet cafés';
export type BudgetLevel = 'Low' | 'Middle' | 'Upper Middle' | 'High';

export interface MoodLog {
  id?: string;
  userId: string;
  mood: string;
  emojis: string[];
  journalEntry: string;
  stressLevel: number;
  anxietyLevel: number;
  happinessLevel: number;
  timestamp: any;
}

export interface HealthLog {
  id?: string;
  userId: string;
  cycleDay?: number;
  symptoms: string[];
  waterIntake: number;
  sleepHours: number;
  exerciseMinutes: number;
  weight?: number;
  energyLevel: number;
  timestamp: any;
}

export interface PlannerTask {
  id?: string;
  userId: string;
  title: string;
  type: 'Meditation' | 'Stretching' | 'Reading' | 'Walking' | 'Gratitude' | 'Hydration' | 'Skin Care' | 'Relaxation';
  completed: boolean;
  date: string;
}

export interface RecoveryPlan {
  id?: string;
  userId: string;
  issue: string;
  content: {
    morningRoutine: string[];
    eveningRoutine: string[];
    meditation: string;
    exercise: string;
    journaling: string;
    nutrition: string;
    sleepSchedule: string;
    readingSuggestions: string[];
    musicSuggestions: string[];
    natureActivities: string[];
  };
  createdAt: any;
}

export interface GratitudeLog {
  id?: string;
  userId: string;
  items: string[];
  date: string;
  timestamp: any;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
