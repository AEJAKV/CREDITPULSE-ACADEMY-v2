import { courseView } from '@/lib/view';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Clock3, ShieldCheck, Check, ChevronRight, LockKeyhole } from 'lucide-react';
import { requireAccount } from '@/lib/auth';
import { canAccess, courses, getCourse, segmentLessons, tiers, segmentNames } from '@/lib/catalog';
import { getContent } from '@/lib/store';
import { CheckIn, SaveLesson } from '@/components/forms';
import { Progress, TierBadge } from '@/components/ui';
import { ReadingBlocks } from '@/components/reading-blocks';
import { SourceCheckIn } from '@/components/lesson-interactives';
import { ReaderTools } from '@/components/experience';
import { TierGlyph } from '@/components/visuals';
// Lesson id → background photo for the lesson hero (files live under public/images).
const heroImages: Record<string, string> = {
  'credit-01': '/images/credit-mastery/01-starter/credit-01/hero-image.webp',
  'credit-02': '/images/credit-mastery/01-starter/credit-02/hero-image.webp',
  'credit-03': '/images/credit-mastery/01-starter/credit-03/hero-image.webp',
  'credit-04': '/images/credit-mastery/01-starter/credit-04/hero-image.webp',
  'credit-05': '/images/credit-mastery/02-silver/credit-05/hero-image.webp',
  'credit-06': '/images/credit-mastery/02-silver/credit-06/hero-image.webp',
  'credit-07': '/images/credit-mastery/02-silver/credit-07/hero-image.webp',
  'credit-08': '/images/credit-mastery/02-silver/credit-08/hero-image.webp',
  'credit-09': '/images/credit-mastery/03-gold/credit-09/hero-image.webp',
  'credit-10': '/images/credit-mastery/03-gold/credit-10/hero-image.webp',
  'money-01': '/images/money-budgeting/01-starter/money-01/hero-image.webp',
  'money-02': '/images/money-budgeting/01-starter/money-02/hero-image.webp',
  'money-03': '/images/money-budgeting/01-starter/money-03/hero-image.webp',
  'money-04': '/images/money-budgeting/01-starter/money-04/hero-image.webp',
  'money-05': '/images/money-budgeting/02-silver/money-05/hero-image.webp',
  'money-06': '/images/money-budgeting/02-silver/money-06/hero-image.webp',
  'money-07': '/images/money-budgeting/02-silver/money-07/hero-image.webp',
  'money-08': '/images/money-budgeting/02-silver/money-08/hero-image.webp',
  'benefits-01': '/images/benefits-support/01-starter/benefits-01/hero-image.webp',
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const p = await params;
  const lesson = getCourse(p.courseId)?.lessons.find((l) => l.id === p.lessonId);
  return { title: lesson?.title || 'Lesson' };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const p = await params,
    user = await requireAccount(),
    course = await courseView(p.courseId);
  if (!course) notFound();
  const lesson = course.lessons.find((l) => l.id === p.lessonId);
  if (!lesson) notFound();
  const enrollment = user.state.enrollments[course.id];
  if (!enrollment) redirect('/courses');
  if (!canAccess(enrollment.tier, lesson.tier))
    redirect(`/course/${course.id}/segment/${lesson.tier + 1}`);
  const content = await getContent(lesson.id),
    completed = enrollment.completed.includes(lesson.id);
  const lessons = segmentLessons(course, lesson.tier),
    isLast = lessons[lessons.length - 1].id === lesson.id;
  const next = course.lessons.find((l) => l.number === lesson.number + 1);
  const nextPath = isLast
    ? `/course/${course.id}/complete/${lesson.tier + 1}`
    : next
      ? `/course/${course.id}/lesson/${next.id}`
      : '/dashboard';
  if (!content.published)
    return (
      <section className="empty-state">
        <BookPreparation />
        <div className="eyebrow">
          {tiers[lesson.tier]} · LESSON {lesson.number}
        </div>
        <h1>{lesson.title}</h1>
        <p>
          This lesson is being prepared. Your tier already includes access; it will become available
          when your course team publishes it.
        </p>
        <Link className="button primary" href="/dashboard">
          Back to my course
        </Link>
      </section>
    );
  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard">{course.title}</Link>
        <ChevronRight size={13} />
        <Link href={`/course/${course.id}/segment/${lesson.tier + 1}`}>{tiers[lesson.tier]}</Link>
        <ChevronRight size={13} />
        <span>Lesson {lesson.number}</span>
      </div>
      <div className="lesson-topline">
        <TierBadge tier={lesson.tier} small />
        <span>
          {completed
            ? 'Completed · ready to review'
            : `Lesson ${lessons.indexOf(lesson) + 1} of ${lessons.length} in this segment`}
        </span>
        <SaveLesson
          courseId={course.id}
          lessonId={lesson.id}
          saved={enrollment.saved.includes(lesson.id)}
        />
      </div>
      <div className="lesson-layout">
        <ReaderTools sections={content.sections.map((s) => ({ id: s.id, title: s.title }))} />
        <article className="lesson-article">
          <header className="lesson-header premium-lesson-hero">
            {heroImages[lesson.id] && (
              <span
                className="lesson-hero-image"
                style={{ backgroundImage: `url(${heroImages[lesson.id]})` }}
                aria-hidden="true"
              />
            )}
            <span className="lesson-hero-glyph">
              <TierGlyph tier={lesson.tier} size={110} />
            </span>
            <div className="eyebrow">
              COURSE {courses.findIndex((c) => c.id === course.id) + 1}.{lesson.number} ·{' '}
              {course.short.toUpperCase()} FOUNDATIONS
            </div>
            <h1>{content.title}</h1>
            {content.subtitle && <p className="lesson-subtitle">{content.subtitle}</p>}
            <p className="lead">{content.summary}</p>
            <div className="lesson-chips">
              <span>
                <Clock3 size={16} />
                {lesson.id === 'credit-01' ? '35–45 minutes' : `${content.minutes} minutes`}
              </span>
              <span>
                <Check size={16} />
                One course check-in
              </span>
            </div>
            <a href="#start" className="button primary lesson-start">
              Start learning <ChevronRight size={16} />
            </a>
            <Progress
              value={Math.round((enrollment.completed.length / course.total) * 100)}
              label="Completed course lessons"
            />
          </header>
          <details className="mobile-toc">
            <summary>On this page</summary>
            {content.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
            {!content.checkIn && <a href="#check-in">Quick check & your action</a>}
          </details>
          {content.sections.map((section) => (
            <section
              id={section.id}
              key={section.id}
              data-reveal
              className={`reading-section ${section.kind ? `callout ${section.kind}` : ''}`}
            >
              <div className="reading-section-label">
                {String(content.sections.indexOf(section)).padStart(2, '0')} / {course.category}
              </div>
              <h2>{section.title}</h2>
              {section.blocks && (
                <ReadingBlocks
                  blocks={section.blocks}
                  checkIn={
                    content.checkIn && (
                      <SourceCheckIn
                        courseId={course.id}
                        lessonId={lesson.id}
                        courseNumber={`${courses.findIndex((c) => c.id === course.id) + 1}.${lesson.number}`}
                        {...content.checkIn}
                        name={user.name}
                        email={user.email}
                        saved={enrollment.checkIns?.[lesson.id]?.answers}
                        completed={completed}
                        next={nextPath}
                      />
                    )
                  }
                />
              )}
              {section.paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </section>
          ))}
          {isLast && lesson.tier < 5 && (
            <section className="cliffhanger">
              <div>
                <LockKeyhole size={19} />
                <span>COMING UP IN {tiers[lesson.tier + 1].toUpperCase()}</span>
              </div>
              <h2>{course.segmentNames[lesson.tier + 1]}</h2>
              <p>
                Your foundations lead somewhere. Your next level explores{' '}
                {segmentLessons(course, lesson.tier + 1)
                  .map((l) => l.title.toLowerCase())
                  .join(', ')}
                .
              </p>
              <Link href={`/course/${course.id}/segment/${lesson.tier + 2}`} className="text-link">
                Preview your next level
              </Link>
            </section>
          )}
          {!content.checkIn && (
            <div id="check-in">
              <CheckIn
                key={lesson.id}
                courseId={course.id}
                lessonId={lesson.id}
                quiz={content.quiz}
                reflection={enrollment.reflections[lesson.id]}
                completed={completed}
                next={nextPath}
              />
            </div>
          )}
          {content.sources.length > 0 && (
            <section className="sources">
              <h2>Go straight to the source</h2>
              <ul>
                {content.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="caption">
                Educational information. Approval decisions and score changes depend on your
                circumstances and the provider.
              </p>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
function BookPreparation() {
  return (
    <span className="empty-icon">
      <Clock3 size={30} />
    </span>
  );
}
