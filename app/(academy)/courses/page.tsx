import { courses } from '@/lib/catalog';
import { requireAccount } from '@/lib/auth';
import { ActionButton } from '@/components/forms';
import { BookOpen, Check, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Tilt } from '@/components/motion';
import { CourseArtwork, CourseIcon } from '@/components/visuals';
import { segmentLessons, tiers, courseComplete, getCourse } from '@/lib/catalog';
export const metadata = { title: 'Course library' };
export default async function Courses() {
  const user = await requireAccount();
  const active = getCourse(user.state.activeCourse || '');
  const canChoose =
    !active || courseComplete(active, user.state.enrollments[active.id]?.completed || []);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ONE SUBJECT. SIX LEVELS.</div>
          <h1>Choose your next chapter.</h1>
          <p>Six practical courses for the things that matter in everyday life.</p>
        </div>
      </div>
      <div className="quiet-note">
        <ShieldCheck size={20} />
        <p>
          {user.state.activeCourse
            ? 'Your selected course is saved. Finish its Elite segment before beginning another course at Starter.'
            : 'Your first course opens at your approved tier. Your course choice is saved to your member account.'}
        </p>
      </div>
      <div className="course-grid">
        {courses.map((course, i) => {
          const enrolled = user.state.enrollments[course.id];
          const active = user.state.activeCourse === course.id;
          const available = course.ready && (canChoose || enrolled);
          const percent = enrolled
            ? Math.round((enrolled.completed.length / course.total) * 100)
            : 0;
          return (
            <article
              key={course.id}
              className={`course-card course-${course.id} glow-card ${active ? 'is-active' : ''} ${available ? '' : 'is-waiting'}`}
              data-reveal
              data-spotlight
            >
              <div className="course-cover">
                <Tilt className="course-cover-art" max={7}>
                  <CourseArtwork index={i} compact />
                </Tilt>
                <span className="course-cover-chip">
                  {active ? (
                    <>
                      <span className="status-dot" /> Your course · {percent}%
                    </>
                  ) : enrolled ? (
                    <>
                      <Check size={13} /> Enrolled
                    </>
                  ) : available ? (
                    <>
                      <Sparkles size={13} /> Ready to start
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={13} /> Opens after your course
                    </>
                  )}
                </span>
              </div>
              <div className="eyebrow">{course.category}</div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <details className="course-syllabus">
                <summary>
                  Explore all six levels <span>+</span>
                </summary>
                {tiers.map((tier, index) => (
                  <div key={tier}>
                    <strong>{tier}</strong>
                    <ol>
                      {segmentLessons(course, index).map((l) => (
                        <li key={l.id} value={l.number}>
                          {l.title}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </details>
              <div className="course-card-footer">
                {enrolled && (
                  <span
                    className="course-card-progress"
                    role="progressbar"
                    aria-label={`${course.title} progress`}
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: `${percent}%` }} />
                  </span>
                )}
                <span className="course-card-meta">
                  <BookOpen size={14} /> {course.total} lessons · 6 levels
                </span>
                {available ? (
                  <ActionButton
                    className="button primary"
                    data={{ action: 'enroll', courseId: course.id }}
                    to="/dashboard"
                  >
                    {user.state.enrollments[course.id] ? 'Open my course' : 'Choose this course'}
                  </ActionButton>
                ) : (
                  <span className="preparation-note">
                    Finish your current course to begin at Starter.
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
