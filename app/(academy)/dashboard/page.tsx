import { courseView } from '@/lib/view';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  LockKeyhole,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
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
import { Progress, SavingsPanel, TierBadge } from '@/components/ui';
import { TierProgress } from '@/components/experience';
import { CourseArtwork, ProgressOrbit, TierMedal } from '@/components/visuals';
import { CountUp, Tilt } from '@/components/motion';
import { AmbientBackground } from '@/components/ambient-background';
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
  const daysLeft = enrollment.deadline
    ? Math.max(0, Math.ceil((new Date(enrollment.deadline).getTime() - Date.now()) / 86400000))
    : 0;
  const published = Object.fromEntries(course.lessons.map((l) => [l.id, content[l.id].published]));
  return (
    <>
      <div className="page-heading dash-heading">
        <div>
          <div className="eyebrow">WELCOME BACK, {user.name.split(' ')[0].toUpperCase()}</div>
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
          <AmbientBackground effects={['pulse']} placement="contained" />
          <Tilt className="continue-art" max={10}>
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
          </Tilt>
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
            className="button primary continue-cta"
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
            <ArrowRight size={18} aria-hidden="true" />
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
      <div className="dash-stats">
        <article className="dash-stat glow-card" data-spotlight data-reveal>
          <ProgressOrbit completed={enrollment.completed.length} total={course.total} />
          <div>
            <span className="dash-stat-label">Course progress</span>
            <strong>
              <CountUp value={enrollment.completed.length} /> of {course.total} lessons
            </strong>
            <small>Small steps add up. Your next chapter is in sight.</small>
          </div>
        </article>
        <article className="dash-stat glow-card" data-spotlight data-reveal>
          <TierMedal tier={enrollment.tier} state="current" size={64} />
          <div>
            <span className="dash-stat-label">{tiers[enrollment.tier]} level</span>
            <strong>
              <CountUp value={done} /> of {currentLessons.length} done
            </strong>
            <span
              className="dash-stat-bar"
              role="progressbar"
              aria-label={`${tiers[enrollment.tier]} lessons complete`}
              aria-valuenow={done}
              aria-valuemin={0}
              aria-valuemax={currentLessons.length}
            >
              <span style={{ width: `${(done / currentLessons.length) * 100}%` }} />
            </span>
            <small>
              {currentDone
                ? 'Level complete. Nicely done.'
                : `${currentLessons.length - done} ${currentLessons.length - done === 1 ? 'lesson' : 'lessons'} to finish ${tiers[enrollment.tier]}`}
            </small>
          </div>
        </article>
        <article className="dash-stat glow-card" data-spotlight data-reveal>
          <span className="dash-stat-icon">
            <CalendarClock size={26} />
          </span>
          <div>
            <span className="dash-stat-label">
              {enrollment.deadline ? 'Your target' : 'Your pace'}
            </span>
            <strong>
              {enrollment.deadline
                ? new Date(enrollment.deadline).toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC',
                  })
                : 'Learn at your pace'}
            </strong>
            <small>
              {enrollment.deadline
                ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} in this window · Your access stays open`
                : 'Your course administrator has not set a target window.'}
            </small>
          </div>
        </article>
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
                    {locked ? (
                      `${lessons.length} lessons`
                    ) : (
                      <span className="segment-mini">
                        <span>
                          {lessons.filter((l) => enrollment.completed.includes(l.id)).length}/
                          {lessons.length}
                        </span>
                        <span className="segment-mini-bar" aria-hidden="true">
                          <span
                            style={{
                              width: `${(lessons.filter((l) => enrollment.completed.includes(l.id)).length / lessons.length) * 100}%`,
                            }}
                          />
                        </span>
                      </span>
                    )}
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
                      className={`lesson-row ${!finished && !currentDone && l.id === next.id ? 'is-next' : ''}`}
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
                            : !finished && !currentDone && l.id === next.id
                              ? 'Up next'
                              : 'Open'}
                        <ArrowRight size={14} aria-hidden="true" />
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
