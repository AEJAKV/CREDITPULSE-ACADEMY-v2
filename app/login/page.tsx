import { redirect } from 'next/navigation';
import { BookOpen, Sparkles, MapPin, ShieldCheck, LockKeyhole, Save } from 'lucide-react';
import { currentAccount } from '@/lib/auth';
import { demoMode } from '@/lib/store';
import { LoginForm } from '@/components/forms';
import { Logo } from '@/components/ui';
import { tiers, getCourse } from '@/lib/catalog';
import { TierGlyph } from '@/components/visuals';
import { AmbientBackground } from '@/components/ambient-background';
export const metadata = { title: 'Welcome back' };
const benefits = [
  {
    icon: Sparkles,
    title: 'Short, practical lessons',
    text: 'One idea and one small action at a time.',
  },
  {
    icon: MapPin,
    title: 'Made for Canadians',
    text: 'Real examples built around Canadian accounts and rules.',
  },
  {
    icon: Save,
    title: 'Pick up where you left off',
    text: 'Your progress saves to your account as you go.',
  },
];
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; tier?: string }>;
}) {
  const account = await currentAccount();
  if (account) redirect(account.role === 'admin' ? '/admin' : '/dashboard');
  const params = await searchParams;
  const course = getCourse(params.course || 'credit-mastery');
  const tierIndex = tiers.findIndex((t) => t.toLowerCase() === params.tier?.toLowerCase());
  const tier = tierIndex >= 0 ? tiers[tierIndex] : undefined;
  return (
    <main id="main" className="login-page">
      <section className="login-brand" aria-labelledby="login-headline">
        <Logo light href="/login" />
        <div className="login-editorial">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h1 id="login-headline">
            A little knowledge. <span>A stronger next move.</span>
          </h1>
          <p>Practical Canadian lessons. Small, achievable actions. A clearer path forward.</p>
          <ul className="login-benefits">
            {benefits.map((b) => (
              <li key={b.title}>
                <span className="login-benefit-icon">
                  <b.icon size={18} />
                </span>
                <span>
                  <strong>{b.title}</strong>
                  <small>{b.text}</small>
                </span>
              </li>
            ))}
          </ul>
          <div className="login-course">
            <div className="login-course-heading">
              <span className="login-course-icon">
                <BookOpen size={20} />
              </span>
              <span>
                <small>{tier ? `${tier} invitation` : 'Your course'}</small>
                <strong>{course?.title || 'Your chosen course'}</strong>
              </span>
            </div>
            <ol className="login-path" aria-label="Six levels, Starter to Elite">
              {tiers.map((t, i) => (
                <li key={t} className={i === tierIndex ? 'is-invited' : ''}>
                  <span className="login-path-node">
                    <TierGlyph tier={i} size={18} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <small className="login-foot">
          <LockKeyhole size={13} /> Private learning for Credit Pulse members
        </small>
        <AmbientBackground effects={['pulse']} placement="contained" />
      </section>
      <section className="login-form-area" aria-labelledby="login-title">
        <div className="login-form-container">
          <div className="login-card">
            <h2 id="login-title">Welcome back</h2>
            <p className="lead">
              Sign in to continue {course ? <strong>{course.title}</strong> : 'your course'}.
            </p>
            <LoginForm demo={demoMode()} courseId={params.course} />
          </div>
          <ul className="login-trust" aria-label="Your account">
            <li>
              <ShieldCheck size={15} /> Secure sign-in
            </li>
            <li>
              <Save size={15} /> Progress saved
            </li>
            <li>
              <MapPin size={15} /> Canadian lessons
            </li>
          </ul>
        </div>
      </section>
      <AmbientBackground />
    </main>
  );
}
