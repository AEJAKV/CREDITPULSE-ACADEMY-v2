import { ArrowUpRight, Plus, Check, Sparkles } from 'lucide-react';
import type { ReadingBlock } from '@/lib/types';
import { ScoreExplorer, UtilizationCalculator, LessonArtworkCarousel } from './lesson-interactives';
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
                <span className="transition-line" />
                <h3>{block.text}</h3>
                <p>{block.detail}</p>
                <p>{block.extra}</p>
                <ArrowUpRight size={26} />
              </aside>
            );
          case 'artwork':
            return <LessonArtworkCarousel key={i} items={items} />;
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
            return (
              <article className="reader-story" key={i}>
                <div className="story-masthead">
                  <span className="eyebrow">{block.detail}</span>
                  <h3>{block.text}</h3>
                  <div className="story-illustration" aria-hidden="true">
                    <span>
                      74<small>%</small>
                    </span>
                    <i />
                    <span className="snowflake">✧</span>
                  </div>
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
