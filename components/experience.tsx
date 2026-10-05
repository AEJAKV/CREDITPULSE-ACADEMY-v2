'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Maximize2, Minimize2, Type } from 'lucide-react';
import { tiers, segmentLessons, segmentComplete } from '@/lib/catalog';
import { TierMedal, type MedalState } from './visuals';
import { AmbientBackground } from './ambient-background';
import type { Course, Enrollment } from '@/lib/types';
export function ExperienceMotion() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animations.push(
              (entry.target as HTMLElement).animate(
                [
                  { opacity: 0.45, transform: 'translateY(14px)' },
                  { opacity: 1, transform: 'translateY(0)' },
                ],
                { duration: 600, easing: 'cubic-bezier(.2,.65,.3,1)' },
              ),
            );
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);
  return null;
}
// Mounted in the academy layout rather than in each page: .page-content keeps a
// transform from its entry animation, which would stop a fixed layer inside it
// from staying fixed to the viewport.
export function AcademyAmbient() {
  const pathname = usePathname();
  if (pathname === '/dashboard' || pathname === '/courses') return <AmbientBackground />;
  // Lessons get a faint, motionless glow so nothing moves behind the reading text.
  if (/^\/course\/[^/]+\/lesson\//.test(pathname))
    return <AmbientBackground intensity="faint" still />;
  return null;
}
const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
export function TierProgress({ course, enrollment }: { course: Course; enrollment: Enrollment }) {
  const current = enrollment.tier;
  const rows = tiers.map((name, i) => {
    const lessons = segmentLessons(course, i);
    const done = lessons.filter((l) => enrollment.completed.includes(l.id)).length;
    const state: MedalState | 'open' = segmentComplete(course, i, enrollment.completed)
      ? 'earned'
      : i === current
        ? 'current'
        : i < current
          ? 'open'
          : i === current + 1
            ? 'next'
            : 'locked';
    return { name, i, state, done, total: lessons.length };
  });
  const left = rows[current].total - rows[current].done;
  const percent = Math.round((enrollment.completed.length / course.total) * 100);
  return (
    <section className="tier-progress" data-reveal>
      <div className="tier-progress-head">
        <div>
          <div className="eyebrow">YOUR PROGRESS</div>
          <h2>
            {left === 0
              ? `${tiers[current]} is complete.`
              : `You’re on ${tiers[current]}. ${COUNT_WORDS[left] ?? left} ${left === 1 ? 'lesson' : 'lessons'} to go.`}
          </h2>
        </div>
        <p>
          <strong>
            {enrollment.completed.length} of {course.total}
          </strong>{' '}
          lessons · {percent}% of the course
        </p>
      </div>
      <ol className="tier-progress-grid" aria-label="Six-tier course progress">
        {rows.map(({ name, i, state, done, total }) => (
          <li key={name} className={`tier-progress-cell is-${state}`}>
            <span aria-hidden="true">
              <TierMedal tier={i} state={state === 'open' ? 'plain' : state} size={56} />
            </span>
            <strong>{name}</strong>
            <span className="tier-pill">
              {state === 'earned' ? (
                'Earned'
              ) : state === 'next' ? (
                'Up next'
              ) : state === 'locked' ? (
                'Locked'
              ) : (
                <>
                  {state === 'current' ? 'Now' : 'Open'} · {done}
                  <span className="pill-of"> of </span>
                  <span className="pill-slash">/</span>
                  {total}
                </>
              )}
            </span>
            <span
              className="tier-bar"
              role="progressbar"
              aria-label={`${name} lessons complete`}
              aria-valuenow={done}
              aria-valuemin={0}
              aria-valuemax={total}
            >
              <span style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function ReaderTools({ sections }: { sections: { id: string; title: string }[] }) {
  const [percent, setPercent] = useState(0),
    [active, setActive] = useState(sections[0]?.id),
    [focus, setFocus] = useState(false),
    [large, setLarge] = useState(false);
  useEffect(() => {
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const article = document.querySelector('.lesson-article');
        if (!article) return;
        const top = article.getBoundingClientRect().top + window.scrollY;
        const length = Math.max(1, article.clientHeight - window.innerHeight);
        setPercent(Math.min(100, Math.max(0, Math.round(((window.scrollY - top) / length) * 100))));
        let current = sections[0]?.id;
        for (const section of sections) {
          const el = document.getElementById(section.id);
          if (el && el.getBoundingClientRect().top < 200) current = section.id;
        }
        setActive(current);
      });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      delete document.body.dataset.focus;
      delete document.body.dataset.largeText;
    };
  }, [sections]);
  return (
    <>
      <div className="reader-toolbar">
        <span className="reader-status">
          <span className="status-dot" /> {percent}% read
        </span>
        <div>
          <button
            className="button quiet"
            aria-pressed={large}
            onClick={() => {
              setLarge(!large);
              document.body.dataset.largeText = String(!large);
            }}
          >
            <Type size={17} />
            <span>Text size</span>
          </button>
          <button
            className="button quiet"
            aria-pressed={focus}
            onClick={() => {
              setFocus(!focus);
              document.body.dataset.focus = String(!focus);
            }}
          >
            {focus ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            <span>{focus ? 'Exit focus' : 'Focus mode'}</span>
          </button>
        </div>
      </div>
      <div className="reader-meter" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <aside className="reading-rail">
        <div className="toc-sticky">
          <span className="eyebrow">IN THIS LESSON</span>
          <nav aria-label="Lesson sections">
            {sections.map((s, i) => (
              <a
                href={`#${s.id}`}
                key={s.id}
                aria-current={active === s.id ? 'location' : undefined}
              >
                <span>{String(i).padStart(2, '0')}</span>
                {s.title}
              </a>
            ))}
          </nav>
          <div className="rail-progress">
            <strong>{percent}%</strong>
            <span>of this lesson explored</span>
          </div>
          <p className="caption">Reading progress is a guide. Your check-in records completion.</p>
        </div>
      </aside>
    </>
  );
}
