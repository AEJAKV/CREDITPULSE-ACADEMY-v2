import { requireAccount } from '@/lib/auth';
import { accounts } from '@/lib/store';
import { getCourse, tiers } from '@/lib/catalog';
import { ReviewRequest } from '@/components/admin-forms';
export const metadata = { title: 'Approval queue' };
export default async function Approvals() {
  await requireAccount(true);
  const members = (await accounts()).filter((a) => a.role === 'member'),
    requests = members.flatMap((a) => a.state.offers.map((offer) => ({ member: a, offer }))),
    pending = requests.filter((r) => r.offer.status === 'pending');
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">VERIFIED DECISIONS</div>
          <h1>Cash-back review queue.</h1>
          <p>A request is a starting point. Record the confirmed decision to change access.</p>
        </div>
      </div>
      {pending.length ? (
        <div className="approval-grid">
          {pending.map(({ member, offer }) => (
            <article className="admin-form" key={offer.id}>
              <span className="chip">Awaiting review</span>
              <h2>{member.name}</h2>
              <p>{member.email}</p>
              <div className="approval-context">
                <strong>{getCourse(offer.courseId)?.title}</strong>
                <span>
                  {tiers[offer.segment]} to {tiers[offer.segment + 1]}
                </span>
              </div>
              <ReviewRequest memberId={member.id} offerId={offer.id} />
            </article>
          ))}
        </div>
      ) : (
        <section className="admin-form">
          <h2>You’re up to date.</h2>
          <p>New requests appear here after a member completes a segment and reapplies.</p>
        </section>
      )}
      <section className="admin-form">
        <h2>Review and nurture history</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Segment</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {requests
                .filter((r) => r.offer.status !== 'pending')
                .map(({ member, offer }) => (
                  <tr key={offer.id}>
                    <td>{member.name}</td>
                    <td>{tiers[offer.segment]}</td>
                    <td>
                      <span className="chip">{offer.status}</span>
                    </td>
                    <td>{offer.approvalReference || 'Awaiting re-offer'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
