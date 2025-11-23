export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  origin: 'chat' | 'manual';
}

export interface MoodEntry {
  timestamp: number;
  score: number; // 1-5
  note?: string;
}

export interface Memory {
  id: string;
  type: 'STM' | 'LTM';
  content: string;
  createdAt: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  MEMORY = 'MEMORY',
  JOURNAL = 'JOURNAL',
  MENTOR = 'MENTOR'
}

export interface UserContext {
  name: string;
  preferences: string[];
}