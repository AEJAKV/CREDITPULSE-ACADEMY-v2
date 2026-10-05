import { redirect } from 'next/navigation';
import { currentAccount } from '@/lib/auth';
export default async function Home() {
  const account = await currentAccount();
  redirect(account ? (account.role === 'admin' ? '/admin' : '/dashboard') : '/login');
}
