import { kv } from "@vercel/kv";
import type { User } from "@/types";

const userKey  = (id: string)    => `user:${id}`;
const emailKey = (email: string) => `email:${email.toLowerCase()}`;

export async function getUserById(id: string): Promise<User | null> {
  const user = await kv.get<User>(userKey(id));
  if (!user || user.rgpdDeletion) return null;
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const id = await kv.get<string>(emailKey(email.toLowerCase()));
  if (!id) return null;
  return getUserById(id);
}

export async function saveUser(user: User): Promise<void> {
  await kv.set(userKey(user.id), user);
  await kv.set(emailKey(user.email), user.id);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUserById(id);
  if (!user) return null;
  const updated: User = { ...user, ...updates, updatedAt: new Date().toISOString() };
  await kv.set(userKey(id), updated);
  return updated;
}

export async function anonymizeUser(id: string): Promise<boolean> {
  const user = await kv.get<User>(userKey(id));
  if (!user) return false;
  await kv.del(emailKey(user.email));
  const anonymized: User = {
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
  await kv.set(userKey(id), anonymized);
  return true;
}

export async function addPendingEmail(data: object): Promise<string> {
  const key = `pending:agenda_${Date.now()}`;
  await kv.set(key, data, { ex: 60 * 60 * 24 * 7 }); // expire après 7 jours
  return key;
}
