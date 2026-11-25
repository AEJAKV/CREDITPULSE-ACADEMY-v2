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
  'credit-11': '/images/credit-mastery/03-gold/credit-11/hero-image.webp',
  'credit-12': '/images/credit-mastery/04-platinum/credit-12/hero-image.webp',
  'credit-13': '/images/credit-mastery/04-platinum/credit-13/hero-image.webp',
  'credit-14': '/images/credit-mastery/04-platinum/credit-14/hero-image.webp',
  'credit-15': '/images/credit-mastery/05-diamond/credit-15/hero-image.webp',
  'credit-16': '/images/credit-mastery/05-diamond/credit-16/hero-image.webp',
  'credit-17': '/images/credit-mastery/05-diamond/credit-17/hero-image.webp',
  'credit-18': '/images/credit-mastery/06-elite/credit-18/hero-image.webp',
  'credit-19': '/images/credit-mastery/06-elite/credit-19/hero-image.webp',
  'credit-20': '/images/credit-mastery/06-elite/credit-20/hero-image.webp',
  'money-01': '/images/money-budgeting/01-starter/money-01/hero-image.webp',
  'money-02': '/images/money-budgeting/01-starter/money-02/hero-image.webp',
  'money-03': '/images/money-budgeting/01-starter/money-03/hero-image.webp',
  'money-04': '/images/money-budgeting/01-starter/money-04/hero-image.webp',
  'money-05': '/images/money-budgeting/02-silver/money-05/hero-image.webp',
  'money-06': '/images/money-budgeting/02-silver/money-06/hero-image.webp',
  'money-07': '/images/money-budgeting/02-silver/money-07/hero-image.webp',
  'money-08': '/images/money-budgeting/02-silver/money-08/hero-image.webp',
  'money-09': '/images/money-budgeting/03-gold/money-09/hero-image.webp',
  'money-10': '/images/money-budgeting/03-gold/money-10/hero-image.webp',
  'money-11': '/images/money-budgeting/03-gold/money-11/hero-image.webp',
  'money-12': '/images/money-budgeting/04-platinum/money-12/hero-image.webp',
  'money-13': '/images/money-budgeting/04-platinum/money-13/hero-image.webp',
  'money-14': '/images/money-budgeting/04-platinum/money-14/hero-image.webp',
  'money-15': '/images/money-budgeting/05-diamond/money-15/hero-image.webp',
  'money-16': '/images/money-budgeting/05-diamond/money-16/hero-image.webp',
  'money-17': '/images/money-budgeting/05-diamond/money-17/hero-image.webp',
  'money-18': '/images/money-budgeting/06-elite/money-18/hero-image.webp',
  'money-19': '/images/money-budgeting/06-elite/money-19/hero-image.webp',
  'money-20': '/images/money-budgeting/06-elite/money-20/hero-image.webp',
  'benefits-01': '/images/benefits-support/01-starter/benefits-01/hero-image.webp',
  'benefits-02': '/images/benefits-support/01-starter/benefits-02/hero-image.webp',
  'benefits-03': '/images/benefits-support/01-starter/benefits-03/hero-image.webp',
  'benefits-04': '/images/benefits-support/01-starter/benefits-04/hero-image.webp',
  'benefits-05': '/images/benefits-support/01-starter/benefits-05/hero-image.webp',
  'benefits-06': '/images/benefits-support/02-silver/benefits-06/hero-image.webp',
  'benefits-07': '/images/benefits-support/02-silver/benefits-07/hero-image.webp',
  'benefits-08': '/images/benefits-support/02-silver/benefits-08/hero-image.webp',
  'benefits-09': '/images/benefits-support/02-silver/benefits-09/hero-image.webp',
  'benefits-10': '/images/benefits-support/02-silver/benefits-10/hero-image.webp',
  'benefits-11': '/images/benefits-support/03-gold/benefits-11/hero-image.webp',
  'benefits-12': '/images/benefits-support/03-gold/benefits-12/hero-image.webp',
  'benefits-13': '/images/benefits-support/03-gold/benefits-13/hero-image.webp',
  'benefits-14': '/images/benefits-support/03-gold/benefits-14/hero-image.webp',
  'benefits-15': '/images/benefits-support/03-gold/benefits-15/hero-image.webp',
  'benefits-16': '/images/benefits-support/04-platinum/benefits-16/hero-image.webp',
  'benefits-17': '/images/benefits-support/04-platinum/benefits-17/hero-image.webp',
  'benefits-18': '/images/benefits-support/04-platinum/benefits-18/hero-image.webp',
  'benefits-19': '/images/benefits-support/04-platinum/benefits-19/hero-image.webp',
  'benefits-20': '/images/benefits-support/04-platinum/benefits-20/hero-image.webp',
  'benefits-21': '/images/benefits-support/05-diamond/benefits-21/hero-image.webp',
  'benefits-22': '/images/benefits-support/05-diamond/benefits-22/hero-image.webp',
  'benefits-23': '/images/benefits-support/05-diamond/benefits-23/hero-image.webp',
  'benefits-24': '/images/benefits-support/05-diamond/benefits-24/hero-image.webp',
  'benefits-25': '/images/benefits-support/05-diamond/benefits-25/hero-image.webp',
  'benefits-26': '/images/benefits-support/06-elite/benefits-26/hero-image.webp',
  'benefits-27': '/images/benefits-support/06-elite/benefits-27/hero-image.webp',
  'benefits-28': '/images/benefits-support/06-elite/benefits-28/hero-image.webp',
  'benefits-29': '/images/benefits-support/06-elite/benefits-29/hero-image.webp',
  'benefits-30': '/images/benefits-support/06-elite/benefits-30/hero-image.webp',
  'tax-01': '/images/tax-wealth/01-starter/tax-01/hero-image.webp',
  'tax-02': '/images/tax-wealth/01-starter/tax-02/hero-image.webp',
  'tax-03': '/images/tax-wealth/01-starter/tax-03/hero-image.webp',
  'tax-04': '/images/tax-wealth/01-starter/tax-04/hero-image.webp',
  'tax-05': '/images/tax-wealth/02-silver/tax-05/hero-image.webp',
  'tax-06': '/images/tax-wealth/02-silver/tax-06/hero-image.webp',
  'tax-07': '/images/tax-wealth/02-silver/tax-07/hero-image.webp',
  'tax-08': '/images/tax-wealth/02-silver/tax-08/hero-image.webp',
  'tax-09': '/images/tax-wealth/03-gold/tax-09/hero-image.webp',
  'tax-10': '/images/tax-wealth/03-gold/tax-10/hero-image.webp',
  'tax-11': '/images/tax-wealth/03-gold/tax-11/hero-image.webp',
  'tax-12': '/images/tax-wealth/04-platinum/tax-12/hero-image.webp',
  'tax-13': '/images/tax-wealth/04-platinum/tax-13/hero-image.webp',
  'tax-14': '/images/tax-wealth/04-platinum/tax-14/hero-image.webp',
  'tax-18': '/images/tax-wealth/06-elite/tax-18/hero-image.webp',
  'tax-19': '/images/tax-wealth/06-elite/tax-19/hero-image.webp',
  'tax-20': '/images/tax-wealth/06-elite/tax-20/hero-image.webp',
  'income-11': '/images/income-business/03-gold/income-11/hero-image.webp',
  'income-12': '/images/income-business/04-platinum/income-12/hero-image.webp',
  'income-13': '/images/income-business/04-platinum/income-13/hero-image.webp',
  'income-14': '/images/income-business/04-platinum/income-14/hero-image.webp',
  'income-15': '/images/income-business/05-diamond/income-15/hero-image.webp',
  'income-16': '/images/income-business/05-diamond/income-16/hero-image.webp',
  'income-17': '/images/income-business/05-diamond/income-17/hero-image.webp',
  'health-01': '/images/health-fitness/01-starter/health-01/hero-image.webp',
  'health-02': '/images/health-fitness/01-starter/health-02/hero-image.webp',
  'health-03': '/images/health-fitness/01-starter/health-03/hero-image.webp',
  'health-04': '/images/health-fitness/01-starter/health-04/hero-image.webp',
  'health-05': '/images/health-fitness/01-starter/health-05/hero-image.webp',
  'health-06': '/images/health-fitness/02-silver/health-06/hero-image.webp',
  'health-07': '/images/health-fitness/02-silver/health-07/hero-image.webp',
  'health-08': '/images/health-fitness/02-silver/health-08/hero-image.webp',
  'health-09': '/images/health-fitness/02-silver/health-09/hero-image.webp',
  'health-10': '/images/health-fitness/02-silver/health-10/hero-image.webp',
  'health-11': '/images/health-fitness/03-gold/health-11/hero-image.webp',
  'health-12': '/images/health-fitness/03-gold/health-12/hero-image.webp',
  'health-13': '/images/health-fitness/03-gold/health-13/hero-image.webp',
  'health-14': '/images/health-fitness/03-gold/health-14/hero-image.webp',
  'health-15': '/images/health-fitness/03-gold/health-15/hero-image.webp',
  'health-16': '/images/health-fitness/04-platinum/health-16/hero-image.webp',
  'health-17': '/images/health-fitness/04-platinum/health-17/hero-image.webp',
  'health-18': '/images/health-fitness/04-platinum/health-18/hero-image.webp',
  'health-19': '/images/health-fitness/04-platinum/health-19/hero-image.webp',
  'health-21': '/images/health-fitness/05-diamond/health-21/hero-image.webp',
  'health-22': '/images/health-fitness/05-diamond/health-22/hero-image.webp',
  'health-23': '/images/health-fitness/05-diamond/health-23/hero-image.webp',
  'health-24': '/images/health-fitness/05-diamond/health-24/hero-image.webp',
  'health-25': '/images/health-fitness/05-diamond/health-25/hero-image.webp',
  'health-26': '/images/health-fitness/06-elite/health-26/hero-image.webp',
  'health-27': '/images/health-fitness/06-elite/health-27/hero-image.webp',
  'health-28': '/images/health-fitness/06-elite/health-28/hero-image.webp',
  'health-29': '/images/health-fitness/06-elite/health-29/hero-image.webp',
  'health-30': '/images/health-fitness/06-elite/health-30/hero-image.webp',
  'tax-15': '/images/tax-wealth/05-diamond/tax-15/hero-image.webp',
  'tax-16': '/images/tax-wealth/05-diamond/tax-16/hero-image.webp',
  'tax-17': '/images/tax-wealth/05-diamond/tax-17/hero-image.webp',
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
        <article className="lesson-article" data-course={course.id}>
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
              <div className="lesson-section-head">
                <span className="lesson-section-num" aria-hidden="true">
                  {String(content.sections.indexOf(section) + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="lesson-section-of">
                    Section {content.sections.indexOf(section) + 1} of {content.sections.length}
                  </span>
                  <h2>{section.title}</h2>
                </div>
              </div>
              {section.blocks && (
                <ReadingBlocks
                  blocks={section.blocks}
                  heading={section.title}
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
              {(section.paragraphs ?? []).map((text, i) => (
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
