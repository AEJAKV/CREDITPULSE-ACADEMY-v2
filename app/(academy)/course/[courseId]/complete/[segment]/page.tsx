import { courseView } from '@/lib/view';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Award, Check, Clock3, LockKeyhole } from 'lucide-react';
import { requireAccount } from '@/lib/auth';
import {
  getCourse,
  tiers,
  segmentComplete,
  segmentDescriptions,
  segmentNames,
} from '@/lib/catalog';
import { getSettings } from '@/lib/store';
import { TierBadge, Progress } from '@/components/ui';
import { ActionButton } from '@/components/forms';
import { TierGlyph } from '@/components/visuals';
export default async function Completion({
  params,
}: {
  params: Promise<{ courseId: string; segment: string }>;
}) {
  const p = await params,
    index = Number(p.segment) - 1,
    course = await courseView(p.courseId);
  if (!course || !Number.isInteger(index) || index < 0 || index > 5) notFound();
  const user = await requireAccount(),
    enrollment = user.state.enrollments[course.id];
  if (!enrollment) redirect('/courses');
  if (index > enrollment.tier) redirect(`/course/${course.id}/segment/${index + 1}`);
  if (!segmentComplete(course, index, enrollment.completed))
    return (
      <section className="empty-state">
        <span className="empty-icon">
          <BookOpenLocal />
        </span>
        <h1>A few small steps to go.</h1>
        <p>
          Complete the lessons and check-ins in {tiers[index]} to celebrate this level and see your
          next offer.
        </p>
        <Link href="/dashboard" className="button primary">
          Continue my lessons
        </Link>
      </section>
    );
  if (index === 5) redirect(`/course/${course.id}/finished`);
  const offer = user.state.offers
      .filter((o) => o.courseId === course.id && o.segment === index)
      .at(-1),
    settings = await getSettings();
  const alreadyOpen = enrollment.tier > index;
  const result = enrollment.segmentResults?.[String(index)];
  const offerDeadline = result?.deadline ?? enrollment.deadline;
  const onTime =
    !offerDeadline ||
    new Date(result?.completedAt || new Date().toISOString()).getTime() <=
      new Date(offerDeadline).getTime();
  return (
    <section className="completion-page">
      <div className="earned-emblem">
        <TierGlyph tier={index} size={58} />
        <span>
          <Check size={18} />
        </span>
      </div>
      <TierBadge tier={index} earned />
      <div className="eyebrow">A SMALL STEP. A REAL MILESTONE.</div>
      <h1>You finished {tiers[index]}.</h1>
      <p className="lead">Your next chapter is one level away.</p>
      <div className="completion-progress">
        <span>
          {enrollment.completed.length} of {course.total} lessons completed
        </span>
        <Progress
          value={Math.round((enrollment.completed.length / course.total) * 100)}
          label="Course completion"
        />
      </div>
      <div className="next-level-card">
        <div className="panel-kicker">
          <LockKeyhole size={17} />
          <span>
            {tiers[index + 1].toUpperCase()} · {alreadyOpen ? 'READY FOR YOU' : 'UP NEXT'}
          </span>
        </div>
        <h2>{course.segmentNames[index + 1]}</h2>
        <p>{course.segmentDescriptions[index + 1]}</p>
        <Link className="text-link" href={`/course/${course.id}/segment/${index + 2}`}>
          Explore the next segment
        </Link>
      </div>
      <div className="reward-note">
        <Clock3 size={20} />
        <div>
          <strong>
            {enrollment.deadline
              ? onTime
                ? 'You finished within your target window.'
                : 'Your learning access stays open.'
              : 'Your progress is saved.'}
          </strong>
          <p>
            {settings.bonusCopy
              ? onTime
                ? settings.bonusCopy
                : 'Your target window has passed. Your course team can review the available re-offer.'
              : 'Bonus terms will appear here when your course team confirms them.'}
          </p>
        </div>
      </div>
      {alreadyOpen ? (
        <Link className="button primary" href={`/course/${course.id}/segment/${index + 2}`}>
          Continue to {tiers[index + 1]}
        </Link>
      ) : offer?.status === 'pending' ? (
        <div className="success-note" role="status">
          <Check size={21} />
          <div>
            <strong>Your request is with the course team.</strong>
            <p>You’ll keep access to your lessons while your cash-back approval is reviewed.</p>
            <Link href="/dashboard">Return to my course</Link>
          </div>
        </div>
      ) : offer?.status === 'not-yet' ? (
        <div className="success-note" role="status">
          <div>
            <strong>Come back when the time feels right.</strong>
            <p>Your access and progress are safe. You can return here to request a new review.</p>
            <ActionButton data={{ action: 'reapply', courseId: course.id, segment: index }}>
              Reapply to claim more cash back
            </ActionButton>
          </div>
        </div>
      ) : (
        <div className="completion-actions">
          <ActionButton data={{ action: 'reapply', courseId: course.id, segment: index }}>
            Reapply to claim more cash back
          </ActionButton>
          <ActionButton
            data={{ action: 'not-now', courseId: course.id, segment: index }}
            className="button quiet"
          >
            Not now — keep learning
          </ActionButton>
          <small>
            Approval determines your next tier. Submitting a request does not guarantee cash back.
          </small>
        </div>
      )}
      <p className="caption">
        Your Master Savings Book adds another level when your new tier is approved.
      </p>
    </section>
  );
}
function BookOpenLocal() {
  return <Check size={32} />;
}
