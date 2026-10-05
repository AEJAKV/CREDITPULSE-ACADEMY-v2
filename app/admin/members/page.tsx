import { requireAccount } from '@/lib/auth';
import Link from 'next/link';
import { accounts } from '@/lib/store';
import { tiers, getCourse } from '@/lib/catalog';
import { CreateMember } from '@/components/admin-forms';
export const metadata = { title: 'Members' };
export default async function Members({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAccount(true);
  const params = await searchParams,
    q = (params.q || '').toLowerCase(),
    members = (await accounts()).filter(
      (a) => a.role === 'member' && `${a.name} ${a.email}`.toLowerCase().includes(q),
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">MEMBER MANAGEMENT</div>
          <h1>People and their progress.</h1>
          <p>Create private accounts with a verified initial tier.</p>
        </div>
      </div>
      <CreateMember />
      <section className="admin-form">
        <div className="section-heading">
          <h2>Member directory</h2>
          <form className="search-form">
            <label className="sr-only" htmlFor="member-search">
              Find a member
            </label>
            <input
              name="q"
              id="member-search"
              type="search"
              placeholder="Search name or email"
              defaultValue={params.q}
            />
            <button className="button secondary">Search</button>
          </form>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Current course</th>
                <th>Tier</th>
                <th>Progress</th>
                <th>Account</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const course = getCourse(member.state.activeCourse || ''),
                  enrollment = course ? member.state.enrollments[course.id] : undefined;
                return (
                  <tr key={member.id}>
                    <td>
                      <strong>{member.name}</strong>
                      <small>{member.email}</small>
                    </td>
                    <td>{course?.title || 'Awaiting course choice'}</td>
                    <td>{tiers[enrollment?.tier ?? member.state.approvedTier]}</td>
                    <td>
                      {enrollment
                        ? `${enrollment.completed.length}/${course!.total}`
                        : 'Not started'}
                    </td>
                    <td>
                      <Link className="text-link" href={`/admin/members/${member.id}`}>
                        View account
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {members.length === 0 && <p>No members match this search.</p>}
        </div>
      </section>
    </>
  );
}
