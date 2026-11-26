'use client';
import { useEffect, useId, useRef, useState, useTransition, type CSSProperties } from 'react';
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
  CalendarDays,
  Landmark,
  Files,
  BookOpen,
  SearchCheck,
  FileSearch,
  FileText,
  FileCheck2,
  ListChecks,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  LockKeyhole,
  Moon,
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
/** Numbered checklist cards: an image cover beside a 3×2 grid, a swipe row on phones. */
export function FileCards({
  heading,
  image,
  focus,
  items,
}: {
  heading?: string;
  image?: string;
  focus?: number;
  items: { title: string; text: string }[];
}) {
  const track = useRef<HTMLOListElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const [first, second] = el.children as HTMLCollectionOf<HTMLElement>;
      if (!first || !second) return;
      const step = second.offsetLeft - first.offsetLeft;
      const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      setAt(end ? items.length - 1 : Math.max(0, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [items.length]);
  return (
    <div className="file-cards">
      <div
        className="file-cards-cover"
        style={focus === undefined ? undefined : ({ '--cover-x': `${focus}%` } as CSSProperties)}
      >
        {image && <img src={image} alt="" loading="lazy" decoding="async" />}
        {heading && <h3>{heading}</h3>}
      </div>
      <ol className="file-cards-track" ref={track} tabIndex={0} aria-label={heading}>
        {items.map((item, i) => (
          <li className={`file-card tone-${(i % 6) + 1}`} key={item.title}>
            <span className="file-card-mark" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
      <p className="file-cards-count" aria-hidden="true">
        {at + 1} / {items.length}
      </p>
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
export const carouselIcons = {
  calendar: CalendarDays,
  bank: Landmark,
  files: Files,
  book: BookOpen,
  search: SearchCheck,
  filesearch: FileSearch,
  filetext: FileText,
  filecheck: FileCheck2,
  list: ListChecks,
  check: CheckCircle2,
  dollar: CircleDollarSign,
  clock: Clock3,
  lock: LockKeyhole,
} as const;
export function CardCarousel({
  items,
}: {
  items: { title: string; text: string; detail?: string; image?: string; icon?: string }[];
}) {
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const update = () =>
      setVisible(window.innerWidth >= 1100 ? 3 : window.innerWidth >= 700 ? 2 : 1);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const last = Math.max(0, items.length - visible);
  const at = Math.min(start, last);
  return (
    <div
      className="card-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Card carousel"
    >
      <div className="card-carousel-viewport">
        <div
          className="card-carousel-track"
          style={{ '--shift': `calc(${at} * (100% + 16px) / var(--visible))` } as CSSProperties}
        >
          {items.map((item, i) => {
            const Icon = carouselIcons[item.icon as keyof typeof carouselIcons];
            return (
              <article key={item.title} aria-label={`${i + 1} of ${items.length}`}>
                {item.image && (
                  <div className="card-carousel-image" aria-hidden="true">
                    <img src={item.image} alt="" loading="lazy" decoding="async" />
                  </div>
                )}
                {Icon && (
                  <div className="card-carousel-badge" aria-hidden="true">
                    <Icon size={21} />
                  </div>
                )}
                <div className="card-carousel-copy">
                  {item.detail && <span>{item.detail}</span>}
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {last > 0 && (
        <div className="card-carousel-controls">
          <div>
            {Array.from({ length: last + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                className="carousel-dot"
                aria-label={`Show card group ${i + 1}`}
                aria-pressed={i === at}
                onClick={() => setStart(i)}
              />
            ))}
          </div>
          <div>
            <button
              type="button"
              className="icon-button"
              aria-label="Previous cards"
              onClick={() => setStart(at <= 0 ? last : at - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Next cards"
              onClick={() => setStart(at >= last ? 0 : at + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export function SourceCheckIn({
  courseId,
  lessonId,
  courseNumber,
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
  /** Hero-eyebrow course number, e.g. "1.11"; shown on the submit button. */
  courseNumber: string;
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
              : `Complete Course ${courseNumber}`}
          <ArrowUpRight size={18} />
        </button>
        <small>
          Never include your SIN, an account number, a password or anything else private.
        </small>
      </form>
    </div>
  );
}
const cad = (value: number) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
/** Annual-cost ÷ months calculator with one-tap examples (item.amount = cost, item.detail = months). */
export function ConversionCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  const first = items[0];
  const [cost, setCost] = useState(first?.amount ?? '1440'),
    [months, setMonths] = useState(first?.detail ?? '12');
  const id = useId();
  const total = Number(cost),
    span = Number(months);
  const valid = cost !== '' && total > 0 && Number.isFinite(span) && span >= 1;
  const monthly = valid ? total / span : 0;
  const short = valid && span < 12;
  return (
    <div className="score-frame util-frame conv-frame" role="group" aria-labelledby={`${id}-title`}>
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <Calculator aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="util-field">
          <label className="score-number-label" htmlFor={`${id}-cost`}>
            ANNUAL OR PREDICTABLE COST
          </label>
          <div className="conv-money">
            <span aria-hidden="true">$</span>
            <input
              id={`${id}-cost`}
              className="score-number-input"
              type="number"
              inputMode="decimal"
              min="0"
              max="100000000"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
        </div>
        <span className="util-divide" aria-hidden="true">
          ÷
        </span>
        <div className="util-field">
          <label className="score-number-label" htmlFor={`${id}-months`}>
            MONTHS AVAILABLE
          </label>
          <input
            id={`${id}-months`}
            className="score-number-input"
            type="number"
            inputMode="numeric"
            min="1"
            max="120"
            step="1"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CircleDollarSign aria-hidden="true" />
          <div>
            <strong>
              {valid
                ? `${cad(monthly)} planned monthly transfer`
                : 'Enter a cost and at least 1 month.'}
            </strong>
            {valid && (
              <p>
                {cad(total)} ÷ {span} month{span === 1 ? '' : 's'} = {cad(monthly)} per month
              </p>
            )}
          </div>
        </div>
        {valid && (
          <div className="conv-split">
            <div>
              <span>Every two weeks</span>
              <strong>{cad((monthly * 12) / 26)}</strong>
            </div>
            <div>
              <span>Every week</span>
              <strong>{cad((monthly * 12) / 52)}</strong>
            </div>
            <div className={short ? 'is-flag' : undefined}>
              <span>Planning window</span>
              <strong>{short ? 'Short runway' : 'On track'}</strong>
            </div>
          </div>
        )}
        {short && (
          <p className="conv-note" role="note">
            Less than a year to go: the first year may need a temporary adjustment, and the lower
            long-term amount starts once this cost is paid.
          </p>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const active = cost === item.amount && months === item.detail;
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setCost(item.amount ?? '');
                      setMonths(item.detail ?? '12');
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/** Clock time as "10:40 p.m." for minutes after midnight (wraps past midnight both ways). */
const clockTime = (mins: number) => {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60),
    mm = m % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(mm).padStart(2, '0')} ${h < 12 ? 'a.m.' : 'p.m.'}`;
};
const hoursMinutes = (mins: number) => {
  const h = Math.floor(mins / 60),
    m = Math.round(mins % 60);
  return m ? `${h} h ${m} min` : `${h} h`;
};
/** Counts back from a fixed wake time: wake − (sleep + settling) = lights out, then wind-down and a 6-hour caffeine gap (item.amount = wake time "HH:MM", item.detail = hours of sleep). */
export function SleepWindowCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  const first = items[0];
  const [wake, setWake] = useState(first?.amount ?? '06:30'),
    [hours, setHours] = useState(first?.detail ?? '7.5'),
    [settle, setSettle] = useState('20'),
    [wind, setWind] = useState('15');
  const id = useId();
  const [wh, wm] = wake.split(':').map(Number);
  const sleep = Number(hours) * 60,
    settleMin = Number(settle || 0),
    windMin = Number(wind || 0);
  const valid =
    Number.isFinite(wh) &&
    Number.isFinite(wm) &&
    hours !== '' &&
    sleep >= 60 &&
    sleep <= 720 &&
    settleMin >= 0 &&
    settleMin <= 120 &&
    windMin >= 0 &&
    windMin <= 120;
  const wakeAt = wh * 60 + wm;
  const opportunity = sleep + settleMin;
  const lightsOut = wakeAt - opportunity;
  const short = valid && sleep < 7 * 60;
  return (
    <div
      className="score-frame util-frame conv-frame sleep-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <Moon aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="sleep-fields">
          <div className="util-field">
            <label className="score-number-label" htmlFor={`${id}-wake`}>
              WAKE-UP TIME
            </label>
            <input
              id={`${id}-wake`}
              className="score-number-input"
              type="time"
              value={wake}
              onChange={(e) => setWake(e.target.value)}
            />
          </div>
          <div className="util-field">
            <label className="score-number-label" htmlFor={`${id}-hours`}>
              HOURS OF SLEEP
            </label>
            <input
              id={`${id}-hours`}
              className="score-number-input"
              type="number"
              inputMode="decimal"
              min="1"
              max="12"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="util-field">
            <label className="score-number-label" htmlFor={`${id}-settle`}>
              MINUTES TO FALL ASLEEP
            </label>
            <input
              id={`${id}-settle`}
              className="score-number-input"
              type="number"
              inputMode="numeric"
              min="0"
              max="120"
              step="5"
              value={settle}
              onChange={(e) => setSettle(e.target.value)}
            />
          </div>
          <div className="util-field">
            <label className="score-number-label" htmlFor={`${id}-wind`}>
              WIND-DOWN MINUTES
            </label>
            <input
              id={`${id}-wind`}
              className="score-number-input"
              type="number"
              inputMode="numeric"
              min="0"
              max="120"
              step="5"
              value={wind}
              onChange={(e) => setWind(e.target.value)}
            />
          </div>
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <Clock3 aria-hidden="true" />
          <div>
            <strong>
              {valid
                ? `Lights out by ${clockTime(lightsOut)}`
                : 'Enter a wake-up time and 1 to 12 hours of sleep.'}
            </strong>
            {valid && (
              <p>
                {clockTime(wakeAt)} − ({hoursMinutes(sleep)} + {settleMin} min) ={' '}
                {clockTime(lightsOut)}
              </p>
            )}
          </div>
        </div>
        {valid && (
          <div className="conv-split">
            <div>
              <span>Start wind-down</span>
              <strong>{clockTime(lightsOut - windMin)}</strong>
            </div>
            <div>
              <span>Last caffeine about</span>
              <strong>{clockTime(lightsOut - 360)}</strong>
            </div>
            <div className={short ? 'is-flag' : undefined}>
              <span>Sleep opportunity</span>
              <strong>{hoursMinutes(opportunity)}</strong>
            </div>
          </div>
        )}
        {short && (
          <p className="conv-note" role="note">
            Under 7 hours of sleep is below the range in Canada’s guidelines for adults. If your
            schedule only leaves this much, look at what could move, not at how to fall asleep
            faster.
          </p>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const active = wake === item.amount && hours === item.detail;
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setWake(item.amount ?? '06:30');
                      setHours(item.detail ?? '7.5');
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/** Weekly habit review: (full + easier) ÷ planned chances, minutes moved and a next-week suggestion (item.amount = planned chances, item.detail = "full,easier"). */
export function HabitReviewCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  const first = items[0];
  const [f0, e0] = (first?.detail ?? '2,1').split(',');
  const [planned, setPlanned] = useState(first?.amount ?? '4'),
    [full, setFull] = useState(f0 ?? '2'),
    [easier, setEasier] = useState(e0 ?? '1'),
    [fullMin, setFullMin] = useState('4'),
    [easyMin, setEasyMin] = useState('1');
  const id = useId();
  const p = Number(planned),
    f = Number(full || 0),
    e = Number(easier || 0),
    fm = Number(fullMin || 0),
    em = Number(easyMin || 0);
  const whole = (n: number) => Number.isInteger(n) && n >= 0;
  const valid =
    planned !== '' && whole(p) && p >= 1 && p <= 14 && whole(f) && whole(e) && f + e <= p && fm >= 0 && em >= 0;
  const done = f + e,
    missed = p - done,
    rate = valid ? Math.round((done / p) * 100) : 0,
    minutes = f * fm + e * em;
  const next =
    rate >= 75
      ? { label: 'Keep it, or change one thing', flag: false }
      : rate >= 50
        ? { label: 'Repeat the same level', flag: false }
        : { label: 'Shrink it or fix the cue', flag: true };
  const tooMany = planned !== '' && whole(p) && whole(f) && whole(e) && f + e > p;
  const field = (
    key: string,
    text: string,
    value: string,
    set: (v: string) => void,
    max: number,
  ) => (
    <div className="util-field">
      <label className="score-number-label" htmlFor={`${id}-${key}`}>
        {text}
      </label>
      <input
        id={`${id}-${key}`}
        className="score-number-input"
        type="number"
        inputMode="numeric"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={(ev) => set(ev.target.value)}
      />
    </div>
  );
  return (
    <div
      className="score-frame util-frame conv-frame habit-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <ListChecks aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="habit-fields">
          {field('planned', 'PLANNED CHANCES', planned, setPlanned, 14)}
          {field('full', 'FULL VERSIONS DONE', full, setFull, 14)}
          {field('easier', 'EASIER VERSIONS DONE', easier, setEasier, 14)}
          {field('fullmin', 'MINUTES PER FULL', fullMin, setFullMin, 120)}
          {field('easymin', 'MINUTES PER EASIER', easyMin, setEasyMin, 120)}
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CheckCircle2 aria-hidden="true" />
          <div>
            <strong>
              {valid
                ? `${done} of ${p} planned chances (${rate}%)`
                : tooMany
                  ? 'Full plus easier can’t be more than the chances you planned.'
                  : 'Enter 1 to 14 planned chances and whole numbers done.'}
            </strong>
            {valid && (
              <p>
                {f} full + {e} easier = {done} of {p}. Minutes: {f} × {fm} + {e} × {em} = {minutes}
              </p>
            )}
          </div>
        </div>
        {valid && (
          <div className="conv-split">
            <div>
              <span>Missed chances</span>
              <strong>{missed}</strong>
            </div>
            <div>
              <span>Minutes moved</span>
              <strong>{minutes} min</strong>
            </div>
            <div className={next.flag ? 'is-flag' : undefined}>
              <span>Next week</span>
              <strong>{next.label}</strong>
            </div>
          </div>
        )}
        {valid && next.flag && (
          <p className="conv-note" role="note">
            Fewer than half the planned chances happened. That usually points to the cue, the size
            of the action or missing support, not to you. Change one of those before adding more.
          </p>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const [fi, ei] = (item.detail ?? '0,0').split(',');
                const active = planned === item.amount && full === fi && easier === ei;
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setPlanned(item.amount ?? '4');
                      setFull(fi ?? '0');
                      setEasier(ei ?? '0');
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/** Hours as "1 h 30 min" / "45 min" / "2 h". */
const hm = (h: number) => {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60),
    mm = total % 60;
  if (!hh) return `${mm} min`;
  return mm ? `${hh} h ${mm} min` : `${hh} h`;
};
/** Workload check: (task A + B + C hours) ÷ hours available, with the gap and a next move (item.amount = hours available, item.detail = "a,b,c" task hours). */
export function LoadCheckCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  const first = items[0];
  const split = (d?: string) => {
    const [a = '', b = '', c = ''] = (d ?? '').split(',');
    return [a, b, c];
  };
  const [a0, b0, c0] = split(first?.detail ?? '3,2,');
  const [taskA, setTaskA] = useState(a0),
    [taskB, setTaskB] = useState(b0),
    [taskC, setTaskC] = useState(c0),
    [avail, setAvail] = useState(first?.amount ?? '3.5');
  const id = useId();
  const nums = [taskA, taskB, taskC].map((v) => Number(v || 0));
  const need = nums.reduce((s, n) => s + n, 0);
  const have = Number(avail);
  const valid =
    avail !== '' && have > 0 && have <= 24 && nums.every((n) => n >= 0 && n <= 24) && need > 0;
  const load = valid ? Math.round((need / have) * 100) : 0;
  const gap = need - have;
  const next =
    load > 100
      ? { label: 'Ask for a priority call', flag: true }
      : load > 85
        ? { label: 'Tight: protect a buffer', flag: false }
        : { label: 'Fits: pause, then start', flag: false };
  const field = (key: string, text: string, value: string, set: (v: string) => void) => (
    <div className="util-field">
      <label className="score-number-label" htmlFor={`${id}-${key}`}>
        {text}
      </label>
      <input
        id={`${id}-${key}`}
        className="score-number-input"
        type="number"
        inputMode="decimal"
        min="0"
        max="24"
        step="0.25"
        value={value}
        onChange={(ev) => set(ev.target.value)}
      />
    </div>
  );
  return (
    <div
      className="score-frame util-frame conv-frame load-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <CircleGauge aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="load-fields">
          {field('a', 'TASK A (HOURS)', taskA, setTaskA)}
          {field('b', 'TASK B (HOURS)', taskB, setTaskB)}
          {field('c', 'TASK C (HOURS)', taskC, setTaskC)}
          {field('avail', 'HOURS AVAILABLE', avail, setAvail)}
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <Clock3 aria-hidden="true" />
          <div>
            <strong>
              {valid
                ? `${hm(need)} of work for ${hm(have)} available`
                : 'Enter the hours each task needs and the hours you have (up to 24).'}
            </strong>
            {valid && (
              <p>
                {nums
                  .filter((n) => n > 0)
                  .map((n) => hm(n))
                  .join(' + ')}{' '}
                = {hm(need)} ÷ {hm(have)} = {load}% load
              </p>
            )}
          </div>
        </div>
        {valid && (
          <div className="conv-split">
            <div className={gap > 0 ? 'is-flag' : undefined}>
              <span>{gap > 0 ? 'Over by' : 'Spare time'}</span>
              <strong>{gap === 0 ? 'None' : hm(Math.abs(gap))}</strong>
            </div>
            <div>
              <span>Load</span>
              <strong>{load}%</strong>
            </div>
            <div className={next.flag ? 'is-flag' : undefined}>
              <span>Next move</span>
              <strong>{next.label}</strong>
            </div>
          </div>
        )}
        {valid && next.flag && (
          <p className="conv-note" role="note">
            The work is bigger than the time. A pause can steady you, but it can’t create{' '}
            {hm(gap)}. Ask which task comes first and who can take the rest, or move a deadline.
          </p>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const [ia, ib, ic] = split(item.detail);
                const active =
                  avail === item.amount && taskA === ia && taskB === ib && taskC === ic;
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setAvail(item.amount ?? '');
                      setTaskA(ia);
                      setTaskB(ib);
                      setTaskC(ic);
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/** Thirty-day challenge review: four 7-day blocks scored against a pass mark set on day 1 (item.amount = chances per block, item.detail = "b1,b2,b3,b4,easier"). */
export function ChallengeReviewCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  const first = items[0];
  const parse = (d?: string) => {
    const [b1 = '', b2 = '', b3 = '', b4 = '', ez = ''] = (d ?? '').split(',');
    return [b1, b2, b3, b4, ez];
  };
  const init = parse(first?.detail ?? '2,2,3,2,3');
  const [perBlock, setPerBlock] = useState(first?.amount ?? '3'),
    [blocks, setBlocks] = useState(init.slice(0, 4)),
    [easier, setEasier] = useState(init[4]),
    [pass, setPass] = useState('75');
  const id = useId();
  const per = Number(perBlock),
    done = blocks.map((b) => Number(b || 0)),
    ez = Number(easier || 0),
    mark = Number(pass);
  const whole = (n: number) => Number.isInteger(n) && n >= 0;
  const planned = per * 4,
    total = done.reduce((s, n) => s + n, 0);
  const valid =
    perBlock !== '' &&
    whole(per) &&
    per >= 1 &&
    per <= 7 &&
    done.every((n) => whole(n) && n <= per) &&
    whole(ez) &&
    ez <= total &&
    pass !== '' &&
    mark >= 1 &&
    mark <= 100;
  const rate = valid ? Math.round((total / planned) * 100) : 0;
  const firstHalf = done[0] + done[1],
    secondHalf = done[2] + done[3];
  const trend =
    secondHalf > firstHalf ? 'Rising' : secondHalf < firstHalf ? 'Falling' : 'Steady';
  const passed = rate >= mark;
  const call = passed
    ? trend === 'Falling'
      ? { label: 'Continue, check the cue', flag: false }
      : { label: 'Continue as planned', flag: false }
    : rate >= 50
      ? { label: 'Change one thing', flag: true }
      : { label: 'Change the cue or stop', flag: true };
  const input = (key: string, text: string, value: string, set: (v: string) => void, max: number) => (
    <div className="util-field" key={key}>
      <label className="score-number-label" htmlFor={`${id}-${key}`}>
        {text}
      </label>
      <input
        id={`${id}-${key}`}
        className="score-number-input"
        type="number"
        inputMode="numeric"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={(ev) => set(ev.target.value)}
      />
    </div>
  );
  return (
    <div
      className="score-frame util-frame conv-frame challenge-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <CalendarDays aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="challenge-fields is-setup">
          {input('per', 'CHANCES PER BLOCK', perBlock, setPerBlock, 7)}
          {input('pass', 'PASS MARK (%)', pass, setPass, 100)}
          {input('easier', 'OF THOSE, EASIER', easier, setEasier, 28)}
        </div>
        <div className="challenge-fields">
          {blocks.map((b, j) =>
            input(
              `b${j}`,
              `DAYS ${['1–7', '8–14', '15–21', '22–28'][j]} DONE`,
              b,
              (v) => setBlocks((prev) => prev.map((p, k) => (k === j ? v : p))),
              7,
            ),
          )}
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CheckCircle2 aria-hidden="true" />
          <div>
            <strong>
              {valid
                ? `${total} of ${planned} planned chances (${rate}%)`
                : 'Use whole numbers: each block up to its chances, easier up to the total done.'}
            </strong>
            {valid && (
              <p>
                {done.join(' + ')} = {total} of {per} × 4 = {planned}. {total - ez} regular + {ez}{' '}
                easier.
              </p>
            )}
          </div>
        </div>
        {valid && (
          <div className="conv-split">
            <div className={passed ? undefined : 'is-flag'}>
              <span>Pass mark {mark}%</span>
              <strong>{passed ? 'Met' : 'Not met'}</strong>
            </div>
            <div>
              <span>Trend</span>
              <strong>
                {trend} ({firstHalf} → {secondHalf})
              </strong>
            </div>
            <div className={call.flag ? 'is-flag' : undefined}>
              <span>Day-30 call</span>
              <strong>{call.label}</strong>
            </div>
          </div>
        )}
        {valid && !passed && (
          <p className="conv-note" role="note">
            Below your own pass mark. That’s a result, not a failure: the month showed this setup
            doesn’t fit yet. Change the cue, the size or the days before you try another month.
          </p>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const p = parse(item.detail);
                const active =
                  perBlock === item.amount &&
                  blocks.every((b, k) => b === p[k]) &&
                  easier === p[4];
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setPerBlock(item.amount ?? '3');
                      setBlocks(p.slice(0, 4));
                      setEasier(p[4]);
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/** Baseline-to-plan: planned slots × minutes = weekly minutes, keeping at least one free slot from the baseline week as a backup (item.amount = free slots, item.detail = "planned,minutes"). */
export function BaselinePlanCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  const first = items[0];
  const parse = (d?: string) => {
    const [p = '', m = ''] = (d ?? '').split(',');
    return [p, m];
  };
  const [p0, m0] = parse(first?.detail ?? '2,10');
  const [free, setFree] = useState(first?.amount ?? '3'),
    [planned, setPlanned] = useState(p0),
    [minutes, setMinutes] = useState(m0);
  const id = useId();
  const f = Number(free),
    p = Number(planned),
    m = Number(minutes);
  const whole = (n: number) => Number.isInteger(n) && n >= 0;
  const valid =
    free !== '' &&
    planned !== '' &&
    minutes !== '' &&
    whole(f) &&
    whole(p) &&
    f >= 1 &&
    f <= 14 &&
    p >= 1 &&
    p <= f &&
    m >= 1 &&
    m <= 120;
  const weekly = p * m,
    backup = f - p,
    share = Math.round((weekly / 150) * 100),
    active = weekly * 11;
  const tooMany = whole(f) && whole(p) && p > f && f >= 1;
  const field = (key: string, text: string, value: string, set: (v: string) => void, max: number) => (
    <div className="util-field">
      <label className="score-number-label" htmlFor={`${id}-${key}`}>
        {text}
      </label>
      <input
        id={`${id}-${key}`}
        className="score-number-input"
        type="number"
        inputMode="numeric"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={(ev) => set(ev.target.value)}
      />
    </div>
  );
  return (
    <div
      className="score-frame util-frame conv-frame baseline-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <BookOpen aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="baseline-fields">
          {field('free', 'FREE SLOTS IN YOUR BASELINE WEEK', free, setFree, 14)}
          {field('planned', 'SLOTS YOU’LL PLAN', planned, setPlanned, 14)}
          {field('minutes', 'MINUTES PER SESSION', minutes, setMinutes, 120)}
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CalendarDays aria-hidden="true" />
          <div>
            <strong>
              {valid
                ? `${weekly} planned minutes a week`
                : tooMany
                  ? 'You can’t plan more slots than your baseline week showed.'
                  : 'Enter 1 to 14 free slots, at least 1 planned slot and 1 to 120 minutes.'}
            </strong>
            {valid && (
              <p>
                {p} slots × {m} minutes = {weekly} minutes. Weeks 2–12: 11 × {weekly} = {active}{' '}
                minutes.
              </p>
            )}
          </div>
        </div>
        {valid && (
          <div className="conv-split">
            <div className={backup === 0 ? 'is-flag' : undefined}>
              <span>Backup slots</span>
              <strong>{backup === 0 ? 'None' : backup}</strong>
            </div>
            <div>
              <span>Share of 150 min</span>
              <strong>{share}%</strong>
            </div>
            <div>
              <span>Weeks 2–12 total</span>
              <strong>{active} min</strong>
            </div>
          </div>
        )}
        {valid && backup === 0 && (
          <p className="conv-note" role="note">
            Every free slot is booked. Keep one empty as your backup, or the first busy week will
            break the plan instead of bending it.
          </p>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const [ip, im] = parse(item.detail);
                const isActive = free === item.amount && planned === ip && minutes === im;
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={isActive}
                    onClick={() => {
                      setFree(item.amount ?? '3');
                      setPlanned(ip);
                      setMinutes(im);
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const payFrequencies = [
  { label: 'Weekly', perYear: 52 },
  { label: 'Every two weeks', perYear: 26 },
  { label: 'Twice a month', perYear: 24 },
  { label: 'Monthly', perYear: 12 },
] as const;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
/** (Target − saved) ÷ transfer per payday = deposits needed, with a pay-frequency picker. */
export function PaydayCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string }[];
}) {
  const [target, setTarget] = useState(items[0]?.amount ?? '3500'),
    [saved, setSaved] = useState('0'),
    [transfer, setTransfer] = useState('45'),
    [freq, setFreq] = useState(1);
  const id = useId();
  const t = Number(target),
    s = Number(saved || 0),
    p = Number(transfer),
    perYear = payFrequencies[freq].perYear;
  const valid = target !== '' && t > 0 && s >= 0 && p > 0;
  const gap = t - s;
  const done = valid && gap <= 0;
  const exact = valid && !done ? gap / p : 0;
  const deposits = Math.ceil(exact);
  const months = Math.ceil((deposits * 12) / perYear);
  const years = Math.floor(months / 12);
  const time =
    months < 12
      ? plural(months, 'month')
      : `${plural(years, 'year')}${months % 12 ? ` ${plural(months % 12, 'month')}` : ''}`;
  const progress = valid ? Math.min(100, Math.max(0, (s / t) * 100)) : 0;
  const field = (key: string, text: string, value: string, set: (v: string) => void) => (
    <div className="util-field">
      <label className="score-number-label" htmlFor={`${id}-${key}`}>
        {text}
      </label>
      <div className="conv-money">
        <span aria-hidden="true">$</span>
        <input
          id={`${id}-${key}`}
          className="score-number-input"
          type="number"
          inputMode="decimal"
          min="0"
          max="100000000"
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      </div>
    </div>
  );
  return (
    <div
      className="score-frame util-frame conv-frame pay-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <Calculator aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="pay-fields">
          {field('target', 'EMERGENCY FUND TARGET', target, setTarget)}
          {field('saved', 'SAVED SO FAR', saved, setSaved)}
          {field('transfer', 'TRANSFER PER PAYDAY', transfer, setTransfer)}
        </div>
        <div className="pay-freq" role="radiogroup" aria-label="How often you are paid">
          <span>HOW OFTEN YOU ARE PAID</span>
          <div>
            {payFrequencies.map((f, i) => (
              <button
                type="button"
                role="radio"
                key={f.label}
                aria-checked={i === freq}
                onClick={() => setFreq(i)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CircleDollarSign aria-hidden="true" />
          <div>
            <strong>
              {!valid
                ? 'Enter a target and a transfer greater than zero.'
                : done
                  ? 'Target reached. No more deposits needed.'
                  : `${plural(deposits, 'deposit')} needed`}
            </strong>
            {valid && !done && (
              <p>
                ({cad(t)} − {cad(s)}) ÷ {cad(p)} ={' '}
                {Number.isInteger(exact) ? exact : exact.toFixed(1)}
                {Number.isInteger(exact) ? '' : `, rounded up to ${deposits}`}
              </p>
            )}
          </div>
        </div>
        {valid && (
          <>
            <div className="pay-progress" aria-hidden="true">
              <i style={{ width: `${progress}%` }} />
            </div>
            <div className="conv-split">
              <div>
                <span>Time at this pace</span>
                <strong>{done ? 'Done' : time}</strong>
              </div>
              <div>
                <span>Added in one year</span>
                <strong>
                  {cad(p * perYear)} <small>({perYear} paydays)</small>
                </strong>
              </div>
              <div>
                <span>Already saved</span>
                <strong>{Math.round(progress)}%</strong>
              </div>
            </div>
          </>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY A TARGET</span>
            <div>
              {items.map((item) => (
                <button
                  type="button"
                  key={item.title}
                  aria-pressed={target === item.amount}
                  onClick={() => setTarget(item.amount ?? '')}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Icon tiles in a swipeable row: native scroll-snap, with arrows and dots for mouse users. */
export function TileSlider({ children, count }: { children: React.ReactNode; count: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const step = (dir: number) => {
    const el = track.current;
    const tile = el?.firstElementChild as HTMLElement | undefined;
    if (!el || !tile) return;
    el.scrollBy({ left: dir * (tile.offsetWidth + 16), behavior: 'smooth' });
  };
  const sync = () => {
    const el = track.current;
    const tile = el?.firstElementChild as HTMLElement | undefined;
    if (!el || !tile) return;
    setAt(Math.min(count - 1, Math.round(el.scrollLeft / (tile.offsetWidth + 16))));
  };
  return (
    <div className="tile-slider">
      <div
        className="tile-slider-track"
        ref={track}
        onScroll={sync}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Scorecard criteria. Swipe or use the arrows."
      >
        {children}
      </div>
      <div className="card-carousel-controls">
        <div>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className="carousel-dot"
              aria-hidden="true"
              data-on={i === at}
            />
          ))}
        </div>
        <div>
          <button type="button" className="icon-button" aria-label="Previous tile" onClick={() => step(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="icon-button" aria-label="Next tile" onClick={() => step(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const offerNames = ['A', 'B', 'C'] as const;
/** Payment × number of payments − amount borrowed = borrowing cost, for up to three offers side by side. */
export function LoanCostCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  /** An example's `detail` holds "payment:count" pairs, e.g. "185:12,75:36,53:60". */
  const parse = (detail?: string) =>
    offerNames.map((_, i) => {
      const [pay = '', count = ''] = (detail?.split(',')[i] ?? '').split(':');
      return { pay, count };
    });
  const first = items[0];
  const [borrowed, setBorrowed] = useState(first?.amount ?? '2000'),
    [offers, setOffers] = useState(parse(first?.detail ?? '185:12,75:36,53:60'));
  const id = useId();
  const principal = Number(borrowed);
  const rows = offers.map((o) => {
    const pay = Number(o.pay),
      count = Number(o.count);
    const ok = o.pay !== '' && pay > 0 && Number.isFinite(count) && count >= 1;
    return { ok, pay, count, total: ok ? pay * count : 0, cost: ok ? pay * count - principal : 0 };
  });
  const valid = borrowed !== '' && principal > 0;
  const live = rows.map((r, i) => ({ ...r, i })).filter((r) => r.ok);
  const lowestPay = live.length ? live.reduce((a, b) => (b.pay < a.pay ? b : a)) : undefined;
  const lowestCost = live.length ? live.reduce((a, b) => (b.cost < a.cost ? b : a)) : undefined;
  const update = (i: number, key: 'pay' | 'count', value: string) =>
    setOffers((prev) => prev.map((o, j) => (j === i ? { ...o, [key]: value } : o)));
  return (
    <div
      className="score-frame util-frame conv-frame loan-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <Calculator aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="util-field loan-borrowed">
          <label className="score-number-label" htmlFor={`${id}-borrowed`}>
            AMOUNT BORROWED
          </label>
          <div className="conv-money">
            <span aria-hidden="true">$</span>
            <input
              id={`${id}-borrowed`}
              className="score-number-input"
              type="number"
              inputMode="decimal"
              min="0"
              max="100000000"
              value={borrowed}
              onChange={(e) => setBorrowed(e.target.value)}
            />
          </div>
        </div>
        <div className="loan-offers">
          {offers.map((o, i) => (
            <fieldset key={offerNames[i]}>
              <legend>OFFER {offerNames[i]}</legend>
              <div className="loan-field">
                <label htmlFor={`${id}-pay-${i}`}>Payment</label>
                <div className="conv-money">
                  <span aria-hidden="true">$</span>
                  <input
                    id={`${id}-pay-${i}`}
                    className="score-number-input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={o.pay}
                    onChange={(e) => update(i, 'pay', e.target.value)}
                  />
                </div>
              </div>
              <div className="loan-field">
                <label htmlFor={`${id}-count-${i}`}>Number of payments</label>
                <input
                  id={`${id}-count-${i}`}
                  className="score-number-input"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="480"
                  step="1"
                  value={o.count}
                  onChange={(e) => update(i, 'count', e.target.value)}
                />
              </div>
              <p aria-live="polite">
                {rows[i].ok ? (
                  <>
                    <span>
                      {cad(rows[i].pay)} × {rows[i].count} = <b>{cad(rows[i].total)}</b>
                    </span>
                    <strong className={valid && rows[i].cost < 0 ? 'is-flag' : undefined}>
                      {valid
                        ? rows[i].cost < 0
                          ? 'Total is below the amount borrowed'
                          : `Borrowing cost ${cad(rows[i].cost)}`
                        : 'Enter the amount borrowed'}
                    </strong>
                  </>
                ) : (
                  <span>Enter a payment and at least 1 payment.</span>
                )}
              </p>
            </fieldset>
          ))}
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CircleDollarSign aria-hidden="true" />
          <div>
            <strong>
              {valid && lowestCost
                ? `Offer ${offerNames[lowestCost.i]} has the lowest borrowing cost: ${cad(lowestCost.cost)}`
                : 'Enter the amount borrowed and at least one offer.'}
            </strong>
            {valid && lowestCost && lowestPay && (
              <p>
                {lowestPay.i === lowestCost.i
                  ? `It also has the lowest payment (${cad(lowestPay.pay)}).`
                  : `Offer ${offerNames[lowestPay.i]} has the lowest payment (${cad(lowestPay.pay)}), but costs ${cad(lowestPay.cost - lowestCost.cost)} more to borrow.`}
              </p>
            )}
          </div>
        </div>
        {valid && live.length > 1 && lowestCost && lowestPay && (
          <div className="conv-split">
            <div>
              <span>Lowest payment</span>
              <strong>Offer {offerNames[lowestPay.i]}</strong>
            </div>
            <div>
              <span>Lowest total cost</span>
              <strong>Offer {offerNames[lowestCost.i]}</strong>
            </div>
            <div className={lowestPay.i === lowestCost.i ? undefined : 'is-flag'}>
              <span>Cost of the lower payment</span>
              <strong>{cad(Math.abs(lowestPay.cost - lowestCost.cost))}</strong>
            </div>
          </div>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const target = parse(item.detail);
                const active =
                  borrowed === item.amount &&
                  offers.every((o, i) => o.pay === target[i].pay && o.count === target[i].count);
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setBorrowed(item.amount ?? '');
                      setOffers(parse(item.detail));
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Balance × annual rate ÷ 12 = estimated monthly interest, for up to three debts side by side. */
export function InterestScanCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  /** An example's `detail` holds "name:balance:rate" triples, e.g. "Store card:1050:29.99,Credit card:2800:22.99". */
  const parse = (detail?: string) =>
    [0, 1, 2].map((i) => {
      const [name = '', balance = '', rate = ''] = (detail?.split(',')[i] ?? '').split(':');
      return { name, balance, rate };
    });
  const [debts, setDebts] = useState(parse(items[0]?.detail ?? 'Store card:1050:29.99,Credit card:2800:22.99,Line of credit:3600:11.5'));
  const id = useId();
  const rows = debts.map((d, i) => {
    const balance = Number(d.balance),
      rate = Number(d.rate);
    const ok = d.balance !== '' && d.rate !== '' && balance > 0 && rate >= 0 && Number.isFinite(rate);
    return { i, ok, balance, rate, interest: ok ? (balance * rate) / 100 / 12 : 0 };
  });
  const live = rows.filter((r) => r.ok);
  const name = (i: number) => debts[i].name || `Debt ${i + 1}`;
  const topInterest = live.length ? live.reduce((a, b) => (b.interest > a.interest ? b : a)) : undefined;
  const topRate = live.length ? live.reduce((a, b) => (b.rate > a.rate ? b : a)) : undefined;
  const total = live.reduce((sum, r) => sum + r.interest, 0);
  const update = (i: number, key: 'balance' | 'rate', value: string) =>
    setDebts((prev) => prev.map((d, j) => (j === i ? { ...d, [key]: value } : d)));
  return (
    <div
      className="score-frame util-frame conv-frame loan-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <Calculator aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="loan-offers">
          {debts.map((d, i) => (
            <fieldset key={i}>
              <legend>{name(i).toUpperCase()}</legend>
              <div className="loan-field">
                <label htmlFor={`${id}-bal-${i}`}>Balance</label>
                <div className="conv-money">
                  <span aria-hidden="true">$</span>
                  <input
                    id={`${id}-bal-${i}`}
                    className="score-number-input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100000000"
                    value={d.balance}
                    onChange={(e) => update(i, 'balance', e.target.value)}
                  />
                </div>
              </div>
              <div className="loan-field">
                <label htmlFor={`${id}-rate-${i}`}>Annual rate (%)</label>
                <input
                  id={`${id}-rate-${i}`}
                  className="score-number-input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.01"
                  value={d.rate}
                  onChange={(e) => update(i, 'rate', e.target.value)}
                />
              </div>
              <p aria-live="polite">
                {rows[i].ok ? (
                  <>
                    <span>
                      {cad(rows[i].balance)} × {rows[i].rate}% ÷ 12 ≈ <b>{cad(rows[i].interest)}</b>
                    </span>
                    <strong>about a month of interest</strong>
                  </>
                ) : (
                  <span>Enter a balance and a rate.</span>
                )}
              </p>
            </fieldset>
          ))}
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CircleDollarSign aria-hidden="true" />
          <div>
            <strong>
              {topInterest
                ? `${name(topInterest.i)} costs the most each month: about ${cad(topInterest.interest)}`
                : 'Enter a balance and a rate for at least one debt.'}
            </strong>
            {topInterest && topRate && live.length > 1 && (
              <p>
                {topRate.i === topInterest.i
                  ? `It also has the highest rate (${topRate.rate}%).`
                  : `${name(topRate.i)} has the highest rate (${topRate.rate}%), but its balance is smaller, so it costs ${cad(topInterest.interest - topRate.interest)} less a month.`}
              </p>
            )}
          </div>
        </div>
        {live.length > 1 && topInterest && topRate && (
          <div className="conv-split">
            <div>
              <span>Most interest a month</span>
              <strong>{name(topInterest.i)}</strong>
            </div>
            <div>
              <span>Highest rate</span>
              <strong>{name(topRate.i)}</strong>
            </div>
            <div>
              <span>All together a month</span>
              <strong>{cad(total)}</strong>
            </div>
          </div>
        )}
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const target = parse(item.detail);
                const active = debts.every(
                  (d, i) =>
                    d.name === target[i].name &&
                    d.balance === target[i].balance &&
                    d.rate === target[i].rate,
                );
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => setDebts(parse(item.detail))}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
