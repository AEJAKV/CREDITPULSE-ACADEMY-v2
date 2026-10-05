import { courseView } from '@/lib/view';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, Check, LockKeyhole } from 'lucide-react';
import { requireAccount } from '@/lib/auth';
import { getSettings } from '@/lib/store';
import { getCourse, tiers, segmentNames, segmentComplete } from '@/lib/catalog';
import { PrintButton } from '@/components/forms';
export const metadata = { title: 'Master Savings Book' };
export default async function Savings() {
  const user = await requireAccount(),
    course = await courseView(user.state.activeCourse || '');
  if (!course) redirect('/courses');
  const enrollment = user.state.enrollments[course.id],
    settings = await getSettings();
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR MEMBERSHIP COMPANION</div>
          <h1>Master Savings Book</h1>
          <p>
            Keep your useful actions in one place. Add another chapter with every approved level.
          </p>
        </div>
        <PrintButton />
      </div>
      <section className="book-intro">
        <BookOpen size={37} />
        <div>
          <h2>{enrollment.tier + 1} levels available. Room to grow.</h2>
          <p>{settings.savingsCopy}</p>
        </div>
      </section>
      <div className="savings-chapters">
        {tiers.map((tier, i) => (
          <section key={tier} className={`savings-chapter ${i > enrollment.tier ? 'muted' : ''}`}>
            <div className="section-heading">
              <h2>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {tier}
              </h2>
              {i > enrollment.tier ? (
                <LockKeyhole size={20} />
              ) : segmentComplete(course, i, enrollment.completed) ? (
                <Check size={20} />
              ) : (
                <BookOpen size={20} />
              )}
            </div>
            <h3>{course.segmentNames[i]}</h3>
            {i > enrollment.tier ? (
              <p>This chapter becomes available with {tier} approval.</p>
            ) : (
              <>
                <p>
                  Your approved membership includes this level. Cash-back amounts and additional
                  benefits will appear when confirmed by the course team.
                </p>
                {course.lessons
                  .filter((l) => l.tier === i && enrollment.reflections[l.id])
                  .map((l) => (
                    <div className="saved-action" key={l.id}>
                      <strong>{l.title}</strong>
                      <p>{enrollment.reflections[l.id]}</p>
                    </div>
                  ))}
                {!course.lessons.some((l) => l.tier === i && enrollment.reflections[l.id]) && (
                  <p className="caption">
                    Your lesson actions will appear here after you save a check-in.
                  </p>
                )}
              </>
            )}
          </section>
        ))}
      </div>
      <section className="saved-lessons">
        <h2>Your saved lessons</h2>
        {enrollment.saved.length ? (
          enrollment.saved.map((id) => {
            const lesson = course.lessons.find((l) => l.id === id);
            return (
              lesson && (
                <Link className="lesson-row" key={id} href={`/course/${course.id}/lesson/${id}`}>
                  {lesson.title}
                </Link>
              )
            );
          })
        ) : (
          <p>Use “Save lesson” on any lesson to keep a shortcut here.</p>
        )}
      </section>
    </>
  );
}
