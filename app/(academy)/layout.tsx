import { courseView } from '@/lib/view';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { requireAccount } from '@/lib/auth';
import { getCourse } from '@/lib/catalog';
import { demoMode } from '@/lib/store';
import { Navigation } from '@/components/navigation';
export default async function AcademyLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAccount();
  const course = await courseView(user.state.activeCourse || '');
  const enrollment = course ? user.state.enrollments[course.id] : undefined;
  return (
    <div className="app-shell">
      <Navigation name={user.name} course={course} enrollment={enrollment} />
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-context">
            <span>ACADEMY</span>
            <span className="topbar-divider" />
            <strong>{course?.title || 'Your learning'}</strong>
            {enrollment && (
              <span className="topbar-tier">
                {['Starter', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite'][enrollment.tier]}
              </span>
            )}
          </div>
          <div className="topbar-actions">
            {user.role === 'admin' && <Link href="/admin">Admin area</Link>}
            <Link href="/help">Need help?</Link>
            <span className="mini-avatar" aria-label={user.name}>
              {user.name[0]}
            </span>
          </div>
        </header>
        {demoMode() && (
          <div className="demo-banner">
            Design preview · approved 140-lesson structure · credit lesson 1 is original; other
            bodies are templates
          </div>
        )}
        <main id="main" className="page-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Credit Pulse Academy</span>
          <span>Private course · Account-based progress</span>
        </footer>
      </div>
    </div>
  );
}
