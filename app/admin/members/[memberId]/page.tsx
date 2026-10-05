import { requireAccount } from '@/lib/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { accountById } from '@/lib/store';
import { getCourse, tiers } from '@/lib/catalog';
import { ResetPassword } from '@/components/admin-forms';
export default async function Member({ params }: { params: Promise<{ memberId: string }> }) {
  await requireAccount(true);
  const p = await params,
    member = await accountById(p.memberId);
  if (!member || member.role !== 'member') notFound();
  return (
    <>
      <div className="breadcrumb">
        <Link href="/admin/members">Members</Link>
        <span>/</span>
        <span>{member.name}</span>
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">MEMBER ACCOUNT</div>
          <h1>{member.name}</h1>
          <p>{member.email}</p>
        </div>
      </div>
      <div className="admin-feature-grid">
        <section className="admin-form">
          <h2>Course enrollments</h2>
          {Object.values(member.state.enrollments).length ? (
            Object.values(member.state.enrollments).map((enrollment) => (
              <div className="member-enrollment" key={enrollment.courseId}>
                <h3>{getCourse(enrollment.courseId)?.title}</h3>
                <p>
                  {tiers[enrollment.tier]} · {enrollment.completed.length} lessons complete
                </p>
                <small>
                  {enrollment.deadline
                    ? `Target ${new Date(enrollment.deadline).toLocaleDateString('en-CA', { timeZone: 'UTC' })}`
                    : 'No target window'}
                </small>
              </div>
            ))
          ) : (
            <p>
              Awaiting course choice. Initial verified tier: {tiers[member.state.approvedTier]}.
            </p>
          )}
          <Link className="text-link" href="/admin/approvals">
            Review cash-back requests
          </Link>
        </section>
        <section className="admin-form">
          <h2>Reset account access</h2>
          <p>Use your approved process to share the new password with the member.</p>
          <ResetPassword memberId={member.id} />
        </section>
      </div>
      <section className="admin-form">
        <h2>Approval & nurture history</h2>
        {member.state.offers.length ? (
          member.state.offers.map((o) => (
            <div className="admin-summary-row" key={o.id}>
              <span>
                {getCourse(o.courseId)?.title} · {tiers[o.segment]}
              </span>
              <span>
                {o.status}
                {o.approvalReference ? ` · ${o.approvalReference}` : ''}
              </span>
            </div>
          ))
        ) : (
          <p>No reapplication requests yet.</p>
        )}
      </section>
    </>
  );
}
