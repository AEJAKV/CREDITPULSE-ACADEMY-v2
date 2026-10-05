import { readFile } from 'node:fs/promises';
import { pool, accountByEmail, createAccount, setSettings, defaultSettings } from '../lib/store';
import { emailField } from '../lib/http';
async function main() {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE === 'true')
    throw new Error(
      'Set DATABASE_URL and DEMO_MODE=false in .env.local before running database setup. Local demo needs no setup.',
    );
  const email = emailField(process.env.ADMIN_EMAIL);
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12)
    throw new Error('Set ADMIN_PASSWORD to your own password of at least 12 characters.');
  const db = pool();
  await db.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
  if (await accountByEmail(email))
    console.log('This account already exists. Setup has not changed its password or role.');
  else {
    await createAccount('Course Administrator', email, password, 0, 'admin');
    console.log(`Administrator created: ${email}. Use the password you set in .env.local.`);
  }
  await db.query(
    "INSERT INTO cp_config(key,value) VALUES('settings',$1) ON CONFLICT(key) DO NOTHING",
    [JSON.stringify(defaultSettings)],
  );
  await db.query('DELETE FROM cp_sessions WHERE expires_at<NOW()');
  await db.query('DELETE FROM cp_rate_limits WHERE expires_at<NOW()');
  console.log('Database ready. Run npm run dev, then sign in at /login.');
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (process.env.DATABASE_URL) await pool().end();
  });
