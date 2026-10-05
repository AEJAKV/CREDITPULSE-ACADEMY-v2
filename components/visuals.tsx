import { useId, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Wallet,
  Landmark,
  HeartHandshake,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  Activity,
  Check,
  LockKeyhole,
} from 'lucide-react';
export function CourseIcon({ index, size = 28 }: { index: number; size?: number }) {
  const Icon = [Landmark, Wallet, HeartHandshake, ChartNoAxesCombined, BriefcaseBusiness, Activity][
    index % 6
  ];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
const TIER_PATHS = [
  'M24 37V23M24 29C14 30 11 23 12 17c9-1 12 5 12 12M24 24c0-8 5-12 12-12 1 8-4 13-12 12',
  'M16 36V22l8-10 8 10v14M13 30h22M19 24h10M24 12v24',
  'M24 9l4 11 11 4-11 4-4 11-4-11-11-4 11-4 4-11M12 12l2 2M34 34l2 2',
  'M24 9l14 6v12c0 8-14 13-14 13S10 35 10 27V15l14-6M18 24l4 4 9-10',
  'M14 12h20l8 12-18 17L6 24l8-12M6 24h36M14 12l10 29 10-29M14 12l10 12 10-12',
  'M24 7l5 5 7 1 1 7 5 4-5 5-1 7-7 1-5 5-5-5-7-1-1-7-5-5 5-4 1-7 7-1 5-5M17 24l5 5 10-11',
];
const TIER_NAMES = ['Starter', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite'];
export function TierGlyph({ tier, size = 30 }: { tier: number; size?: number }) {
  const paths = TIER_PATHS;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d={paths[tier]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export type MedalState = 'earned' | 'current' | 'next' | 'locked';
const MEDAL_STATE_LABEL: Record<MedalState | 'plain', string> = {
  plain: 'Open',
  earned: 'Earned',
  current: 'Current level',
  next: 'Up next',
  locked: 'Locked',
};
/** Metal-rimmed tier medallion. State is carried by shape (check, lock, ring, dashes), never colour alone. */
export function TierMedal({
  tier,
  state,
  size = 40,
  dark = false,
}: {
  tier: number;
  /** 'plain' is the full-colour medal with no state mark, for a level that is open but unfinished. */
  state: MedalState | 'plain';
  size?: number;
  dark?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const small = size <= 28;
  const sw = small ? 4.4 : size <= 44 ? 3.8 : 3.3;
  const gs = small ? 0.72 : 0.66;
  const off = 24 - 24 * gs;
  const hasPip = state === 'earned' || state === 'locked';
  const PipIcon = state === 'earned' ? Check : LockKeyhole;
  return (
    <span
      className={`tier-medal is-${state}${dark ? ' on-dark' : ''}${small ? ' is-small' : ''}`}
      data-tier={tier}
      style={{ '--medal-size': `${size}px` } as CSSProperties}
      role="img"
      aria-label={`${TIER_NAMES[tier]} — ${MEDAL_STATE_LABEL[state]}`}
    >
      <svg viewBox="-1.5 -1.5 51 51" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}r`} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--m-rim1)' }} />
            <stop offset="0.55" style={{ stopColor: 'var(--m-rim2)' }} />
            <stop offset="1" style={{ stopColor: 'var(--m-rim3)' }} />
          </linearGradient>
          <radialGradient id={`${uid}f`} cx="0.38" cy="0.28" r="0.85">
            <stop offset="0" style={{ stopColor: 'var(--m-face1)' }} />
            <stop offset="1" style={{ stopColor: 'var(--m-face2)' }} />
          </radialGradient>
        </defs>
        {state === 'current' && (
          <>
            <circle className="medal-halo" cx="24" cy="24" r="27.6" />
            <circle className="medal-ring" cx="24" cy="24" r="25.6" />
          </>
        )}
        {state === 'next' && <circle className="medal-dash" cx="24" cy="24" r="26.4" />}
        <circle cx="24" cy="24" r="23" fill={`url(#${uid}r)`} />
        <circle className="medal-rim-line" cx="24" cy="24" r="22.2" />
        <circle cx="24" cy="24" r="18.6" fill={`url(#${uid}f)`} />
        <circle className="medal-face-line" cx="24" cy="24" r="18.6" />
        {tier >= 2 && <circle className="medal-accent" cx="24" cy="24" r="16.4" />}
        <ellipse className="medal-gloss" cx="20" cy="13.5" rx="11" ry="4.6" />
        <g
          transform={`translate(${off} ${off}) scale(${gs})`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            className="medal-emboss"
            d={TIER_PATHS[tier]}
            strokeWidth={sw}
            transform="translate(0 1.6)"
          />
          <path className="medal-glyph" d={TIER_PATHS[tier]} strokeWidth={sw} />
        </g>
      </svg>
      {hasPip && (
        <span className="medal-pip" aria-hidden="true">
          <PipIcon strokeWidth={3} />
        </span>
      )}
    </span>
  );
}
export function CourseArtwork({
  index = 0,
  compact = false,
}: {
  index?: number;
  compact?: boolean;
}) {
  return (
    <div
      className={`course-artwork artwork-${index} ${compact ? 'compact' : ''}`}
      aria-hidden="true"
    >
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-dots" />
      <div className="art-card card-back" />
      <div className="art-card card-middle" />
      <div className="art-card card-front">
        <div className="art-card-top">
          <CourseIcon index={index} size={compact ? 30 : 38} />
          <ArrowUpRight size={20} />
        </div>
        <span className="art-rule" />
        <span className="art-rule short" />
        <div className="art-chart">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="art-card-label">CREDIT PULSE / {String(index + 1).padStart(2, '0')}</span>
      </div>
      <span className="art-spark spark-one">✧</span>
      <span className="art-spark spark-two">+</span>
    </div>
  );
}
export function ProgressOrbit({ completed, total }: { completed: number; total: number }) {
  const value = Math.round((completed / total) * 100);
  return (
    <div className="progress-orbit" aria-label={`${value}% course complete`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="51" className="orbit-track" />
        <circle
          cx="60"
          cy="60"
          r="51"
          className="orbit-value"
          pathLength="100"
          strokeDasharray={`${value} 100`}
        />
      </svg>
      <div>
        <strong>
          {value}
          <small>%</small>
        </strong>
        <span>course complete</span>
      </div>
    </div>
  );
}
