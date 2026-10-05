import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionAccount } from './store';
export const sessionCookie = 'cp_session';
export const currentAccount = cache(async function currentAccount() {
  const cookie = (await cookies()).get(sessionCookie)?.value;
  return cookie ? sessionAccount(cookie) : null;
});
export async function requireAccount(admin = false) {
  const account = await currentAccount();
  if (!account) redirect('/login');
  if (admin && account.role !== 'admin') redirect('/dashboard');
  return account;
}
