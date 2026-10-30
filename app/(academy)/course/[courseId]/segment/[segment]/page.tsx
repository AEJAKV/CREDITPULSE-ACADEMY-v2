import { courseView } from '@/lib/view';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, LockKeyhole, BookOpen, Check, ShieldCheck } from 'lucide-react';
import { requireAccount } from '@/lib/auth';
import {
  getCourse,
  tiers,
  segmentLessons,
  segmentNames,
  segmentDescriptions,
  segmentComplete,
} from '@/lib/catalog';
import { TierBadge } from '@/components/ui';
import { TierMedal } from '@/components/visuals';
import { CountUp } from '@/components/motion';
export default async function Segment({
  params,
}: {
  params: Promise<{ courseId: string; segment: string }>;
}) {
  const p = await params,
    course = await courseView(p.courseId),
    index = Number(p.segment) - 1;
  if (!course || !Number.isInteger(index) || index < 0 || index > 5) notFound();
  const user = await requireAccount(),
    enrollment = user.state.enrollments[course.id];
  if (!enrollment) redirect('/courses');
  const locked = index > enrollment.tier,
    lessons = segmentLessons(course, index),
    next = index === enrollment.tier + 1,
    doneCount = lessons.filter((l) => enrollment.completed.includes(l.id)).length,
    upNext = lessons.find((l) => !enrollment.completed.includes(l.id));
  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard">My course</Link>
        <span>/</span>
        <span>{tiers[index]}</span>
      </div>
      <section className={`segment-preview ${locked ? 'locked-preview' : ''}`}>
        <div className="segment-hero">
          <div>
            <div className="preview-heading">
              <TierBadge tier={index} />
              <span className="chip">
                {locked ? <LockKeyhole size={15} /> : <BookOpen size={15} />}{' '}
                {locked ? (next ? 'Your next level' : 'A future level') : 'Unlocked for you'}
              </span>
            </div>
            <div className="eyebrow">LEVEL {index + 1} OF 6</div>
            <h1>{course.segmentNames[index]}</h1>
            <p className="lead">{course.segmentDescriptions[index]}</p>
          </div>
          <div className={`segment-hero-medal ${locked ? 'is-locked' : ''}`} aria-hidden="true">
            <TierMedal
              tier={index}
              state={
                segmentComplete(course, index, enrollment.completed)
                  ? 'earned'
                  : locked
                    ? next
                      ? 'next'
                      : 'locked'
                    : 'current'
              }
              size={112}
            />
            {!locked && (
              <span>
                <CountUp value={doneCount} /> of {lessons.length} complete
              </span>
            )}
          </div>
        </div>
        {!locked && (
          <span
            className="segment-progress"
            role="progressbar"
            aria-label={`${tiers[index]} lessons complete`}
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={lessons.length}
          >
            <span style={{ width: `${(doneCount / lessons.length) * 100}%` }} />
          </span>
        )}
        <div className="preview-lessons">
          <h2>{locked ? 'What this level reveals' : 'Lessons in this level'}</h2>
          <ol className="segment-lessons">
            {lessons.map((l) => {
              const done = enrollment.completed.includes(l.id);
              const isNext = !locked && l.id === upNext?.id;
              const body = (
                <>
                  <span className="segment-lesson-num">
                    {done ? <Check size={18} /> : String(l.number).padStart(2, '0')}
                  </span>
                  <span className="segment-lesson-text">
                    <strong>{l.title}</strong>
                    <small>Lesson {l.number}</small>
                  </span>
                  <span className="segment-lesson-status">
                    {locked ? (
                      <>
                        <LockKeyhole size={14} /> Locked
                      </>
                    ) : done ? (
                      'Review'
                    ) : isNext ? (
                      'Up next'
                    ) : (
                      'Open'
                    )}
                  </span>
                  {!locked && <ArrowRight className="segment-lesson-arrow" size={18} />}
                </>
              );
              return (
                <li
                  key={l.id}
                  className={`segment-lesson ${done ? 'is-done' : ''} ${isNext ? 'is-next' : ''} ${locked ? 'is-locked' : ''}`}
                >
                  {locked ? (
                    <div>{body}</div>
                  ) : (
                    <Link
                      href={`/course/${course.id}/lesson/${l.id}`}
                      data-spotlight
                      className="glow-card"
                    >
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        {locked ? (
          <div className="preview-footer">
            <ShieldCheck size={22} />
            <div>
              <h2>More cash back. Your next chapter.</h2>
              <p>
                Finish your current segment, then reapply to claim more cash back. A verified
                higher-tier approval opens the next level. You keep your earlier lessons.
              </p>
              <Link
                className="button primary"
                href={
                  segmentComplete(course, enrollment.tier, enrollment.completed)
                    ? `/course/${course.id}/complete/${enrollment.tier + 1}`
                    : '/dashboard'
                }
              >
                {segmentComplete(course, enrollment.tier, enrollment.completed)
                  ? 'View my next step'
                  : 'Continue my current level'}
              </Link>
            </div>
          </div>
        ) : (
          <Link
            className="button primary continue-cta"
            href={`/course/${course.id}/lesson/${(upNext || lessons[0]).id}`}
          >
            {upNext
              ? doneCount
                ? 'Continue this level'
                : 'Start this level'
              : 'Review this level'}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        )}
      </section>
    </>
  );
}
