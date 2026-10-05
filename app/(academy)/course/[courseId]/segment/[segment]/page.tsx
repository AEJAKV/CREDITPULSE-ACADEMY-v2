import { courseView } from '@/lib/view';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { LockKeyhole, BookOpen, Check, ShieldCheck } from 'lucide-react';
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
    next = index === enrollment.tier + 1;
  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard">My course</Link>
        <span>/</span>
        <span>{tiers[index]}</span>
      </div>
      <section className={`segment-preview ${locked ? 'locked-preview' : ''}`}>
        <div className="preview-heading">
          <TierBadge tier={index} />
          <span className="chip">
            {locked ? <LockKeyhole size={15} /> : <BookOpen size={15} />}{' '}
            {locked ? (next ? 'Your next level' : 'A future level') : 'Unlocked for you'}
          </span>
        </div>
        <div className="eyebrow">SEGMENT {index + 1} OF 6</div>
        <h1>{course.segmentNames[index]}</h1>
        <p className="lead">{course.segmentDescriptions[index]}</p>
        <div className="preview-lessons">
          <h2>What this level reveals</h2>
          {lessons.map((l) => (
            <div key={l.id} className="preview-row">
              <span>{String(l.number).padStart(2, '0')}</span>
              {locked ? (
                <strong>{l.title}</strong>
              ) : (
                <Link href={`/course/${course.id}/lesson/${l.id}`}>{l.title}</Link>
              )}
              {enrollment.completed.includes(l.id) ? (
                <Check size={18} />
              ) : locked ? (
                <LockKeyhole size={16} />
              ) : (
                <BookOpen size={16} />
              )}
            </div>
          ))}
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
            className="button primary"
            href={`/course/${course.id}/lesson/${lessons.find((l) => !enrollment.completed.includes(l.id))?.id || lessons[0].id}`}
          >
            Continue this segment
          </Link>
        )}
      </section>
    </>
  );
}
