import { requireAccount } from '@/lib/auth';
import Link from 'next/link';
import { accounts, auditEvents, getContents } from '@/lib/store';
import { allLessons, creditLessons, tiers } from '@/lib/catalog';
import { Users, BookOpen, Inbox, ShieldCheck } from 'lucide-react';
export const metadata = { title: 'Admin overview' };
export default async function Admin() {
  await requireAccount(true);
  const members = (await accounts()).filter((a) => a.role === 'member'),
    pending = members.flatMap((a) => a.state.offers.filter((o) => o.status === 'pending')),
    published = Object.values(await getContents(allLessons.map((l) => l.id))).filter(
      (c) => c.published,
    ).length,
    events = await auditEvents();
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">COURSE OPERATIONS</div>
          <h1>A clear view of your academy.</h1>
          <p>Manage members, publish lessons, and record verified approvals.</p>
        </div>
        <Link className="button primary" href="/admin/members">
          Manage members
        </Link>
      </div>
      <div className="admin-stats">
        <Link href="/admin/members">
          <Users size={22} />
          <strong>{members.length}</strong>
          <span>Member accounts</span>
        </Link>
        <Link href="/admin/curriculum">
          <BookOpen size={22} />
          <strong>
            {published}/{allLessons.length}
          </strong>
          <span>Published credit lessons</span>
        </Link>
        <Link href="/admin/approvals">
          <Inbox size={22} />
          <strong>{pending.length}</strong>
          <span>Requests awaiting review</span>
        </Link>
      </div>
      <div className="admin-feature-grid">
        <section className="admin-form">
          <h2>The approval gate</h2>
          <div className="quiet-note">
            <ShieldCheck size={22} />
            <p>
              Reapplication creates a review request. Only a recorded, verified approval increases
              the course’s accessible tier.
            </p>
          </div>
          <ol className="process-list">
            <li>Member completes a tier segment.</li>
            <li>Member requests more cash back.</li>
            <li>Your team verifies the external approval.</li>
            <li>Record the decision and reference to unlock the next segment.</li>
          </ol>
          <Link className="text-link" href="/admin/approvals">
            Open approval queue
          </Link>
        </section>
        <section className="admin-form">
          <h2>Curriculum at a glance</h2>
          {tiers.map((t, i) => (
            <div className="admin-summary-row" key={t}>
              <strong>{t}</strong>
              <span>{creditLessons.filter((l) => l.tier === i).length} lessons</span>
            </div>
          ))}
          <Link className="text-link" href="/admin/curriculum">
            Edit Credit Mastery
          </Link>
        </section>
      </div>
      <section className="admin-form">
        <h2>Recent activity</h2>
        {events.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Recorded</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 12).map((e) => (
                  <tr key={e.id}>
                    <td>{e.action}</td>
                    <td>{e.target}</td>
                    <td>{new Date(e.date).toLocaleString('en-CA', { timeZone: 'UTC' })} UTC</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No account changes have been recorded yet.</p>
        )}
      </section>
    </>
  );
}
