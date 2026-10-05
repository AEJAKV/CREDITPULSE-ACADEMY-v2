import { requireAccount } from '@/lib/auth';
import { getSettings } from '@/lib/store';
export const metadata = { title: 'Member help' };
export default async function Help() {
  await requireAccount();
  const settings = await getSettings();
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">HERE TO HELP</div>
          <h1>A little clarity goes a long way.</h1>
          <p>Answers to common questions about your course access.</p>
        </div>
      </div>
      <div className="help-list">
        {[
          [
            'Why is the next tier locked?',
            'Your cash-back approval determines access. Silver includes Starter and Silver; Gold adds the third segment. Completing a segment lets you request a cash-back review, but only a verified approval unlocks the next tier.',
          ],
          [
            'Will I lose my earlier lessons?',
            'No. Access is cumulative within a course, and your completed lessons and saved actions remain in your account.',
          ],
          [
            'What happens if I miss my target date?',
            'Your learning access remains open. Bonus eligibility and re-offer timing depend on the confirmed program terms. Your course team can review your options.',
          ],
          [
            'Can I choose another course?',
            'You start with one course. After completing all six segments, you can begin an available new course at Starter while retaining your completed course.',
          ],
          [
            'Why does a lesson say “In preparation”?',
            'Its tier may already be unlocked, but its content has not been published. Publication and tier access are separate.',
          ],
          [
            'How do I reset my password?',
            'Contact your course administrator using the account email you received. An administrator can reset your password and revoke old sessions.',
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      {settings.helpEmail && (
        <div className="trust-note">
          <p>
            Still need help? <a href={`mailto:${settings.helpEmail}`}>{settings.helpEmail}</a>
          </p>
        </div>
      )}
    </>
  );
}
