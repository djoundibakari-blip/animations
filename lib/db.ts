import { neon } from "@neondatabase/serverless";
import type { User } from "@/types";

// ─── Connexion ────────────────────────────────────────────────────────────────
// Vercel + Neon injecte DATABASE_URL, POSTGRES_URL ou STORAGE_URL selon le préfixe choisi
let _db: ReturnType<typeof neon> | null = null;

function db() {
  if (!_db) {
    const url =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL  ||
      process.env.STORAGE_URL;
    if (!url)
      throw new Error(
        "DATABASE_URL manquante — connectez le store Neon dans Vercel > Storage"
      );
    _db = neon(url);
  }
  return _db;
}

// ─── Initialisation de la table (idempotent) ─────────────────────────────────
let _tableReady = false;

async function ensureTable(): Promise<ReturnType<typeof neon>> {
  const sql = db();
  if (!_tableReady) {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id              TEXT PRIMARY KEY,
        email           TEXT UNIQUE NOT NULL,
        password_hash   TEXT NOT NULL,
        name            TEXT NOT NULL,
        city            TEXT,
        region          TEXT,
        preferences     TEXT[]   DEFAULT '{}',
        schedule        TEXT,
        schedule_day    TEXT,
        schedule_time   TEXT,
        radius          INTEGER  DEFAULT 30,
        subscribed      BOOLEAN  DEFAULT true,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ,
        last_sent_at    TIMESTAMPTZ,
        consent         BOOLEAN  DEFAULT false,
        consent_date    TIMESTAMPTZ,
        consent_version TEXT,
        deleted_at      TIMESTAMPTZ,
        rgpd_deletion   BOOLEAN  DEFAULT false
      )
    `;
    _tableReady = true;
  }
  return sql;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toIso(val: unknown): string | null {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToUser(r: any): User {
  return {
    id:             r.id,
    email:          r.email,
    passwordHash:   r.password_hash,
    name:           r.name,
    city:           r.city           ?? null,
    region:         r.region         ?? null,
    preferences:    Array.isArray(r.preferences) ? r.preferences : [],
    schedule:       r.schedule       ?? null,
    scheduleDay:    r.schedule_day   ?? null,
    scheduleTime:   r.schedule_time  ?? null,
    radius:         r.radius         ?? 30,
    subscribed:     r.subscribed     ?? true,
    createdAt:      toIso(r.created_at)!,
    updatedAt:      toIso(r.updated_at) ?? undefined,
    lastSentAt:     toIso(r.last_sent_at),
    consent:        r.consent        ?? false,
    consentDate:    toIso(r.consent_date) ?? new Date().toISOString(),
    consentVersion: r.consent_version ?? "1.0",
    deletedAt:      toIso(r.deleted_at) ?? undefined,
    rgpdDeletion:   r.rgpd_deletion  ?? false,
  };
}

// ─── API publique ─────────────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  const sql = await ensureTable();
  const rows = (await sql`
    SELECT * FROM users WHERE id = ${id} AND rgpd_deletion IS NOT TRUE
  `) as Record<string, unknown>[];
  return rows.length ? rowToUser(rows[0]) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const sql = await ensureTable();
  const rows = (await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase()} AND rgpd_deletion IS NOT TRUE
  `) as Record<string, unknown>[];
  return rows.length ? rowToUser(rows[0]) : null;
}

export async function saveUser(user: User): Promise<void> {
  const sql = await ensureTable();
  await sql`
    INSERT INTO users (
      id, email, password_hash, name,
      city, region, preferences,
      schedule, schedule_day, schedule_time, radius, subscribed,
      created_at, last_sent_at,
      consent, consent_date, consent_version
    ) VALUES (
      ${user.id}, ${user.email}, ${user.passwordHash}, ${user.name},
      ${user.city}, ${user.region}, ${user.preferences},
      ${user.schedule}, ${user.scheduleDay}, ${user.scheduleTime},
      ${user.radius}, ${user.subscribed},
      ${user.createdAt}, ${user.lastSentAt},
      ${user.consent}, ${user.consentDate}, ${user.consentVersion}
    )
    ON CONFLICT (id) DO UPDATE SET
      email         = EXCLUDED.email,
      password_hash = EXCLUDED.password_hash,
      name          = EXCLUDED.name,
      updated_at    = NOW()
  `;
}

export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<User | null> {
  const sql = await ensureTable();
  const user = await getUserById(id);
  if (!user) return null;

  await sql`
    UPDATE users SET
      city          = ${updates.city          !== undefined ? updates.city          : user.city},
      region        = ${updates.region        !== undefined ? updates.region        : user.region},
      preferences   = ${updates.preferences   !== undefined ? updates.preferences   : user.preferences},
      schedule      = ${updates.schedule      !== undefined ? updates.schedule      : user.schedule},
      schedule_day  = ${updates.scheduleDay   !== undefined ? updates.scheduleDay   : user.scheduleDay},
      schedule_time = ${updates.scheduleTime  !== undefined ? updates.scheduleTime  : user.scheduleTime},
      radius        = ${updates.radius        !== undefined ? updates.radius        : user.radius},
      updated_at    = NOW()
    WHERE id = ${id}
  `;
  return getUserById(id);
}

export async function anonymizeUser(id: string): Promise<boolean> {
  const sql = await ensureTable();
  const rows = (await sql`SELECT id FROM users WHERE id = ${id}`) as Record<string, unknown>[];
  if (!rows.length) return false;

  await sql`
    UPDATE users SET
      email         = '[SUPPRIME]',
      password_hash = '[SUPPRIME]',
      name          = '[SUPPRIME]',
      city          = NULL,
      region        = NULL,
      preferences   = '{}',
      schedule      = NULL,
      schedule_day  = NULL,
      schedule_time = NULL,
      subscribed    = false,
      consent       = false,
      deleted_at    = NOW(),
      rgpd_deletion = true
    WHERE id = ${id}
  `;
  return true;
}

export async function addPendingEmail(data: object): Promise<string> {
  // Loggé côté serveur, traité par le scheduler externe
  console.log("[herald:pending-email]", JSON.stringify(data));
  return `pending_${Date.now()}`;
}
