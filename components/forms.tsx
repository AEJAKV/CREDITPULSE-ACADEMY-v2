'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, Bookmark, LogOut } from 'lucide-react';
import { post } from '@/lib/client';
export function LoginForm({ demo, courseId }: { demo: boolean; courseId?: string }) {
  const router = useRouter();
  const [error, setError] = useState(''),
    [show, setShow] = useState(false),
    [pending, start] = useTransition();
  return (
    <>
      <form
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
        className="form-stack"
      >
        <div>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
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
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary wide" disabled={pending}>
          {pending ? 'Signing you in…' : 'Continue to my course'}
        </button>
      </form>
      {demo && (
        <details className="demo-credentials" open>
          <summary>Demo access · no setup needed</summary>
          <p>
            <strong>Member</strong>
            <br />
            member@creditpulse.demo
            <br />
            <code>LearnWithPulse2026!</code>
          </p>
          <p>
            <strong>Administrator</strong>
            <br />
            admin@creditpulse.demo
            <br />
            <code>ManageWithPulse2026!</code>
          </p>
          <small>
            Demo accounts and changes are temporary. Only the first lesson contains complete course
            material.
          </small>
        </details>
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
