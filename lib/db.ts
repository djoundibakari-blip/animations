import fs from "fs";
import path from "path";
import type { User, UsersDB } from "@/types";

const DATA_DIR =
  process.env.HERALD_DATA_DIR ||
  path.join(process.cwd(), "..", "data", "herald");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PENDING_DIR = path.join(DATA_DIR, "pending");

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PENDING_DIR))
    fs.mkdirSync(PENDING_DIR, { recursive: true });
}

export function loadDB(): UsersDB {
  ensureDirs();
  if (!fs.existsSync(USERS_FILE)) return { users: {} };
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")) as UsersDB;
  } catch {
    return { users: {} };
  }
}

export function saveDB(db: UsersDB): void {
  ensureDirs();
  fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), "utf8");
}

export function getUserById(id: string): User | null {
  const db = loadDB();
  const user = db.users[id];
  return user && !user.rgpdDeletion ? user : null;
}

export function getUserByEmail(email: string): User | null {
  const db = loadDB();
  return (
    Object.values(db.users).find(
      (u) => u.email === email.toLowerCase() && !u.rgpdDeletion
    ) ?? null
  );
}

export function saveUser(user: User): void {
  const db = loadDB();
  db.users[user.id] = user;
  saveDB(db);
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const db = loadDB();
  if (!db.users[id] || db.users[id].rgpdDeletion) return null;
  db.users[id] = {
    ...db.users[id],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as User;
  saveDB(db);
  return db.users[id];
}

export function anonymizeUser(id: string): boolean {
  const db = loadDB();
  if (!db.users[id]) return false;
  const user = db.users[id];
  db.users[id] = {
    id,
    email: "[SUPPRIME]",
    passwordHash: "[SUPPRIME]",
    name: "[SUPPRIME]",
    city: null,
    region: null,
    preferences: [],
    schedule: null,
    scheduleDay: null,
    scheduleTime: null,
    radius: 30,
    subscribed: false,
    createdAt: user.createdAt,
    lastSentAt: null,
    consent: false,
    consentDate: user.consentDate,
    consentVersion: user.consentVersion,
    deletedAt: new Date().toISOString(),
    rgpdDeletion: true,
  };
  saveDB(db);
  return true;
}

export function addPendingEmail(data: object): string {
  ensureDirs();
  const filename = `agenda_${Date.now()}.json`;
  const filepath = path.join(PENDING_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");
  return filepath;
}
