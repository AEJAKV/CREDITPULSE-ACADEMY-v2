'use client';
import { useState, useTransition, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUpRight,
  Calculator,
  CircleGauge,
  ShieldCheck,
  Gift,
} from 'lucide-react';
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
  // The pulse on the slider handle is a "drag me" cue; it stops once the slider has been used.
  const [dragged, setDragged] = useState(false);
  const score = Math.max(300, Math.min(900, Number(raw) || 300));
  const index = score < 660 ? 0 : score < 725 ? 1 : score < 760 ? 2 : 3;
  const band = bands[index];
  return (
    <div className="score-frame">
      <div className="score-explorer">
        <div className="score-explorer-head">
          <div>
            <CircleGauge aria-hidden="true" />
            <span>Explore a credit score</span>
          </div>
          <strong>LIVE</strong>
        </div>
        <div className="score-live-value" aria-live="polite">
          <span>Your score</span>
          <strong>{score}</strong>
          <small>out of 900</small>
        </div>
        <label className="score-number-label" htmlFor="explore-score">
          Enter a score
        </label>
        <input
          id="explore-score"
          className="score-number-input"
          type="number"
          min="300"
          max="900"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={() => setRaw(String(score))}
        />
        <div className="score-range-wrap">
          <div className="score-range-track">
            <input
              className="score-range-input"
              type="range"
              aria-label="Explore a credit score from 300 to 900"
              min="300"
              max="900"
              value={score}
              onChange={(e) => {
                setRaw(e.target.value);
                setDragged(true);
              }}
            />
            {!dragged && (
              <span
                className="score-range-pulse"
                style={{ '--score-position': (score - 300) / 600 } as CSSProperties}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="score-range-labels">
            <span>300</span>
            <span>900</span>
          </div>
        </div>
        <div className="score-band-grid" aria-label="General credit score bands">
          {bands.map((b, i) => (
            <div
              className={index === i ? 'current' : ''}
              aria-current={index === i ? 'true' : undefined}
              key={b.title}
            >
              <i />
              <span>{b.range}</span>
              <small>{b.title}</small>
            </div>
          ))}
        </div>
        <div className="score-live-result" aria-live="polite">
          <ShieldCheck aria-hidden="true" />
          <div>
            <span>{band.range}</span>
            <strong>{band.title}</strong>
            <p>{band.detail}</p>
          </div>
        </div>
        <p className="score-disclaimer">
          Educational guide only. Lenders use different models and consider other information.
        </p>
      </div>
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
    <div className="score-frame util-frame" role="group" aria-labelledby="utilization-title">
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <Calculator aria-hidden="true" />
            <h3 id="utilization-title">Explore credit utilization</h3>
          </div>
          <strong>LIVE</strong>
        </div>
        <p className="util-intro">
          Change either amount to see the calculation update immediately.
        </p>
        <div className="util-field">
          <label className="score-number-label" htmlFor="reported-balance">
            REPORTED BALANCE $
          </label>
          <input
            id="reported-balance"
            className="score-number-input"
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
        <span className="util-divide" aria-hidden="true">
          ÷
        </span>
        <div className="util-field">
          <label className="score-number-label" htmlFor="credit-limit">
            CREDIT LIMIT $
          </label>
          <input
            id="credit-limit"
            className="score-number-input"
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
        <div className="score-live-value utilization-result">
          <span>Credit used</span>
          <strong aria-live="polite">
            {valid ? ratio : '—'}
            <small>%</small>
          </strong>
        </div>
        <div className="score-range-wrap util-track-wrap">
          <div className="util-track" aria-hidden="true">
            <i />
            <span style={{ left: `${Math.min(ratio, 100)}%` }} />
          </div>
          <div className="score-range-labels util-track-labels">
            <span>0%</span>
            <span>30% guide</span>
            <span>100%+</span>
          </div>
        </div>
        <div className="score-live-result" aria-live="polite">
          <ShieldCheck aria-hidden="true" />
          <div>
            <strong>{valid ? title : 'Enter a credit limit greater than zero.'}</strong>
            {valid && <p>{detail}</p>}
          </div>
        </div>
        <p className="score-disclaimer">
          This is an educational ratio, not a credit-score prediction.
        </p>
      </div>
    </div>
  );
}
export function LessonArtworkCarousel({
  items,
}: {
  items: { title: string; text: string; image?: string }[];
}) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  return (
    <div className="lesson-art-carousel" role="region" aria-label="Course image carousel">
      <div className="lesson-art-slide" key={index}>
        {item.image && (
          <img
            className="lesson-art-photo"
            src={item.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}
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
  samples = [],
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
  samples?: string[];
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
    <div className="checkin-frame">
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
          <span className="reward-sheen" aria-hidden="true" />
          <span className="reward-icon" aria-hidden="true">
            <Gift size={22} />
          </span>
          <span className="reward-copy">
            <span className="reward-kicker">YOUR REWARD</span>
            <strong>{rewardLabel}</strong>
          </span>
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
              placeholder={samples[i] ? `Example: ${samples[i]}` : undefined}
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
        <small>
          Never include your SIN, an account number, a password or anything else private.
        </small>
      </form>
    </div>
  );
}
