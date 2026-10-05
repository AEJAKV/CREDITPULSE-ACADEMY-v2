'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, ArrowUpRight } from 'lucide-react';
import { post } from '@/lib/client';
const bands = [
  {
    range: '300–659',
    title: 'Building',
    detail: 'This may signal more lending risk, but it does not mean automatic rejection.',
  },
  {
    range: '660–724',
    title: 'Good',
    detail: 'This is generally considered a good range by Equifax Canada.',
  },
  {
    range: '725–759',
    title: 'Very good',
    detail: 'This is generally considered a very good range by Equifax Canada.',
  },
  {
    range: '760–900',
    title: 'Excellent',
    detail: 'This is generally considered an excellent range by Equifax Canada.',
  },
];
export function ScoreExplorer() {
  const [raw, setRaw] = useState('650');
  const score = Math.max(300, Math.min(900, Number(raw) || 300));
  const index = score < 660 ? 0 : score < 725 ? 1 : score < 760 ? 2 : 3;
  const band = bands[index];
  return (
    <div className="learning-tool score-tool">
      <div className="tool-heading">
        <span className="eyebrow">EXPLORE A CREDIT SCORE</span>
        <span className="live-chip">
          <i /> LIVE
        </span>
      </div>
      <div className="score-stage">
        <svg viewBox="0 0 300 175" aria-hidden="true">
          <path d="M30 145a120 120 0 0 1 240 0" pathLength="100" className="score-track" />
          <path
            d="M30 145a120 120 0 0 1 240 0"
            pathLength="100"
            className="score-fill"
            strokeDasharray={`${(score - 300) / 6} 100`}
          />
        </svg>
        <div>
          <span>YOUR SCORE</span>
          <strong>{score}</strong>
          <small>out of 900</small>
        </div>
      </div>
      <div className="score-controls">
        <label htmlFor="explore-score">Enter a score</label>
        <input
          id="explore-score"
          type="number"
          min="300"
          max="900"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={() => setRaw(String(score))}
        />
        <input
          type="range"
          aria-label="Explore a credit score from 300 to 900"
          min="300"
          max="900"
          value={score}
          onChange={(e) => setRaw(e.target.value)}
        />
        <div className="range-extents">
          <span>300</span>
          <span>900</span>
        </div>
      </div>
      <div className="score-bands" aria-label="General credit score bands">
        {bands.map((b, i) => (
          <div className={index === i ? 'active' : ''} key={b.title}>
            <small>{b.range}</small>
            <strong>{b.title}</strong>
          </div>
        ))}
      </div>
      <div className="tool-result" aria-live="polite">
        <span>{band.range}</span>
        <strong>{band.title}</strong>
        <p>{band.detail}</p>
      </div>
      <p className="tool-note">
        Educational guide only. Lenders use different models and consider other information.
      </p>
    </div>
  );
}
export function UtilizationCalculator() {
  const [balance, setBalance] = useState('1000'),
    [limit, setLimit] = useState('5000');
  const valid = Number(limit) > 0 && Number(balance) >= 0 && balance !== '';
  const ratio = valid ? Math.round((Number(balance) / Number(limit)) * 100) : 0;
  const title = ratio < 30 ? 'Below 30%' : ratio < 50 ? 'Worth watching' : 'High utilization';
  const detail =
    ratio < 30
      ? 'This is below the general FCAC guideline mentioned in this course.'
      : ratio < 50
        ? 'The balance is using a meaningful share of the available limit.'
        : 'A high reported balance may signal greater reliance on revolving credit.';
  return (
    <div className="learning-tool utilization-tool" aria-labelledby="utilization-title">
      <div className="tool-heading">
        <div>
          <div className="eyebrow">INTERACTIVE CALCULATOR</div>
          <h3 id="utilization-title">Explore credit utilization</h3>
        </div>
        <span className="live-chip">
          <i /> LIVE
        </span>
      </div>
      <p>Change either amount to see the calculation update immediately.</p>
      <div className="calculation-inputs">
        <div>
          <label htmlFor="reported-balance">REPORTED BALANCE $</label>
          <input
            id="reported-balance"
            type="number"
            min="0"
            max="100000000"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
          <small>
            {new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
              maximumFractionDigits: 0,
            }).format(Number(balance) || 0)}
          </small>
        </div>
        <span aria-hidden="true">÷</span>
        <div>
          <label htmlFor="credit-limit">CREDIT LIMIT $</label>
          <input
            id="credit-limit"
            type="number"
            min="1"
            max="100000000"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <small>
            {new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
              maximumFractionDigits: 0,
            }).format(Number(limit) || 0)}
          </small>
        </div>
      </div>
      <div className="utilization-result">
        <span>CREDIT USED</span>
        <strong aria-live="polite">
          {valid ? ratio : '—'}
          <small>%</small>
        </strong>
      </div>
      <div className="ratio-track">
        <span style={{ width: `${Math.min(ratio, 100)}%` }} />
        <i style={{ left: '30%' }} />
      </div>
      <div className="range-extents">
        <span>0%</span>
        <span>30% guide</span>
        <span>100%+</span>
      </div>
      <div className="tool-result" aria-live="polite">
        <strong>{valid ? title : 'Enter a credit limit greater than zero.'}</strong>
        {valid && <p>{detail}</p>}
      </div>
      <p className="tool-note">This is an educational ratio, not a credit-score prediction.</p>
    </div>
  );
}
export function LessonArtworkCarousel({ items }: { items: { title: string; text: string }[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  return (
    <div className="lesson-art-carousel" role="region" aria-label="Course image carousel">
      <div className="lesson-art-slide" key={index}>
        <svg viewBox="0 0 400 140" fill="none" aria-hidden="true">
          <path
            d="M0 80h75l16-15 15 29 15-14h53l13-51 22 98 25-93 20 46h146"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="200" cy="72" r="60" stroke="currentColor" opacity=".2" />
        </svg>
        <h3>{item.text}</h3>
        <span>CREDIT PULSE / FOUNDATIONS</span>
      </div>
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label="Previous image"
          onClick={() => setIndex((index + items.length - 1) % items.length)}
        >
          <ChevronLeft size={18} />
        </button>
        <span aria-live="polite">
          Image {index + 1} of {items.length}
        </span>
        <div>
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="carousel-dot"
            />
          ))}
        </div>
        <button
          className="icon-button"
          aria-label="Next image"
          onClick={() => setIndex((index + 1) % items.length)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
export function SourceCheckIn({
  courseId,
  lessonId,
  questions,
  rewardLabel,
  acknowledgment,
  name,
  email,
  saved = [],
  completed,
  next,
}: {
  courseId: string;
  lessonId: string;
  questions: string[];
  rewardLabel: string;
  acknowledgment: string;
  name: string;
  email: string;
  saved?: string[];
  completed: boolean;
  next: string;
}) {
  const router = useRouter(),
    [error, setError] = useState(''),
    [pending, start] = useTransition();
  return (
    <form
      className="check-in source-check-in"
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
              answers: questions.map((_, i) => data.get(`response-${i}`)),
              acknowledged: data.get('acknowledged') === 'on',
            });
            router.push(next);
            router.refresh();
          } catch (err) {
            setError((err as Error).message);
          }
        });
      }}
    >
      <div className="reward-banner">
        <Check size={21} />
        <strong>{rewardLabel}</strong>
      </div>
      <small>Reward eligibility and payment are confirmed by Credit Pulse.</small>
      <p>Answer each one in your own words below. Short answers are fine.</p>
      <div className="form-grid">
        <div>
          <label htmlFor="checkin-name">Full name</label>
          <input id="checkin-name" value={name} readOnly autoComplete="name" />
        </div>
        <div>
          <label htmlFor="checkin-email">Email address</label>
          <input id="checkin-email" type="email" value={email} readOnly autoComplete="email" />
        </div>
      </div>
      {questions.map((q, i) => (
        <div className="written-question" key={q}>
          <label htmlFor={`response-${i}`}>
            <span>{i + 1}</span>
            {q}
          </label>
          <textarea
            id={`response-${i}`}
            name={`response-${i}`}
            defaultValue={saved[i] || ''}
            rows={3}
            maxLength={1200}
            required
          />
        </div>
      ))}
      <label className="checkbox-label">
        <input type="checkbox" name="acknowledged" required />
        {acknowledgment}
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending
          ? 'Saving your check-in…'
          : completed
            ? 'Save and continue'
            : 'Complete Course 1.1'}
        <ArrowUpRight size={18} />
      </button>
      <small>Never include your SIN, an account number, a password or anything else private.</small>
    </form>
  );
}
