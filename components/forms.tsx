'use client';
import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Check,
  Bookmark,
  LogOut,
  Mail,
  LockKeyhole,
  LifeBuoy,
  ArrowRight,
} from 'lucide-react';
import { post } from '@/lib/client';
const demoAccounts = [
  {
    label: 'Member',
    note: 'Silver, in progress',
    email: 'member@creditpulse.demo',
    password: 'LearnWithPulse2026!',
  },
  {
    label: 'Elite member',
    note: 'All six levels',
    email: 'elite@creditpulse.demo',
    password: 'EliteWithPulse2026!',
  },
  {
    label: 'Administrator',
    note: 'Admin studio',
    email: 'admin@creditpulse.demo',
    password: 'ManageWithPulse2026!',
  },
];
export function LoginForm({ demo, courseId }: { demo: boolean; courseId?: string }) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [error, setError] = useState(''),
    [show, setShow] = useState(false),
    [help, setHelp] = useState(false),
    [pending, start] = useTransition();
  const fillDemo = (account: (typeof demoAccounts)[number]) => {
    const el = form.current;
    if (!el) return;
    (el.elements.namedItem('email') as HTMLInputElement).value = account.email;
    (el.elements.namedItem('password') as HTMLInputElement).value = account.password;
    setError('');
    (el.querySelector('button[type="submit"]') as HTMLButtonElement | null)?.focus();
  };
  return (
    <>
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setError('');
          start(async () => {
            try {
              const r = await post('/api/auth', {
                email: data.get('email'),
                password: data.get('password'),
                courseId,
              });
              router.push(r.redirect || '/dashboard');
              router.refresh();
            } catch (e) {
              setError((e as Error).message);
            }
          });
        }}
        className="form-stack login-form"
      >
        <div className="login-field">
          <label htmlFor="email">Email address</label>
          <span className="input-with-icon">
            <Mail size={18} aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={error ? true : undefined}
              required
            />
          </span>
        </div>
        <div className="login-field">
          <div className="label-row">
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="text-button"
              aria-expanded={help}
              aria-controls="password-help"
              onClick={() => setHelp(!help)}
            >
              Forgot password?
            </button>
          </div>
          <div className="password-field input-with-icon">
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={error ? true : undefined}
              required
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShow(!show)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {help && (
            <p id="password-help" className="login-help" role="status">
              <LifeBuoy size={17} aria-hidden="true" />
              <span>
                No problem. Your course administrator can reset it for you. Your first password is
                in your account email.
              </span>
            </p>
          )}
        </div>
        {error && (
          <p className="error login-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="button primary wide login-submit" disabled={pending}>
          {pending ? (
            <>
              <span className="login-spinner" aria-hidden="true" />
              Signing you in…
            </>
          ) : (
            <>
              Continue to my course
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
      {demo && (
        <div className="demo-access">
          <p className="demo-access-title">
            <span>Demo access</span>
            <small>Tap an account to fill the form</small>
          </p>
          <div className="demo-access-options">
            {demoAccounts.map((a) => (
              <button type="button" key={a.email} onClick={() => fillDemo(a)}>
                <strong>{a.label}</strong>
                <small>{a.note}</small>
              </button>
            ))}
          </div>
          <small className="demo-access-note">
            Demo accounts and changes are temporary. Only the first lesson contains complete course
            material.
          </small>
        </div>
      )}
    </>
  );
}
export function Logout() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  return (
    <>
      <button
        className="logout"
        disabled={pending}
        onClick={() =>
          start(async () => {
            try {
              await post('/api/auth', { action: 'logout' });
              router.push('/login');
              router.refresh();
            } catch (e) {
              setError((e as Error).message);
            }
          })
        }
      >
        <LogOut size={16} />
        <span>Sign out</span>
      </button>
      {error && (
        <span role="alert" className="error">
          {error}
        </span>
      )}
    </>
  );
}
export function ActionButton({
  endpoint = '/api/member',
  data,
  children,
  className = 'button primary',
  to,
}: {
  endpoint?: string;
  data: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  to?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  return (
    <div className="action-control">
      <button
        className={className}
        disabled={pending}
        onClick={() => {
          setError('');
          start(async () => {
            try {
              await post(endpoint, data);
              if (to) router.push(to);
              router.refresh();
            } catch (e) {
              setError((e as Error).message);
            }
          });
        }}
      >
        {pending ? 'Saving…' : children}
      </button>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </div>
  );
}
export function SaveLesson({
  courseId,
  lessonId,
  saved,
}: {
  courseId: string;
  lessonId: string;
  saved: boolean;
}) {
  return (
    <ActionButton
      data={{ action: 'save', courseId, lessonId }}
      className={`button quiet ${saved ? 'selected' : ''}`}
    >
      <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
      {saved ? 'Saved' : 'Save lesson'}
    </ActionButton>
  );
}
export function CheckIn({
  courseId,
  lessonId,
  quiz,
  reflection = '',
  completed,
  next,
}: {
  courseId: string;
  lessonId: string;
  quiz: { question: string; choices: string[] };
  reflection?: string;
  completed: boolean;
  next: string;
}) {
  const router = useRouter(),
    [error, setError] = useState(''),
    [pending, start] = useTransition();
  return (
    <form
      className="check-in"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setError('');
        start(async () => {
          try {
            await post('/api/member', {
              action: 'complete',
              courseId,
              lessonId,
              answer: Number(data.get('answer')),
              reflection: data.get('reflection'),
            });
            router.push(next);
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        });
      }}
    >
      <div className="eyebrow">YOUR CHECK-IN</div>
      <h2>Make one small move.</h2>
      <fieldset>
        <legend>{quiz.question}</legend>
        {quiz.choices.map((choice, i) => (
          <label key={choice} className="radio-choice">
            <input type="radio" name="answer" value={i} required />
            <span>{choice}</span>
          </label>
        ))}
      </fieldset>
      <label htmlFor="reflection">What is one action you’ll take this week?</label>
      <textarea
        id="reflection"
        name="reflection"
        rows={3}
        maxLength={1200}
        defaultValue={reflection}
        placeholder="For example: set a reminder two days before my payment is due."
        required
      />
      <small>Keep account numbers and sensitive financial details out of your reflection.</small>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? (
          'Saving your check-in…'
        ) : completed ? (
          <>
            <Check size={18} />
            Save and continue
          </>
        ) : (
          'Complete lesson'
        )}
      </button>
      <span className="caption">Saved to your member account</span>
    </form>
  );
}
export function PrintButton() {
  return (
    <button className="button secondary" onClick={() => window.print()}>
      Print my book
    </button>
  );
}
