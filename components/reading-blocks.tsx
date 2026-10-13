import { Fragment } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Check,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Gauge,
  FileCheck2,
} from 'lucide-react';
import type { ReadingBlock } from '@/lib/types';
import {
  ScoreExplorer,
  UtilizationCalculator,
  LessonArtworkCarousel,
  CardCarousel,
} from './lesson-interactives';
export function ReadingBlocks({
  blocks,
  checkIn,
}: {
  blocks: ReadingBlock[];
  checkIn?: React.ReactNode;
}) {
  return (
    <>
      {blocks.map((block, i) => {
        const items = block.items || [];
        switch (block.type) {
          case 'paragraph':
            return <p key={i}>{block.text}</p>;
          case 'heading':
            return <h3 key={i}>{block.text}</h3>;
          case 'quote':
            return (
              <blockquote className="reader-quote" key={i}>
                {block.text}
              </blockquote>
            );
          case 'source':
            return (
              <a
                className="inline-source"
                href={block.url?.startsWith('https://') ? block.url : undefined}
                target="_blank"
                rel="noreferrer"
                key={i}
              >
                {block.text}
                <ArrowUpRight size={13} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            );
          case 'score':
            return <ScoreExplorer key={i} />;
          case 'utilization':
            return <UtilizationCalculator key={i} />;
          case 'spotlight':
            return (
              <aside className="pulse-spotlight" key={i}>
                <span className="eyebrow">
                  <Sparkles size={15} /> CREDIT PULSE SPOTLIGHT
                </span>
                <p>{block.text}</p>
              </aside>
            );
          case 'transition':
            return (
              <aside className="reading-transition" key={i}>
                <h3>{block.text}</h3>
                {block.detail && <p className="transition-detail">{block.detail}</p>}
                {block.extra && (
                  <p className="transition-extra">
                    <ArrowRight size={17} aria-hidden="true" />
                    {block.extra}
                  </p>
                )}
              </aside>
            );
          case 'artwork':
            return <LessonArtworkCarousel key={i} items={items} />;
          case 'carousel':
            return <CardCarousel key={i} items={items} />;
          case 'lists':
            return (
              <div className="list-panels" key={i}>
                {items.map((item) => {
                  const alert = item.icon === 'alert';
                  return (
                    <article className={alert ? 'is-alert' : undefined} key={item.title}>
                      {alert ? (
                        <ShieldAlert size={34} aria-hidden="true" />
                      ) : (
                        <ShieldCheck size={34} aria-hidden="true" />
                      )}
                      {item.detail && <span>{item.detail}</span>}
                      <h3>{item.title}</h3>
                      <ul>
                        {item.list?.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            );
          case 'split':
            return (
              <div className="split-feature" key={i}>
                <ol className="split-steps">
                  {items.map((item) => {
                    const Icon =
                      item.icon === 'gauge'
                        ? Gauge
                        : item.icon === 'file'
                          ? FileCheck2
                          : ShieldCheck;
                    return (
                      <li key={item.title}>
                        <Icon size={22} aria-hidden="true" />
                        <strong>{item.title}</strong>
                      </li>
                    );
                  })}
                </ol>
                <div className="split-copy">
                  {block.text && <h3>{block.text}</h3>}
                  {block.paragraphs?.map((text, j) => (
                    <p key={j}>{text}</p>
                  ))}
                  {block.url?.startsWith('https://') && (
                    <a href={block.url} target="_blank" rel="noreferrer">
                      {block.detail || block.url}
                      <ArrowRight size={15} aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            );
          case 'cards':
            return (
              <div className="factor-grid" key={i}>
                {items.map((item, j) => (
                  <article key={item.title}>
                    <span>{String(j + 1).padStart(2, '0')}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            );
          case 'myths':
            return (
              <div className="myth-stack" key={i}>
                {items.map((item) => (
                  <article key={item.title}>
                    <span className="eyebrow">MYTH</span>
                    <h3>{item.title}</h3>
                    <p>
                      <Check size={17} />
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            );
          case 'story':
            if (block.image)
              return (
                <article className="reader-story photo-story" key={i}>
                  <span
                    className="story-photo"
                    style={{ backgroundImage: `url(${block.image})` }}
                    aria-hidden="true"
                  />
                  <div className="story-panel">
                    <span className="eyebrow">{block.detail}</span>
                    <h3>{block.text}</h3>
                    {block.paragraphs?.map((text, j) => (
                      <div key={j} className="story-beat">
                        <p>{text}</p>
                        {j === block.at && items.length > 0 && (
                          <div className="story-timeline">
                            {items.map((item, k) => (
                              <Fragment key={item.title}>
                                {k > 0 && <i aria-hidden="true" />}
                                <span>
                                  <b>{item.title}</b>
                                  {item.text}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              );
            return (
              <article className="reader-story" key={i}>
                <div className="story-masthead">
                  <span className="eyebrow">{block.detail}</span>
                  <h3>{block.text}</h3>
                  {block.extra === undefined && (
                    <div className="story-illustration" aria-hidden="true">
                      <span>
                        74<small>%</small>
                      </span>
                      <i />
                      <span className="snowflake">✧</span>
                    </div>
                  )}
                </div>
                {block.paragraphs?.map((text, j) => (
                  <p key={j}>{text}</p>
                ))}
              </article>
            );
          case 'ordered':
            return (
              <ol className="priority-list" key={i}>
                {items.map((item, j) => (
                  <li key={item.title}>
                    <span>{j + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            );
          case 'chips':
            return (
              <div className="habit-chips" key={i}>
                {items.map((item) => (
                  <span key={item.title}>
                    <Check size={15} />
                    {item.title}
                  </span>
                ))}
              </div>
            );
          case 'accordions':
            return (
              <div className="quick-checks" key={i}>
                {items.map((item, j) => (
                  <details key={item.title}>
                    <summary>
                      <span>{j + 6}</span>
                      {item.title}
                      <Plus size={18} />
                    </summary>
                    <div>
                      <strong>{item.detail}</strong>
                      <p>{item.text}</p>
                    </div>
                  </details>
                ))}
              </div>
            );
          case 'takeaway':
            return (
              <aside className="key-takeaway" key={i}>
                <div className="eyebrow">KEY TAKEAWAY</div>
                <h3>{block.text}</h3>
                <p>{block.detail}</p>
              </aside>
            );
          case 'glossary':
            return (
              <dl className="reader-glossary" key={i}>
                {items.map((item) => (
                  <div key={item.title}>
                    <dt>{item.title}</dt>
                    <dd>{item.text}</dd>
                  </div>
                ))}
              </dl>
            );
          case 'checkin':
            return <div key={i}>{checkIn}</div>;
        }
      })}
    </>
  );
}
