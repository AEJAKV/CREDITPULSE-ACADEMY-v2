import { requireAccount } from '@/lib/auth';
import { getSettings, demoMode } from '@/lib/store';
import { SettingsForm } from '@/components/admin-forms';
export const metadata = { title: 'Academy settings' };
export default async function Settings() {
  await requireAccount(true);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PROGRAM SETTINGS</div>
          <h1>Set the terms with care.</h1>
          <p>Only display deadlines and rewards your team has confirmed.</p>
        </div>
      </div>
      <div className="quiet-note">
        <p>
          {demoMode()
            ? 'Demo mode is active. The seven-day window is a sample. Demo accounts and edits reset when the server restarts.'
            : 'PostgreSQL mode is active. Account progress, content edits, approvals, and settings are stored in your database.'}
        </p>
      </div>
      <SettingsForm settings={await getSettings()} />
      <section className="admin-form">
        <h2>External systems</h2>
        <p>
          Cash-back verification and ActiveCampaign automation are not connected in this starter.
          Use the approval queue for verified decisions. “Not now” choices are stored for your
          nurture workflow.
        </p>
        <p>
          See docs/ARCHITECTURE.md for the integration points and the remaining business decisions.
        </p>
      </section>
    </>
  );
}
