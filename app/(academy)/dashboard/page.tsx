import { courseView } from '@/lib/view';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, Check, Clock3, LockKeyhole, ChevronDown, Sparkles } from 'lucide-react';
import { requireAccount } from '@/lib/auth';
import {
  getCourse,
  tiers,
  segmentLessons,
  segmentComplete,
  segmentNames,
  segmentDescriptions,
  courseComplete,
} from '@/lib/catalog';
import { getContents, getSettings } from '@/lib/store';
import { Ladder, Progress, SavingsPanel, TierBadge } from '@/components/ui';
import { TierProgress } from '@/components/experience';
import { CourseArtwork, ProgressOrbit } from '@/components/visuals';
export const metadata = { title: 'My learning' };
export default async function Dashboard() {
  const user = await requireAccount();
  const course = await courseView(user.state.activeCourse || '');
  if (!course) redirect('/courses');
  const enrollment = user.state.enrollments[course.id];
  const settings = await getSettings();
  const currentLessons = segmentLessons(course, enrollment.tier);
  const done = currentLessons.filter((l) => enrollment.completed.includes(l.id)).length;
  const next =
    course.lessons.find((l) => l.tier <= enrollment.tier && !enrollment.completed.includes(l.id)) ||
    currentLessons[currentLessons.length - 1];
  const percent = Math.round((enrollment.completed.length / course.lessons.length) * 100);
  const currentDone = segmentComplete(course, enrollment.tier, enrollment.completed);
  const finished = courseComplete(course, enrollment.completed);
  const content = await getContents(course.lessons.map((l) => l.id));
  const published = Object.fromEntries(course.lessons.map((l) => [l.id, content[l.id].published]));
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR LEARNING JOURNEY</div>
          <h1>
            {course.title}
            <span className="heading-dot">.</span>
          </h1>
          <p>{course.description}</p>
        </div>
        <TierBadge tier={enrollment.tier} />
      </div>
      <div className="dashboard-feature-grid">
        <section className="continue-panel" data-reveal>
          <div className="continue-art">
            <CourseArtwork
              index={Math.max(
                0,
                [
                  'credit-mastery',
                  'money-budgeting',
                  'benefits-support',
                  'tax-wealth',
                  'income-business',
                  'health-fitness',
                ].indexOf(course.id),
              )}
            />
          </div>
          <div className="panel-kicker">
            <span className="status-dot" />
            <span>
              {finished
                ? 'COURSE COMPLETE'
                : currentDone
                  ? 'SEGMENT COMPLETE'
                  : 'CONTINUE WHERE YOU LEFT OFF'}
            </span>
          </div>
          <div className="continue-heading">
            <div>
              <span className="caption">
                {tiers[next.tier]} · Lesson {next.number} of {course.total}
              </span>
              <h2>
                {finished
                  ? 'You made it to Elite.'
                  : currentDone
                    ? `${tiers[enrollment.tier]} is in the books.`
                    : next.title}
              </h2>
              <p>
                {finished
                  ? 'A new subject. A fresh Starter journey.'
                  : currentDone
                    ? 'See what your next level has in store.'
                    : 'One lesson. One useful action. Take the next step at your pace.'}
              </p>
            </div>
          </div>
          <Link
            className="button primary"
            href={
              finished
                ? `/course/${course.id}/finished`
                : currentDone
                  ? `/course/${course.id}/complete/${enrollment.tier + 1}`
                  : `/course/${course.id}/lesson/${next.id}`
            }
          >
            {finished
              ? 'Explore your next course'
              : currentDone
                ? 'Celebrate this level'
                : 'Continue lesson'}
          </Link>
          <div className="continue-progress">
            <div>
              <strong>Course progress</strong>
              <span>
                {enrollment.completed.length} of {course.total} lessons · {percent}%
              </span>
            </div>
            <Progress value={percent} label="Course completion" />
          </div>
        </section>
        <SavingsPanel tier={enrollment.tier} copy={settings.savingsCopy} />
      </div>
      <div className="segment-status">
        <div>
          <Clock3 size={21} />
          <span>
            <strong>
              {enrollment.deadline
                ? `Your target: ${new Date(enrollment.deadline).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`
                : 'Learn at your pace'}
            </strong>
            <small>
              {enrollment.deadline
                ? `${Math.max(0, Math.ceil((new Date(enrollment.deadline).getTime() - Date.now()) / 86400000))} days in this window · Your access stays open`
                : 'Your course administrator has not set a target window.'}
            </small>
          </span>
        </div>
        <span>
          {done}/{currentLessons.length} {tiers[enrollment.tier]} lessons complete
        </span>
      </div>
      <div className="learning-snapshot" data-reveal>
        <ProgressOrbit completed={enrollment.completed.length} total={course.total} />
        <div>
          <span className="eyebrow">SMALL STEPS ADD UP</span>
          <h2>{enrollment.completed.length} useful lessons. A stronger next move.</h2>
          <p>
            {course.lessons.filter((l) => l.tier <= enrollment.tier).length} lessons available at
            your {tiers[enrollment.tier]} level. Your next chapter is already in sight.
          </p>
        </div>
        <a href="#curriculum" className="text-link">
          Explore the curriculum ↓
        </a>
      </div>
      <TierProgress course={course} enrollment={enrollment} />
      <section id="curriculum" className="curriculum">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE COMPLETE COURSE</div>
            <h2>Six levels. A clearer picture at every step.</h2>
          </div>
          <span>{course.total} lessons</span>
        </div>
        <div className="segment-panels">
          {tiers.map((tier, i) => {
            const locked = i > enrollment.tier,
              completed = segmentComplete(course, i, enrollment.completed),
              lessons = segmentLessons(course, i);
            return (
              <details
                data-reveal
                className={`segment-panel ${i === enrollment.tier ? 'current' : ''} ${locked ? 'locked' : ''}`}
                key={tier}
                open={i === enrollment.tier}
              >
                <summary>
                  <span className={`segment-number tier-${i}`}>
                    {completed ? (
                      <Check size={22} />
                    ) : locked ? (
                      <LockKeyhole size={20} />
                    ) : (
                      String(i + 1).padStart(2, '0')
                    )}
                  </span>
                  <span className="segment-summary">
                    <span>
                      <strong>{tier}</strong>
                      <small>
                        {completed
                          ? 'Completed'
                          : i === enrollment.tier
                            ? 'Current segment'
                            : locked
                              ? i === enrollment.tier + 1
                                ? 'Your next level'
                                : 'Locked'
                              : 'Unlocked'}
                      </small>
                    </span>
                    <span>{course.segmentNames[i]}</span>
                  </span>
                  <span className="segment-meta">
                    {lessons.length} lessons
                    <ChevronDown size={17} />
                  </span>
                </summary>
                <div className="segment-body">
                  <p>{course.segmentDescriptions[i]}</p>
                  {lessons.map((l) => (
                    <Link
                      href={
                        locked
                          ? `/course/${course.id}/segment/${i + 1}`
                          : `/course/${course.id}/lesson/${l.id}`
                      }
                      className="lesson-row"
                      key={l.id}
                    >
                      <span
                        className={`lesson-state ${enrollment.completed.includes(l.id) ? 'done' : ''}`}
                      >
                        {enrollment.completed.includes(l.id) ? (
                          <Check size={16} />
                        ) : locked ? (
                          <LockKeyhole size={15} />
                        ) : (
                          <BookOpen size={16} />
                        )}
                      </span>
                      <span>
                        <strong>{l.title}</strong>
                        <small>
                          Lesson {l.number}
                          {!published[l.id] && !locked ? ' · In preparation' : ''}
                        </small>
                      </span>
                      <span className="row-status">
                        {locked
                          ? 'Preview'
                          : enrollment.completed.includes(l.id)
                            ? 'Review'
                            : 'Open'}
                      </span>
                    </Link>
                  ))}
                  {locked && (
                    <Link className="text-link" href={`/course/${course.id}/segment/${i + 1}`}>
                      Discover what {tier} reveals
                    </Link>
                  )}
                  {completed && (
                    <Link className="text-link" href={`/course/${course.id}/complete/${i + 1}`}>
                      View segment completion
                    </Link>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>
      <div className="quiet-note">
        <Sparkles size={18} />
        <p>
          Each approved level adds to your course access. Your completed lessons and saved actions
          stay with you.
        </p>
      </div>
    </>
  );
}
