'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Check, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { carouselIcons } from './lesson-interactives';

type Day = { title: string; text: string; detail?: string; icon?: string };

const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

/**
 * Coverflow for day-by-day plans (a `carousel` block whose items are labelled "DAY 4", "DAYS 15–16", or "NUMBER 3").
 * The active day sits in the centre; its neighbours peek in blurred at each side.
 */
export function DayCarousel({
  items,
  label: carouselLabel,
}: {
  items: Day[];
  /** Names the carousel for screen readers; the heading above it is already on the page. */
  label?: string;
}) {
  const labels = items.map((item) => item.detail ?? item.title);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState('');
  const section = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const followFocus = useRef(false);

  const n = items.length;
  const name = (i: number) => titleCase(items[i].title);
  const label = (i: number) => titleCase(labels[i]);
  const number = (i: number) => labels[i].replace(/^(DAYS?|NUMBER)\s*/i, '');
  // "Day 5 of 7" when the label matches its position; otherwise "Day 8 · 1 of 7".
  const position = (i: number) =>
    /^(day|number) \d+$/i.test(label(i)) && number(i) === String(i + 1) ? `${label(i)} of ${n}` : `${label(i)} · ${i + 1} of ${n}`;

  const go = (i: number) => {
    const next = Math.max(0, Math.min(n - 1, i));
    if (next === active) return;
    setActive(next);
    setLive(`${position(next)}: ${name(next)}`);
    // A focused side card loses its button once centred, so focus falls back to the carousel (← / → keep working).
    followFocus.current = !!document.activeElement?.closest('.day-card');
  };
  useEffect(() => {
    if (!followFocus.current) return;
    followFocus.current = false;
    section.current?.focus({ preventScroll: true });
  }, [active]);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    go(active + (e.key === 'ArrowRight' ? 1 : -1));
  };
  const onPointerDown = (e: PointerEvent) => {
    swiped.current = false;
    drag.current = e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = e.clientX - start.x,
      dy = e.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    swiped.current = true;
    go(active + (dx < 0 ? 1 : -1));
  };
  const tabs = [active - 1, active, active + 1].filter((i) => i >= 0 && i < n);

  return (
    <section
      className="day-carousel"
      ref={section}
      tabIndex={-1}
      aria-roledescription="carousel"
      aria-label={carouselLabel || 'Steps'}
      onKeyDown={onKeyDown}
    >
      <div className="day-carousel-tabs" role="tablist" aria-label="Nearby steps">
        {tabs.map((i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => go(i)}
          >
            <b aria-hidden="true">{number(i)}</b>
            <span>{name(i)}</span>
          </button>
        ))}
      </div>
      <div
        className="day-carousel-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        {items.map((item, i) => {
          const offset = Math.max(-2, Math.min(2, i - active));
          const far = Math.abs(offset) === 2;
          const Icon = carouselIcons[item.icon as keyof typeof carouselIcons] ?? Check;
          return (
            <article
              key={labels[i]}
              className="day-card"
              data-offset={offset}
              aria-roledescription="slide"
              aria-label={position(i)}
              aria-hidden={far || undefined}
              inert={far || undefined}
            >
              <div className="day-card-panel">
                <span className="day-card-icon" aria-hidden="true">
                  <Icon size={24} />
                </span>
                <span className="day-card-eyebrow">{labels[i]}</span>
                <h4>{name(i)}</h4>
                <p>{item.text}</p>
              </div>
              {Math.abs(offset) === 1 && (
                <button
                  type="button"
                  className="day-card-hit"
                  aria-label={`Show ${label(i)}: ${name(i)}`}
                  onClick={() => {
                    if (swiped.current) return void (swiped.current = false);
                    go(i);
                  }}
                />
              )}
            </article>
          );
        })}
      </div>
      <p className="day-carousel-hint" aria-hidden="true">
        <MoveHorizontal size={15} /> Swipe or tap a side card
      </p>
      <div className="day-carousel-controls">
        <p className="day-carousel-count">
          <strong>{String(active + 1).padStart(2, '0')}</strong>
          <span>/ {String(n).padStart(2, '0')}</span>
        </p>
        <div className="day-carousel-progress">
          {items.map((_, i) => (
            <button
              key={labels[i]}
              type="button"
              aria-label={`Go to ${label(i)}: ${name(i)}`}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => go(i)}
            >
              <i />
            </button>
          ))}
        </div>
        <div className="day-carousel-arrows">
          <button
            type="button"
            aria-label="Previous"
            aria-disabled={active === 0}
            onClick={() => go(active - 1)}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            aria-disabled={active === n - 1}
            onClick={() => go(active + 1)}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
    </section>
  );
}
