import {
  ArrowUpRight,
  Wallet,
  Landmark,
  HeartHandshake,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  Activity,
} from 'lucide-react';
export function CourseIcon({ index, size = 28 }: { index: number; size?: number }) {
  const Icon = [Landmark, Wallet, HeartHandshake, ChartNoAxesCombined, BriefcaseBusiness, Activity][
    index % 6
  ];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
export function TierGlyph({ tier, size = 30 }: { tier: number; size?: number }) {
  const paths = [
    'M24 37V23M24 29C14 30 11 23 12 17c9-1 12 5 12 12M24 24c0-8 5-12 12-12 1 8-4 13-12 12',
    'M16 36V22l8-10 8 10v14M13 30h22M19 24h10M24 12v24',
    'M24 9l4 11 11 4-11 4-4 11-4-11-11-4 11-4 4-11M12 12l2 2M34 34l2 2',
    'M24 9l14 6v12c0 8-14 13-14 13S10 35 10 27V15l14-6M18 24l4 4 9-10',
    'M14 12h20l8 12-18 17L6 24l8-12M6 24h36M14 12l10 29 10-29M14 12l10 12 10-12',
    'M24 7l5 5 7 1 1 7 5 4-5 5-1 7-7 1-5 5-5-5-7-1-1-7-5-5 5-4 1-7 7-1 5-5M17 24l5 5 10-11',
  ];
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
