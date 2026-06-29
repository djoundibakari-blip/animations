export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  city: string | null;
  region: string | null;
  preferences: string[];
  schedule: "quotidien" | "hebdomadaire" | "mensuel" | null;
  scheduleDay: string | null;
  scheduleTime: string | null;
  radius: number;
  subscribed: boolean;
  createdAt: string;
  updatedAt?: string;
  lastSentAt: string | null;
  consent: boolean;
  consentDate: string;
  consentVersion: string;
  deletedAt?: string;
  rgpdDeletion?: boolean;
}

export interface UsersDB {
  users: Record<string, User>;
}

export interface HeraldEvent {
  title: string;
  date: string;
  location: string;
  address: string;
  description: string;
  url: string | null;
  source: string;
  category: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  city: string | null;
  region: string | null;
  preferences: string[];
  schedule: string | null;
  scheduleDay: string | null;
  scheduleTime: string | null;
  radius: number;
  subscribed: boolean;
  createdAt: string;
  lastSentAt: string | null;
}

export const AVAILABLE_PREFERENCES = [
  "musique",
  "cinéma",
  "théâtre",
  "sport",
  "danse",
  "expositions",
  "festivals",
  "comédie",
  "opéra",
  "cirque",
  "street art",
  "concerts",
] as const;

export type Preference = (typeof AVAILABLE_PREFERENCES)[number];
