'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, LockKeyhole, Check, Maximize2, Minimize2, Type } from 'lucide-react';
import { tiers, segmentLessons, segmentComplete } from '@/lib/catalog';
import { TierGlyph } from './visuals';
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
export function Journey({ course, enrollment }: { course: Course; enrollment: Enrollment }) {
  const [selected, setSelected] = useState<number>(enrollment.tier);
  const lessons = segmentLessons(course, selected);
  const locked = selected > enrollment.tier;
  return (
    <section className="journey-studio" data-reveal>
      <div className="section-heading">
        <div>
          <div className="eyebrow">YOUR COURSE, UNFOLDING</div>
          <h2>Every level opens a new perspective.</h2>
        </div>
        <span>{enrollment.tier + 1} / 6 levels open</span>
      </div>
      <ol className="journey-nodes" aria-label="Six-tier course journey">
        {tiers.map((tier, i) => {
          const done = segmentComplete(course, i, enrollment.completed);
          return (
            <li
              key={tier}
              className={`${i <= enrollment.tier ? 'unlocked' : 'locked'} ${selected === i ? 'selected' : ''} tier-${i}`}
            >
              <button
                aria-pressed={selected === i}
                aria-label={`${tier}: ${done ? 'completed' : i <= enrollment.tier ? 'unlocked' : 'locked'}`}
                onClick={() => setSelected(i)}
              >
                <span className="journey-medallion">
                  <TierGlyph tier={i} size={35} />
                  <span className="medallion-state">
                    {done ? (
                      <Check size={11} />
                    ) : i > enrollment.tier ? (
                      <LockKeyhole size={10} />
                    ) : (
                      <span />
                    )}
                  </span>
                </span>
                <strong>{tier}</strong>
                <small>
                  {done
                    ? 'Earned'
                    : i === enrollment.tier
                      ? 'Learning now'
                      : i === enrollment.tier + 1
                        ? 'Up next'
                        : i < enrollment.tier
                          ? 'Open'
                          : 'To discover'}
                </small>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="journey-insight" key={selected} aria-live="polite">
        <div>
          <span className="caption">
            SEGMENT {selected + 1} / {lessons.length} LESSONS
          </span>
          <h3>{course.segmentNames[selected]}</h3>
          <p>{lessons.map((l) => l.title).join(' · ')}</p>
        </div>
        <Link
          className={`button ${locked ? 'secondary' : 'primary'}`}
          href={`/course/${course.id}/segment/${selected + 1}`}
        >
          {locked ? `Preview ${tiers[selected]}` : `Explore ${tiers[selected]}`}
          <ArrowUpRight size={16} />
        </Link>
      </div>
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
