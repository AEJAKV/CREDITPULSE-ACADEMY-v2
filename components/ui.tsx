import Link from 'next/link';
import { TierGlyph } from './visuals';
import { Award, Check, LockKeyhole, BookOpen, ShieldCheck } from 'lucide-react';
import { tiers, segmentComplete, segmentLessons } from '@/lib/catalog';
import type { Course, Enrollment } from '@/lib/types';
// The mark is a learning pulse: a steady line, one strong beat, and a milestone dot.
// The same drawing ships as app/icon.svg, so the tab icon and the lockup always match.
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <rect className="logo-mark-tile" width="40" height="40" rx="11" />
      <rect
        className="logo-mark-edge"
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="10.5"
        fill="none"
      />
      <path
        className="logo-mark-line"
        d="M7 22.5h6l2.6-4.6 3.6 8.6 4.6-15.5 3.4 11.5h3.3"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="logo-mark-dot" cx="32.6" cy="22.5" r="2.6" />
    </svg>
  );
}
export function Logo({ light = false, href = '/dashboard' }: { light?: boolean; href?: string }) {
  return (
    <Link
      href={href}
      className={`logo ${light ? 'light' : ''}`}
      aria-label="Credit Pulse Academy home"
    >
      <LogoMark />
      <span className="logo-word">
        <span>Credit Pulse</span>
        <small>Academy</small>
      </span>
    </Link>
  );
}
export function TierBadge({
  tier,
  earned = false,
  small = false,
}: {
  tier: number;
  earned?: boolean;
  small?: boolean;
}) {
  return (
    <span className={`tier-badge tier-${tier} ${small ? 'small' : ''}`}>
      <TierGlyph tier={tier} size={small ? 20 : 25} />
      {tiers[tier]}
      {earned && <Check size={14} aria-label="earned" />}
    </span>
  );
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-wrap">
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
export function Ladder({ course, enrollment }: { course: Course; enrollment: Enrollment }) {
  return (
    <ol className="ladder" aria-label="Six-tier course journey">
      {tiers.map((tier, i) => {
        const complete = segmentComplete(course, i, enrollment.completed),
          unlocked = i <= enrollment.tier;
        return (
          <li
            key={tier}
            className={`${complete ? 'earned' : ''} ${i === enrollment.tier ? 'current' : ''}`}
          >
            <Link
              href={`/course/${course.id}/segment/${i + 1}`}
              aria-label={`${tier}: ${complete ? 'completed' : unlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="ladder-symbol">
                {complete ? (
                  <Check size={19} />
                ) : unlocked ? (
                  <Award size={19} />
                ) : (
                  <LockKeyhole size={17} />
                )}
              </span>
              <strong>{tier}</strong>
              <small>
                {complete
                  ? 'Completed'
                  : i === enrollment.tier
                    ? 'Your level'
                    : unlocked
                      ? 'Open'
                      : i === enrollment.tier + 1
                        ? 'Up next'
                        : 'Locked'}
              </small>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
export function SavingsPanel({ tier, copy }: { tier: number; copy: string }) {
  return (
    <section className="savings-panel">
      <div className="panel-kicker">
        <BookOpen size={18} />
        <span>MASTER SAVINGS BOOK</span>
      </div>
      <h2>
        More knowledge. <br />
        More possibilities.
      </h2>
      <div className="book-levels" aria-label={`${tier + 1} of 6 levels available`}>
        {tiers.map((name, i) => (
          <span
            key={name}
            className={i <= tier ? 'available' : ''}
            title={`${name} ${i <= tier ? 'available' : 'locked'}`}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>
      <p>{copy}</p>
      <Link href="/savings" className="text-link light-link">
        Open my Savings Book
      </Link>
      <div className="savings-footer">
        <ShieldCheck size={15} />
        Included with your membership
      </div>
    </section>
  );
}
export function LessonRows({
  course,
  enrollment,
  published,
}: {
  course: Course;
  enrollment: Enrollment;
  published: Record<string, boolean>;
}) {
  return (
    <div className="lesson-list">
      {course.lessons
        .filter((l) => l.tier <= enrollment.tier)
        .map((l) => (
          <Link className="lesson-row" key={l.id} href={`/course/${course.id}/lesson/${l.id}`}>
            <span className="lesson-state">
              {enrollment.completed.includes(l.id) ? <Check size={16} /> : <BookOpen size={16} />}
            </span>
            <span>
              <strong>{l.title}</strong>
              <small>
                {tiers[l.tier]} · Lesson {l.number}
                {!published[l.id] ? ' · In preparation' : ''}
              </small>
            </span>
          </Link>
        ))}
    </div>
  );
}
export function SegmentCount({
  course,
  tier,
  completed,
}: {
  course: Course;
  tier: number;
  completed: string[];
}) {
  const lessons = segmentLessons(course, tier);
  return (
    <span>
      {lessons.filter((l) => completed.includes(l.id)).length}/{lessons.length} lessons
    </span>
  );
}
