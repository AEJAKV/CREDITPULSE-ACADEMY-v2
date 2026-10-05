import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { Pool } from 'pg';
import type { Account, AuditEvent, LessonContent, MemberState, Settings, Tier } from './types';
import { allLessons, creditLessons } from './catalog';
import { creditScoreContent, placeholderContent } from './content';
export function demoMode() {
  return (
    process.env.DEMO_MODE === 'true' ||
    (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production')
  );
}
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password: string, encoded: string) {
  const [salt, hash] = encoded.split(':');
  if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}
export const defaultSettings: Settings = {
  segmentDays: null,
  bonusCopy: '',
  savingsCopy:
    'Your Master Savings Book grows with each approved level. Benefit details will appear here when confirmed.',
  helpEmail: '',
};
export function emptyState(tier: Tier = 0): MemberState {
  return {
    activeCourse: null,
    approvedTier: tier,
    enrollments: {},
    offers: [],
    onboardingComplete: false,
  };
}
export function deadline(days: number | null) {
  return days ? new Date(Date.now() + days * 86400000).toISOString() : null;
}
type Memory = {
  accounts: Map<string, Account>;
  sessions: Map<string, { userId: string; expires: number }>;
  content: Map<string, LessonContent>;
  settings: Settings;
  audit: AuditEvent[];
  rates: Map<string, { hits: number; expires: number }>;
};
const globalStore = globalThis as typeof globalThis & { pulseMemory?: Memory; pulsePool?: Pool };
function memory(): Memory {
  if (!globalStore.pulseMemory) {
    const state = emptyState(1);
    state.activeCourse = 'credit-mastery';
    state.onboardingComplete = true;
    state.enrollments['credit-mastery'] = {
      courseId: 'credit-mastery',
      tier: 1,
      completed: creditLessons.filter((l) => l.tier === 0 || l.number === 5).map((l) => l.id),
      reflections: { 'credit-05': 'Set a reminder before each payment date.' },
      startedAt: new Date().toISOString(),
      deadline: deadline(7),
      saved: [],
    };
    const member: Account = {
      id: 'demo-member',
      name: 'Alex Morgan',
      email: 'member@creditpulse.demo',
      role: 'member',
      passwordHash: hashPassword('LearnWithPulse2026!'),
      state,
      createdAt: new Date().toISOString(),
    };
    const admin: Account = {
      id: 'demo-admin',
      name: 'Course Administrator',
      email: 'admin@creditpulse.demo',
      role: 'admin',
      passwordHash: hashPassword('ManageWithPulse2026!'),
      state: emptyState(),
      createdAt: new Date().toISOString(),
    };
    globalStore.pulseMemory = {
      accounts: new Map([
        [member.id, member],
        [admin.id, admin],
      ]),
      sessions: new Map(),
      content: new Map(),
      settings: {
        ...defaultSettings,
        segmentDays: 7,
        bonusCopy:
          'Sample offer: finish within your target window to be considered for bonus cash back. Final terms require confirmation.',
      },
      audit: [],
      rates: new Map(),
    };
  }
  return globalStore.pulseMemory;
}
export function pool(): Pool {
  if (!process.env.DATABASE_URL)
    throw new Error(
      'Database is not configured. Set DATABASE_URL for real accounts, or DEMO_MODE=true for a design preview.',
    );
  globalStore.pulsePool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });
  return globalStore.pulsePool;
}
function rowAccount(row: Record<string, unknown>): Account {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: row.role as Account['role'],
    passwordHash: String(row.password_hash),
    state: row.state as MemberState,
    createdAt: String(row.created_at),
  };
}
export async function accounts() {
  if (demoMode()) return Array.from(memory().accounts.values()).map((a) => structuredClone(a));
  const r = await pool().query('SELECT * FROM cp_accounts ORDER BY created_at DESC');
  return r.rows.map(rowAccount);
}
export async function accountById(id: string) {
  if (demoMode()) {
    const a = memory().accounts.get(id);
    return a ? structuredClone(a) : null;
  }
  const r = await pool().query('SELECT * FROM cp_accounts WHERE id=$1', [id]);
  return r.rows[0] ? rowAccount(r.rows[0]) : null;
}
export async function accountByEmail(email: string) {
  if (demoMode()) return (await accounts()).find((a) => a.email === email) ?? null;
  const r = await pool().query('SELECT * FROM cp_accounts WHERE email=$1', [email]);
  return r.rows[0] ? rowAccount(r.rows[0]) : null;
}
export async function createAccount(
  name: string,
  email: string,
  password: string,
  tier: Tier,
  role: Account['role'] = 'member',
) {
  const a: Account = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    role,
    state: emptyState(tier),
    createdAt: new Date().toISOString(),
  };
  if (demoMode()) {
    if ((await accounts()).some((v) => v.email === email))
      throw new Error('An account with this email already exists.');
    memory().accounts.set(a.id, a);
  } else
    await pool().query(
      'INSERT INTO cp_accounts(id,name,email,password_hash,role,state) VALUES($1,$2,$3,$4,$5,$6)',
      [a.id, name, email, a.passwordHash, role, JSON.stringify(a.state)],
    );
  return a;
}
export async function mutateAccount(
  id: string,
  mutate: (account: Account) => void | Promise<void>,
) {
  if (demoMode()) {
    const a = await accountById(id);
    if (!a) throw new Error('Member not found.');
    await mutate(a);
    memory().accounts.set(id, a);
    return a;
  }
  const client = await pool().connect();
  try {
    await client.query('BEGIN');
    const r = await client.query('SELECT * FROM cp_accounts WHERE id=$1 FOR UPDATE', [id]);
    if (!r.rows[0]) throw new Error('Member not found.');
    const a = rowAccount(r.rows[0]);
    await mutate(a);
    await client.query('UPDATE cp_accounts SET name=$2,state=$3,password_hash=$4 WHERE id=$1', [
      id,
      a.name,
      JSON.stringify(a.state),
      a.passwordHash,
    ]);
    await client.query('COMMIT');
    return a;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
export async function addSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  const hash = digest(token);
  const expires = Date.now() + 7 * 86400000;
  if (demoMode()) memory().sessions.set(hash, { userId, expires });
  else
    await pool().query('INSERT INTO cp_sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)', [
      hash,
      userId,
      new Date(expires),
    ]);
  return token;
}
export async function sessionAccount(token: string) {
  const hash = digest(token);
  if (demoMode()) {
    const s = memory().sessions.get(hash);
    return s && s.expires > Date.now() ? accountById(s.userId) : null;
  }
  const r = await pool().query(
    'SELECT user_id FROM cp_sessions WHERE token_hash=$1 AND expires_at>NOW()',
    [hash],
  );
  return r.rows[0] ? accountById(r.rows[0].user_id) : null;
}
export async function removeSession(token: string) {
  if (demoMode()) memory().sessions.delete(digest(token));
  else await pool().query('DELETE FROM cp_sessions WHERE token_hash=$1', [digest(token)]);
}
export async function invalidateSessions(userId: string) {
  if (demoMode()) {
    for (const [key, s] of memory().sessions)
      if (s.userId === userId) memory().sessions.delete(key);
  } else await pool().query('DELETE FROM cp_sessions WHERE user_id=$1', [userId]);
}
export async function rateLimit(key: string, max = 12) {
  const bucket = digest(key + Math.floor(Date.now() / 900000));
  if (demoMode()) {
    const data = memory();
    for (const [k, v] of data.rates) if (v.expires < Date.now()) data.rates.delete(k);
    const v = data.rates.get(bucket) ?? { hits: 0, expires: Date.now() + 900000 };
    v.hits++;
    data.rates.set(bucket, v);
    return v.hits <= max;
  }
  const r = await pool().query(
    "INSERT INTO cp_rate_limits(key,hits,expires_at) VALUES($1,1,NOW()+INTERVAL '15 minutes') ON CONFLICT(key) DO UPDATE SET hits=cp_rate_limits.hits+1 RETURNING hits",
    [bucket],
  );
  return r.rows[0].hits <= max;
}
export async function getSettings(): Promise<Settings> {
  if (demoMode()) return { ...memory().settings };
  const r = await pool().query("SELECT value FROM cp_config WHERE key='settings'");
  return { ...defaultSettings, ...r.rows[0]?.value };
}
export async function setSettings(settings: Settings) {
  if (demoMode()) memory().settings = settings;
  else
    await pool().query(
      "INSERT INTO cp_config(key,value) VALUES('settings',$1) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      [JSON.stringify(settings)],
    );
}
export async function getContent(id: string): Promise<LessonContent> {
  const lesson = allLessons.find((l) => l.id === id);
  if (!lesson) throw new Error('Lesson not found.');
  if (demoMode())
    return (
      memory().content.get(id) ??
      (id === 'credit-01' ? creditScoreContent : placeholderContent(lesson, true))
    );
  const r = await pool().query('SELECT value FROM cp_content WHERE lesson_id=$1', [id]);
  return r.rows[0]?.value ?? (id === 'credit-01' ? creditScoreContent : placeholderContent(lesson));
}
export async function setContent(id: string, content: LessonContent) {
  if (demoMode()) memory().content.set(id, content);
  else
    await pool().query(
      'INSERT INTO cp_content(lesson_id,value) VALUES($1,$2) ON CONFLICT(lesson_id) DO UPDATE SET value=excluded.value',
      [id, JSON.stringify(content)],
    );
}
export async function addAudit(actor: string, action: string, target: string) {
  const event = { id: randomUUID(), actor, action, target, date: new Date().toISOString() };
  if (demoMode()) memory().audit.unshift(event);
  else
    await pool().query('INSERT INTO cp_audit(id,actor,action,target) VALUES($1,$2,$3,$4)', [
      event.id,
      actor,
      action,
      target,
    ]);
}
export async function auditEvents(): Promise<AuditEvent[]> {
  if (demoMode()) return memory().audit.slice(0, 100);
  const r = await pool().query(
    'SELECT id,actor,action,target,created_at AS date FROM cp_audit ORDER BY created_at DESC LIMIT 100',
  );
  return r.rows;
}
export async function getContents(ids: string[]): Promise<Record<string, LessonContent>> {
  if (demoMode())
    return Object.fromEntries(await Promise.all(ids.map(async (id) => [id, await getContent(id)])));
  const result = await pool().query(
    'SELECT lesson_id,value FROM cp_content WHERE lesson_id=ANY($1::text[])',
    [ids],
  );
  const saved = new Map<string, LessonContent>(
    result.rows.map((row) => [row.lesson_id, row.value]),
  );
  return Object.fromEntries(
    ids.map((id) => {
      const lesson = allLessons.find((l) => l.id === id);
      if (!lesson) throw new Error('Unknown lesson.');
      return [
        id,
        saved.get(id) ?? (id === 'credit-01' ? creditScoreContent : placeholderContent(lesson)),
      ];
    }),
  );
}
