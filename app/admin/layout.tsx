export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { requireAccount } from '@/lib/auth';
import { demoMode } from '@/lib/store';
import { Navigation } from '@/components/navigation';
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAccount(true);
  return (
    <div className="app-shell admin-shell">
      <Navigation name={user.name} admin />
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-context">
            <span>ADMINISTRATION</span>
            <span className="topbar-divider" />
            <strong>Credit Pulse Academy</strong>
          </div>
          <Link href="/dashboard">View member experience</Link>
        </header>
        {demoMode() && (
          <div className="demo-banner">
            Demo administration · changes are temporary · cash-back decisions must be verified
            outside this app
          </div>
        )}
        <main id="main" className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
