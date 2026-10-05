import { courseView } from '@/lib/view';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Award, Check } from 'lucide-react';
import { requireAccount } from '@/lib/auth';
import { courseComplete, courses, getCourse, tiers } from '@/lib/catalog';
import { TierBadge } from '@/components/ui';
import { ActionButton } from '@/components/forms';
import { CourseArtwork, TierGlyph } from '@/components/visuals';
export default async function Finished({ params }: { params: Promise<{ courseId: string }> }) {
  const p = await params,
    course = await courseView(p.courseId);
  if (!course) notFound();
  const user = await requireAccount(),
    enrollment = user.state.enrollments[course.id];
  if (!enrollment || !courseComplete(course, enrollment.completed)) redirect('/dashboard');
  return (
    <>
      <section className="elite-heading">
        <span className="earned-emblem">
          <TierGlyph tier={5} size={58} />
          <span>
            <Check size={18} />
          </span>
        </span>
        <div className="eyebrow">ELITE · ALL SIX LEVELS COMPLETE</div>
        <h1>Look how far you’ve come.</h1>
        <p className="lead">
          You completed {course.title}. Your knowledge and saved actions stay with you.
        </p>
        <div className="badge-collection">
          {tiers.map((tier, i) => (
            <TierBadge key={tier} tier={i} earned />
          ))}
        </div>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <div className="eyebrow">GO WIDER</div>
            <h2>A new subject. A fresh Starter journey.</h2>
          </div>
        </div>
        <p>
          Your next course begins at Starter. You keep access to everything you completed in this
          course.
        </p>
        <div className="course-grid">
          {courses
            .filter((c) => c.id !== course.id)
            .map((c) => (
              <article className={`course-card course-${c.id}`} key={c.id} data-reveal>
                <div className="course-cover">
                  <CourseArtwork
                    index={courses.findIndex((course) => course.id === c.id)}
                    compact
                  />
                </div>
                <span className="eyebrow">{c.category}</span>
                <h2>{c.title}</h2>
                <p>{c.description}</p>
                <span className="chip">Starter · 6 segments</span>
                {c.ready ? (
                  <ActionButton data={{ action: 'enroll', courseId: c.id }} to="/dashboard">
                    Start this course
                  </ActionButton>
                ) : (
                  <div className="preparation-note">In preparation · available when published</div>
                )}
              </article>
            ))}
        </div>
      </section>
      <Link className="text-link" href="/dashboard">
        Revisit my completed course
      </Link>
    </>
  );
}
