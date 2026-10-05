import { redirect } from 'next/navigation';
import { ShieldCheck, BookOpen, Award } from 'lucide-react';
import { currentAccount } from '@/lib/auth';
import { demoMode } from '@/lib/store';
import { LoginForm } from '@/components/forms';
import { Logo } from '@/components/ui';
import { tiers, getCourse } from '@/lib/catalog';
import { TierGlyph } from '@/components/visuals';
import { AmbientBackground } from '@/components/ambient-background';
export const metadata = { title: 'Welcome back' };
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; tier?: string }>;
}) {
  const account = await currentAccount();
  if (account) redirect(account.role === 'admin' ? '/admin' : '/dashboard');
  const params = await searchParams;
  const course = getCourse(params.course || 'credit-mastery');
  const tier = tiers.find((t) => t.toLowerCase() === params.tier?.toLowerCase());
  return (
    <main id="main" className="login-page">
      <section className="login-brand">
        <Logo light />
        <div className="login-editorial">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h1>
            A little knowledge.
            <br />
            <span>
              A stronger
              <br />
              next move.
            </span>
          </h1>
          <p>Practical Canadian lessons. Small, achievable actions. A clearer path forward.</p>
          <div className="login-glass">
            <div className="login-glass-heading">
              <BookOpen size={23} />
              <span>
                <strong>{course?.title || 'Your chosen course'}</strong>
                <small>
                  {tier
                    ? `${tier} invitation · access verified at sign-in`
                    : 'Six levels. One course built around you.'}
                </small>
              </span>
            </div>
            <div className="login-tiers">
              {tiers.map((t, i) => (
                <div key={t}>
                  <TierGlyph tier={i} size={25} />
                  <span>{t}</span>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <small className="login-foot">Private learning for Credit Pulse members</small>
        <AmbientBackground effects={['pulse']} placement="contained" />
      </section>
      <section className="login-form-area">
        <div className="login-form-container">
          <span className="eyebrow">CREDIT PULSE ACADEMY</span>
          <h2>Welcome back.</h2>
          <p className="lead">Your next small step starts here.</p>
          <LoginForm demo={demoMode()} courseId={params.course} />
          <div className="trust-note">
            <ShieldCheck size={20} />
            <p>
              Your approved tier controls access.
              <br />
              Your progress stays with your account.
            </p>
          </div>
          <p className="caption">
            Need a new password? Ask your course administrator for a reset. Use the password from
            your account email.
          </p>
        </div>
      </section>
      <AmbientBackground />
    </main>
  );
}
